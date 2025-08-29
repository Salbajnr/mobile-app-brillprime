
'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const resetPasswordSchema = z
  .object({
    // In a real app, a secure token from the URL would be used here instead of email
    email: z.string().email(), 
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'], // path of error
  });

export type FormState = {
  message: string;
  success: boolean;
};

async function hashPassword(password: string): Promise<string> {
    // In a real app, you'd use bcrypt or argon2.
    return `hashed_${password}`;
}

export async function resetPassword(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = resetPasswordSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors)[0]?.[0];
    return {
      message: firstError || 'Invalid input.',
      success: false,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      // Should not happen in a real flow where the token identifies the user
      return { message: 'User not found.', success: false };
    }
    
    // In a real app, you'd also validate the reset token from the URL here
    // e.g., verify it hasn't expired and matches a stored token hash.

    const newPasswordHash = await hashPassword(password);

    await db.update(users)
      .set({ passwordHash: newPasswordHash })
      .where(eq(users.id, user.id));

    return { message: 'Your password has been reset successfully.', success: true };
  } catch (error) {
    console.error('Password reset failed:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      success: false,
    };
  }
}
