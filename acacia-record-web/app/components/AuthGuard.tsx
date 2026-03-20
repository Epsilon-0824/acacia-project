'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/app/stores/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isPublicPage = pathname === '/login';

    if (!token && !isPublicPage) {
      router.replace('/login');
    } else if (token && isPublicPage) {
      router.replace('/');
    } else {
      setIsReady(true);
    }
  }, [pathname, router]);

  if (!isReady && pathname !== '/login') {
    return <div className="h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  return <>{children}</>;
}