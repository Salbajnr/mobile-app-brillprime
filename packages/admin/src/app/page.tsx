
import { redirect } from 'next/navigation';

export default function AdminHomePage() {
  // In a real app, you would check authentication here
  // For now, redirect to admin login
  redirect('/admin/login');
}
