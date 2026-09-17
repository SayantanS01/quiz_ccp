import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const pendingRequests = await prisma.moduleAccess.findMany({
      where: { status: 'PENDING' },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, requests: pendingRequests });
  } catch (error: any) {
    console.error('Fetch pending access error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id, action } = await req.json();

    if (!id || !['GRANT', 'DENY'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Invalid id or action' }, { status: 400 });
    }

    const updated = await prisma.moduleAccess.update({
      where: { id },
      data: { status: action === 'GRANT' ? 'GRANTED' : 'DENIED' }
    });

    return NextResponse.json({ success: true, request: updated });
  } catch (error: any) {
    console.error('Update access error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
