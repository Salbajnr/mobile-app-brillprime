
'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type FormState = {
  message: string;
  errors?: Record<string, string[] | undefined>;
};

async function verifyPassword(password: string, hash: string): Promise<boolean> {
    // In a real app, you'd use bcrypt.compare or argon2.verify
    return `hashed_${password}` === hash;
}

export async function signIn(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = signInSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: 'Invalid email or password.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { email, password } = validatedFields.data;

  try {
    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (!user) {
        return { message: 'Invalid email or password.' };
    }

    const passwordIsValid = await verifyPassword(password, user.passwordHash);

    if (!passwordIsValid) {
        return { message: 'Invalid email or password.' };
    }

    // Here you would typically create a session, set a cookie, etc.
    // For now, we'll just return a success message.
    
    return { message: 'Sign in successful.' };

  } catch (error) {
    console.error(error);
    return { message: 'An unexpected error occurred.' };
  }
}
