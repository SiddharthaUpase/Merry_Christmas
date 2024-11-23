'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      router.push(`/card/${id}`);
    } else {
      router.push('/create');
    }
  }, [searchParams, router]);

  return null; // or a loading indicator
}
