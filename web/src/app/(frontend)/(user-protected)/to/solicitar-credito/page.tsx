"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect page - no one should access /to/solicitar-credito directly
 * Always redirects to step-1 to start the credit request wizard
 */
export default function SolicitarCreditoPage() {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to step-1
    router.replace('/to/solicitar-credito/step-1');
  }, [router]);

  // Show nothing while redirecting
  return null;
}
