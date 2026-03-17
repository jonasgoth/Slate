'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';

const THREE_DAYS_S = 60 * 60 * 24 * 3;

export async function login(_prev: { error: string } | null, formData: FormData) {
  const password = formData.get('password') as string;

  if (password !== process.env.APP_PASSWORD) {
    return { error: 'Wrong password' };
  }

  const secret = process.env.COOKIE_SECRET!;
  const payload = Buffer.from(
    JSON.stringify({ authenticated: true, expires: Date.now() + THREE_DAYS_S * 1000 })
  ).toString('base64');
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  (await cookies()).set('session-token', `${payload}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: THREE_DAYS_S,
    path: '/',
  });

  redirect('/today');
}
