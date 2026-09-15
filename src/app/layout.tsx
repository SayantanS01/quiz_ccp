import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CloudPrep — AWS Certified Cloud Practitioner Practice & Proctored Exam Platform',
  description: 'Enterprise-grade AWS Cloud Practitioner certification exam simulation with 650 original questions, 90-minute server timer, AI proctoring, and comprehensive analytics.',
};

import { AuthProvider } from '@/components/AuthProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B0F19] text-slate-100 min-h-screen selection:bg-amber-500 selection:text-black">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
