
'use server';

import { z } from 'zod';
import { db } from '@/lib/db';
import { users, insertUserSchema as baseInsertUserSchema } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const insertUserSchema = baseInsertUserSchema.extend({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).optional(),
});

export type FormState = {
  message: string;
  errors?: Record<string, string[] | undefined>;
};

async function hashPassword(password: string): Promise<string> {
    // In a real app, you'd use bcrypt or argon2. For now, we'll fake it.
    return `hashed_${password}`;
}

export async function addUser(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = insertUserSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check your inputs.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { password, ...userData } = validatedFields.data;

  if (!password) {
      return {
          message: "Password is required for new users.",
          errors: { password: ["Password is required for new users."] }
      }
  }

  try {
    const passwordHash = await hashPassword(password);
    await db.insert(users).values({ ...userData, passwordHash });
    revalidatePath('/admin/user-management');
    return { message: 'User added successfully.' };
  } catch (error) {
    console.error(error);
    return { message: 'Failed to add user. Email may already be in use.' };
  }
}


export async function updateUser(prevState: FormState, formData: FormData): Promise<FormState> {
    const id = formData.get('id');
    if (!id || typeof id !== 'string') {
        return { message: "Invalid user ID." };
    }

    const validatedFields = insertUserSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
        message: 'Validation failed. Please check your inputs.',
        errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { password, ...userData } = validatedFields.data;

    try {
        const updateData: Partial<typeof users.$inferInsert> = { ...userData };
        if (password) {
            updateData.passwordHash = await hashPassword(password);
        }

        await db.update(users).set(updateData).where(eq(users.id, parseInt(id, 10)));
        revalidatePath('/admin/user-management');
        return { message: 'User updated successfully.' };
    } catch (error) {
        console.error(error);
        return { message: 'Failed to update user.' };
    }
}
