
'use server';

import { z } from 'zod';
import { db } from '@brillprime/shared/db';
import { users } from '@brillprime/shared/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect } from 'next/navigation';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function adminSignIn(prevState: any, formData: FormData) {
  const validatedFields = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields.',
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // Query for admin user specifically
    const user = await db.select().from(users).where(
      and(
        eq(users.email, email),
        eq(users.role, 'ADMIN'),
        eq(users.isActive, true)
      )
    ).limit(1);

    if (!user.length) {
      return { message: 'Invalid admin credentials or account not found.' };
    }

    const adminUser = user[0];

    // In production, you would verify the hashed password here
    // For now, we'll do a simple comparison (replace with proper password hashing)
    if (password !== 'admin123') { // Replace with proper password verification
      return { message: 'Invalid admin credentials.' };
    }

    // In a real app, you would create a session/JWT here specifically for admin
    // For now, we will just redirect to admin dashboard
    redirect('/admin');

  } catch (error) {
    console.error('Admin authentication error:', error);
    return { message: 'An unexpected error occurred during admin authentication.' };
  }
}
'use server';

import { z } from 'zod';
import { db } from '@brillprime/shared/db';
import { users } from '@brillprime/shared/db/schema';
import { eq, and } from 'drizzle-orm';
import { redirect } from 'next/navigation';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function adminSignIn(prevState: any, formData: FormData) {
  const validatedFields = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid form data. Please check your inputs.',
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // Check if user exists and has admin role
    const [user] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.email, email),
          eq(users.role, 'ADMIN'),
          eq(users.isActive, true)
        )
      )
      .limit(1);

    if (!user) {
      return { message: 'Invalid admin credentials or insufficient permissions.' };
    }

    // In a real app, you would verify the password hash here
    // For now, we'll use a simple check (replace with proper password verification)
    if (password !== 'admin123') { // Replace with actual password verification
      return { message: 'Invalid admin credentials.' };
    }

    // In a real app, you would create a secure admin session/JWT here
    // For now, we will just redirect
    redirect('/admin');

  } catch (error) {
    console.error('Admin login error:', error);
    return { message: 'An unexpected error occurred. Please try again.' };
  }
}
