'use server';

import { db } from '@/lib/db';
import { supportTickets, supportResponses, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function getTicketDetails(ticketId: number) {
  try {
    const ticket = await db.query.supportTickets.findFirst({
      where: eq(supportTickets.id, ticketId),
      with: {
        user: true,
        assignedToUser: true,
      },
    });

    if (!ticket) {
      return { error: 'Ticket not found.' };
    }

    const responses = await db.query.supportResponses.findMany({
      where: eq(supportResponses.ticketId, ticketId),
      with: {
        responder: true,
      },
      orderBy: (supportResponses, { asc }) => [asc(supportResponses.createdAt)],
    });

    return { ticket, responses };
  } catch (error) {
    console.error('Failed to get ticket details:', error);
    return { error: 'A database error occurred.' };
  }
}

const addResponseSchema = z.object({
    ticketId: z.number(),
    message: z.string().min(1, "Response message cannot be empty."),
    responderId: z.number(), // Assuming the logged-in admin's ID
});

export async function addTicketResponse(formData: FormData) {
    const validatedFields = addResponseSchema.safeParse({
        ticketId: Number(formData.get('ticketId')),
        message: formData.get('message'),
        responderId: 1, // Placeholder for logged-in admin ID
    });
    
    if(!validatedFields.success) {
        return { success: false, message: 'Invalid input.' };
    }

    const { ticketId, message, responderId } = validatedFields.data;

    try {
        await db.transaction(async tx => {
            await tx.insert(supportResponses).values({
                ticketId,
                message,
                responderId,
                responderType: 'ADMIN',
            });
            await tx.update(supportTickets).set({
                status: 'IN_PROGRESS',
                updatedAt: new Date(),
            }).where(eq(supportTickets.id, ticketId));
        });
        
        revalidatePath(`/admin/support/${ticketId}`);
        return { success: true, message: 'Response added successfully.' };

    } catch (error) {
        console.error("Failed to add response:", error);
        return { success: false, message: 'A database error occurred.' };
    }
}


const updateTicketStatusSchema = z.object({
    ticketId: z.number(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
});

export async function updateTicketStatus(formData: FormData) {
    const validatedFields = updateTicketStatusSchema.safeParse({
        ticketId: Number(formData.get('ticketId')),
        status: formData.get('status'),
    });

    if(!validatedFields.success) {
        return { success: false, message: 'Invalid status.' };
    }

    const { ticketId, status } = validatedFields.data;

    try {
        await db.update(supportTickets).set({
            status,
            updatedAt: new Date(),
            ...(status === 'RESOLVED' || status === 'CLOSED' ? { resolvedAt: new Date() } : {}),
        }).where(eq(supportTickets.id, ticketId));

        revalidatePath(`/admin/support`);
        revalidatePath(`/admin/support/${ticketId}`);
        return { success: true, message: `Ticket status updated to ${status}.`};

    } catch (error) {
        console.error("Failed to update status:", error);
        return { success: false, message: 'A database error occurred.' };
    }
}
