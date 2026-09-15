import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
