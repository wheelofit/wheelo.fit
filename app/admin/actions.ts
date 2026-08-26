'use server';

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { encrypt } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import CryptoJS from 'crypto-js';

export async function login(formData: FormData) {
  const encUsername = formData.get('username') as string;
  const encPassword = formData.get('password') as string;

  if (!encUsername || !encPassword) {
    return { error: 'Username and password are required' };
  }

  const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'wheelo-login-secret-key-123';
  let username = '';
  let password = '';
  
  try {
    username = CryptoJS.AES.decrypt(encUsername, key).toString(CryptoJS.enc.Utf8);
    password = CryptoJS.AES.decrypt(encPassword, key).toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return { error: 'Decryption failed' };
  }

  if (!username || !password) {
    return { error: 'Invalid credentials' };
  }

  const user = await prisma.adminUser.findUnique({
    where: { username }
  });

  if (!user) {
    return { error: 'Invalid credentials' };
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    return { error: 'Invalid credentials' };
  }

  // Create session
  const session = await encrypt({ id: user.id, username: user.username, role: user.role });
  
  (await cookies()).set('admin_session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  redirect('/admin');
}

export async function logout() {
  (await cookies()).delete('admin_session');
  redirect('/admin/login');
}
