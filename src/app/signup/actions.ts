
'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { users, insertUserSchema } from '@/lib/db/schema';
import { redirect } from 'next/navigation';

export type FormState = {
  message: string;
  errors?: Record<string, string[] | undefined>;
};

// Use a schema that includes password for validation
const signUpSchema = insertUserSchema.extend({
    password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
});

async function hashPassword(password: string): Promise<string> {
    // In a real application, you would use a library like bcrypt or argon2 to hash passwords.
    // For this prototype, we'll use a placeholder "hashing" function.
    return `hashed_${password}`;
}

export async function signUp(prevState: FormState, formData: FormData): Promise<FormState> {
  // Get role from the form, default to 'CONSUMER'
  const role = formData.get('role') || 'CONSUMER';
  
  const validatedFields = signUpSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    role: role,
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { fullName, email, password } = validatedFields.data;
  
  try {
    const existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
        return { message: 'An account with this email already exists.', errors: { email: ['Email already in use.'] } };
    }

    const passwordHash = await hashPassword(password);
    
    await db.insert(users).values({
      fullName,
      email,
      passwordHash,
      role: validatedFields.data.role,
    });

  } catch (error) {
    console.error(error);
    return { message: 'Database error: Failed to create user.' };
  }

  // Redirect to OTP verification page upon successful insertion
  redirect('/verify-otp');
}
