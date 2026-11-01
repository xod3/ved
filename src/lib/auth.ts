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

// Pre-seeded standard administrative staff
const PRE_SEEDED_STAFF: Record<string, { pass: string; user: AdminUser }> = {
  'admin@vedcourier.com': {
    pass: 'admin123',
    user: {
      id: 'admin-01',
      email: 'admin@vedcourier.com',
      full_name: 'Chief Operations Director',
      role: 'super_admin',
      phone: '+1 (808) 301-0314',
    },
  },
  'ops@vedcourier.com': {
    pass: 'ops123',
    user: {
      id: 'ops-01',
      email: 'ops@vedcourier.com',
      full_name: 'Global Dispatch Manager',
      role: 'operations_manager',
      phone: '+1 (808) 301-0314',
    },
  },
  'support@vedcourier.com': {
    pass: 'support123',
    user: {
      id: 'support-01',
      email: 'support@vedcourier.com',
      full_name: 'Senior Support Officer',
      role: 'customer_support',
      phone: '+1 (808) 301-0314',
    },
  },
};

export async function getAdminSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(COOKIE_NAME)?.value;
    if (!sessionToken) return null;

    const decoded = JSON.parse(Buffer.from(sessionToken, 'base64').toString('utf-8'));
    if (!decoded.id || !decoded.email || !decoded.role) return null;

    // Verify against DB if available
    try {
      initDb();
      const user = db.prepare('SELECT id, email, full_name, role, phone, active FROM profiles WHERE id = ? AND email = ?').get(decoded.id, decoded.email) as any;
      if (user) {
        if (user.active !== 1) return null;
        return {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          phone: user.phone,
        };
      }
    } catch {
      // Safe fallback to decoded payload on serverless environments
    }

    return {
      id: decoded.id,
      email: decoded.email,
      full_name: decoded.full_name || 'Staff User',
      role: decoded.role,
      phone: decoded.phone,
    };
  } catch {
    return null;
  }
}

export async function loginAdminUser(email: string, password: string): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  const cleanEmail = email.trim().toLowerCase();

  let matchedUser: AdminUser | null = null;

  // Try DB authentication first
  try {
    initDb();
    const user = db.prepare('SELECT * FROM profiles WHERE lower(email) = ?').get(cleanEmail) as any;
    if (user && user.active === 1 && user.password_hash === password) {
      matchedUser = {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        phone: user.phone,
      };
    }
  } catch (err) {
    console.warn('DB lookup warning during login:', err);
  }

  // Resilient fallback for pre-seeded administrator accounts
  if (!matchedUser && PRE_SEEDED_STAFF[cleanEmail] && PRE_SEEDED_STAFF[cleanEmail].pass === password) {
    matchedUser = PRE_SEEDED_STAFF[cleanEmail].user;
  }

  if (!matchedUser) {
    return { success: false, error: 'Invalid administrative credentials.' };
  }

  try {
    const token = Buffer.from(JSON.stringify(matchedUser)).toString('base64');
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, user: matchedUser };
  } catch (err: any) {
    console.error('Cookie session error:', err);
    return { success: false, error: 'Session initialization failed.' };
  }
}

export async function logoutAdminUser() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
  } catch {
    // ignore
  }
}

