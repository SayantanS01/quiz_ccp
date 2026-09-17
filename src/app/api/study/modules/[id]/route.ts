import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const moduleId = parseInt(params.id, 10);
    if (isNaN(moduleId)) {
      return NextResponse.json({ success: false, error: 'Invalid module ID' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ success: false, error: 'Username required' }, { status: 401 });
    }

    // Check if user is admin (admins can view all)
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    let hasAccess = user.role === 'admin';

    if (!hasAccess) {
      const access = await prisma.moduleAccess.findUnique({
        where: {
          userId_moduleId: {
            userId: username,
            moduleId
          }
        }
      });
      hasAccess = access?.status === 'GRANTED';
    }

    if (!hasAccess) {
      return NextResponse.json({ success: false, error: 'Access not granted' }, { status: 403 });
    }

    // Map module ID to filename
    const MODULES: Record<number, string> = {
      1: 'Module 1 - Introduction to Amazon Web Services.pdf',
      2: 'Module 2 - Compute in the Cloud.pdf',
      3: 'Module 3 - Global Infrastructure and Reliability.pdf',
      4: 'Module 4 - Networking.pdf',
      5: 'Module 5 - Storage and Databases.pdf',
      6: 'Module 6 - Security.pdf',
      7: 'Module 7 - Monitoring and Analytics.pdf',
      8: 'Module 8 - Pricing and Support.pdf',
      9: 'Module 9 - Migration and Innovation.pdf',
      10: 'Module 10 - The Cloud Journey.pdf',
      11: 'Module 11 - AWS Certified Cloud Practitioner Basics.pdf',
      12: 'Module 12 - Final Assessment.pdf'
    };

    const filename = MODULES[moduleId];
    if (!filename) {
      return NextResponse.json({ success: false, error: 'Module not found' }, { status: 404 });
    }

    const filePath = path.join(process.cwd(), 'private_aws_modules', filename);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, error: 'File not found on server' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`
      }
    });
  } catch (error: any) {
    console.error('Error serving module:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
