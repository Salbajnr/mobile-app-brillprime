
'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export type FormState = {
  message: string;
  errors?: Record<string, string[] | undefined>;
};

async function verifyPassword(password: string, hash: string): Promise<boolean> {
    // In a real app, you'd use bcrypt.compare or argon2.verify.
    // For this prototype, we are simulating the hash comparison.
    return `hashed_${password}` === hash;
}

export async function signIn(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = signInSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: 'Invalid input.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { email, password } = validatedFields.data;

  try {
    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (!user) {
        // Return a generic error to prevent email enumeration
        return { message: 'Invalid email or password.' };
    }

    const passwordIsValid = await verifyPassword(password, user.passwordHash);

    if (!passwordIsValid) {
        return { message: 'Invalid email or password.' };
    }

    // In a real app, you would create a session/JWT here.
    // For now, we will just redirect.
    if (user.role === 'ADMIN') {
       redirect('/admin');
    } else {
       // Placeholder for other user roles
       redirect('/web');
    }

  } catch (error) {
    console.error(error);
    return { message: 'An unexpected error occurred. Please try again.' };
  }
}
