import { cookies } from 'next/headers';
import db, { initDb } from './db';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  phone?: string;
}

const COOKIE_NAME = 'ved_admin_session';

export async function getAdminSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionToken) return null;

  try {
    const decoded = JSON.parse(Buffer.from(sessionToken, 'base64').toString('utf-8'));
    if (!decoded.id || !decoded.email || !decoded.role) return null;

    initDb();
    const user = db.prepare('SELECT id, email, full_name, role, phone, active FROM profiles WHERE id = ? AND email = ?').get(decoded.id, decoded.email) as any;
    if (!user || user.active !== 1) return null;

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      phone: user.phone,
    };
  } catch {
    return null;
  }
}

export async function loginAdminUser(email: string, password: string):Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  initDb();
  const cleanEmail = email.trim().toLowerCase();
  const user = db.prepare('SELECT * FROM profiles WHERE lower(email) = ?').get(cleanEmail) as any;

  if (!user) {
    return { success: false, error: 'Invalid administrative credentials.' };
  }

  if (user.active !== 1) {
    return { success: false, error: 'This administrative account has been deactivated.' };
  }

  // Check password
  if (user.password_hash !== password) {
    return { success: false, error: 'Invalid administrative credentials.' };
  }

  const payload: AdminUser = {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    phone: user.phone,
  };

  const token = Buffer.from(JSON.stringify(payload)).toString('base64');
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { success: true, user: payload };
}

export async function logoutAdminUser() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
