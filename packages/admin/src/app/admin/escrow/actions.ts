
'use server';

import { db } from '@/lib/db';
import {
  disputes,
  escrowTransactions,
  users,
  disputeEvidence,
  type SelectDispute,
  type SelectEscrowTransaction,
  type SelectUser,
  type SelectDisputeEvidence,
} from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export type DisputeDetails = {
  escrowTransaction: SelectEscrowTransaction;
  dispute: SelectDispute;
  customer: SelectUser | null;
  merchant: SelectUser | null;
  evidence: {
    customer: SelectDisputeEvidence[];
    merchant: SelectDisputeEvidence[];
  };
};

export async function getDisputeDetails(
  escrowId: number
): Promise<DisputeDetails | { error: string }> {
  try {
    const escrow = await db.query.escrowTransactions.findFirst({
      where: eq(escrowTransactions.id, escrowId),
    });

    if (!escrow || !escrow.disputeId) {
      return { error: 'Dispute not found for the given escrow transaction.' };
    }

    const dispute = await db.query.disputes.findFirst({
      where: eq(disputes.id, escrow.disputeId),
    });

    if (!dispute) {
      return { error: 'Dispute details not found.' };
    }

    const customer =
      (await db.query.users.findFirst({
        where: eq(users.id, escrow.customerId),
      })) || null;

    const merchant =
      (await db.query.users.findFirst({
        where: eq(users.id, escrow.merchantId || -1),
      })) || null;
      
    const allEvidence = await db.query.disputeEvidence.findMany({
        where: eq(disputeEvidence.disputeId, dispute.id),
    });

    const customerEvidence = allEvidence.filter(e => e.uploadedByUserId === customer?.id);
    const merchantEvidence = allEvidence.filter(e => e.uploadedByUserId === merchant?.id);

    return {
      escrowTransaction: escrow,
      dispute,
      customer,
      merchant,
      evidence: {
        customer: customerEvidence,
        merchant: merchantEvidence,
      }
    };
  } catch (error) {
    console.error('Failed to get dispute details:', error);
    return { error: 'A database error occurred.' };
  }
}

const resolveDisputeSchema = z.object({
  disputeId: z.number(),
  resolution: z.enum(['REFUND_CUSTOMER', 'RELEASE_TO_MERCHANT']),
  adminNotes: z.string().min(1, 'Admin notes are required.'),
  adminUserId: z.number(), // This should come from the logged-in admin's session
});

export async function resolveDispute(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
    const validatedFields = resolveDisputeSchema.safeParse({
        disputeId: Number(formData.get('disputeId')),
        resolution: formData.get('resolution'),
        adminNotes: formData.get('adminNotes'),
        adminUserId: 1, // Placeholder for logged-in admin user ID
    });

    if(!validatedFields.success) {
        return { success: false, message: validatedFields.error.flatten().fieldErrors.adminNotes?.[0] || "Invalid input." };
    }

    const { disputeId, resolution, adminNotes, adminUserId } = validatedFields.data;

    try {
        const dispute = await db.query.disputes.findFirst({
            where: eq(disputes.id, disputeId),
        });

        if (!dispute) {
            return { success: false, message: 'Dispute not found.' };
        }

        const newEscrowStatus = resolution === 'REFUND_CUSTOMER' ? 'REFUNDED' : 'RELEASED';

        await db.transaction(async (tx) => {
            await tx.update(disputes).set({
                status: 'RESOLVED',
                resolution: adminNotes,
                resolvedBy: adminUserId,
                resolvedAt: new Date(),
            }).where(eq(disputes.id, disputeId));

            await tx.update(escrowTransactions).set({
                status: newEscrowStatus,
                releasedAt: resolution === 'RELEASE_TO_MERCHANT' ? new Date() : undefined,
                releasedBy: resolution === 'RELEASE_TO_MERCHANT' ? adminUserId : undefined,
            }).where(eq(escrowTransactions.disputeId, disputeId));
        });

        revalidatePath('/admin/escrow');
        return { success: true, message: `Dispute resolved. Funds will be ${newEscrowStatus === 'REFUNDED' ? 'refunded to customer' : 'released to merchant'}.`};
    } catch (error) {
        console.error("Failed to resolve dispute:", error);
        return { success: false, message: 'A database error occurred.' };
    }
}
