import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ success: false, error: 'Username required' }, { status: 401 });
    }

    const accessList = await prisma.moduleAccess.findMany({
      where: { userId: username }
    });

    const accessMap = accessList.reduce((acc, curr) => {
      acc[curr.moduleId] = curr.status;
      return acc;
    }, {} as Record<number, string>);

    return NextResponse.json({ success: true, accessMap });
  } catch (error: any) {
    console.error('Fetch access error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { username, moduleId } = await req.json();

    if (!username || !moduleId) {
      return NextResponse.json({ success: false, error: 'Missing username or moduleId' }, { status: 400 });
    }

    const newAccess = await prisma.moduleAccess.upsert({
      where: {
        userId_moduleId: {
          userId: username,
          moduleId
        }
      },
      update: {}, // Don't change status if it already exists
      create: {
        userId: username,
        moduleId,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ success: true, status: newAccess.status });
  } catch (error: any) {
    console.error('Request access error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
