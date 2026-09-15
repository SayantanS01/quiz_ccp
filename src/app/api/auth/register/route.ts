import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { username, name, passcode } = await req.json();

    if (!username || !name || !passcode) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { username }
    });

    if (existing) {
      return NextResponse.json({ success: false, error: 'Username already taken' }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        username,
        name,
        passcode,
        role: username.toLowerCase() === 'admin' ? 'admin' : 'user'
      }
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
