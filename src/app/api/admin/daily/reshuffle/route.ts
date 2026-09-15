import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // We increment the daily_seed_offset
    const offsetSetting = await prisma.systemSetting.findUnique({ where: { key: 'daily_seed_offset' } });
    let newOffset = 1;
    if (offsetSetting) {
      newOffset = parseInt(offsetSetting.value, 10) + 1;
      await prisma.systemSetting.update({
        where: { key: 'daily_seed_offset' },
        data: { value: newOffset.toString() }
      });
    } else {
      await prisma.systemSetting.create({
        data: {
          key: 'daily_seed_offset',
          value: '1',
          description: 'Offsets the daily challenge question seed to reshuffle questions globally.'
        }
      });
    }

    return NextResponse.json({ success: true, offset: newOffset });
  } catch (error: any) {
    console.error('Error reshuffling daily challenge:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reshuffle daily challenge' },
      { status: 500 }
    );
  }
}
