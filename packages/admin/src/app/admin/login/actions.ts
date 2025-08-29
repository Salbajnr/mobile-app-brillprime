'use server';

import { authenticateAdmin } from '@brillprime/shared';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function adminLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const result = await authenticateAdmin(email, password);

  if (!result.success) {
    return { error: result.error };
  }

  // Set admin session cookie
  const cookieStore = await cookies();
  cookieStore.set('admin-session', JSON.stringify({
    id: result.user?.id,
    email: result.user?.email,
    fullName: result.user?.fullName,
    role: result.user?.role
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  redirect('/admin');
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-session');
  redirect('/admin/login');
}