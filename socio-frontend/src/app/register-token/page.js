'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useAuth from 'hooks/useAuth';
import Loader from 'components/ui-component/Loader';
import { DASHBOARD_PATH } from 'config';

export default function RegisterTokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const role = searchParams.get('role');

    if (token) {
      loginWithToken(token, { email, name, role });
      router.replace(DASHBOARD_PATH);
    } else {
      router.replace('/login');
    }
  }, [searchParams, loginWithToken, router]);

  return <Loader />;
}
