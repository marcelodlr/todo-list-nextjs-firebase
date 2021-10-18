import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ForbiddenPage() {
    const router = useRouter();
    useEffect(() => {
        router.push('/');
    }, [])
    return <div>You need to be logged in to access this page.</div>
}