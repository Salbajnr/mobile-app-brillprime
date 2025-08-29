
import bcrypt from 'bcryptjs';
import { getUserByEmail, getAdminByEmail, createUser } from '../db/queries';
import type { SelectUser } from '../db/schema';

export interface AuthResult {
  success: boolean;
  user?: SelectUser | any;
  error?: string;
}

export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  try {
    const user = await getUserByEmail(email);
    
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    if (!user.isActive) {
      return { success: false, error: 'Account is deactivated' };
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Remove password hash from returned user
    const { passwordHash, ...safeUser } = user;
    
    return { success: true, user: safeUser };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

export async function authenticateAdmin(email: string, password: string): Promise<AuthResult> {
  try {
    const admin = await getAdminByEmail(email);
    
    if (!admin) {
      return { success: false, error: 'Invalid admin credentials' };
    }

    if (!admin.isActive) {
      return { success: false, error: 'Admin account is deactivated' };
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      return { success: false, error: 'Invalid admin credentials' };
    }

    // Remove password from returned admin
    const { password: _, ...safeAdmin } = admin;
    
    return { success: true, user: safeAdmin };
  } catch (error) {
    console.error('Admin authentication error:', error);
    return { success: false, error: 'Admin authentication failed' };
  }
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function registerUser(userData: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role?: 'CONSUMER' | 'MERCHANT' | 'DRIVER';
}) {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password);

    // Create user
    const user = await createUser({
      email: userData.email,
      fullName: userData.fullName,
      phone: userData.phone,
      passwordHash,
      role: userData.role || 'CONSUMER',
      referralCode: generateReferralCode()
    });

    // Remove password hash from returned user
    const { passwordHash: _, ...safeUser } = user;
    
    return { success: true, user: safeUser };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed' };
  }
}

function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
