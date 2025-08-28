
'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const requestPasswordResetSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export type FormState = {
  message: string;
  success: boolean;
};

export async function requestPasswordReset(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = requestPasswordResetSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.email?.[0] || 'Invalid input.',
      success: false,
    };
  }

  const { email } = validatedFields.data;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      // To prevent email enumeration, we return a generic success message
      // even if the user doesn't exist.
      return {
        message: 'If an account with this email exists, a password reset link has been sent.',
        success: true,
      };
    }

    // In a real application, you would:
    // 1. Generate a secure, unique password reset token.
    // 2. Save a hash of the token to the database with the user's ID and an expiry date.
    // 3. Email the user a link containing the token, e.g., /reset-password?token=...

    console.log(`Password reset requested for: ${email}. In a real app, an email would be sent.`);

    return {
      message: 'If an account with this email exists, a password reset link has been sent.',
      success: true,
    };
  } catch (error) {
    console.error('Password reset request failed:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      success: false,
    };
  }
}
