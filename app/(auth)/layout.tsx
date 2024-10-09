'use client';

import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    if (session)
      router.push('/dashboard');
  }, [session, router]);

  if (session)
    return null;

  return (
    <html>
      <body>
        <div className="flex items-center justify-center h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}

export default Layout;