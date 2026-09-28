import { Suspense } from 'react';
import { VerifyEmailForm } from '@/components/VerifyEmailForm';

export const dynamic = 'force-dynamic';

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
