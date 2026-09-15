import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { username, passcode } = await req.json();

    if (!username || !passcode) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { username: { equals: username, mode: 'insensitive' } }
    });

    if (!user || user.passcode !== passcode) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
