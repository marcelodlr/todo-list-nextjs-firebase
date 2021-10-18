import React from 'react';
import { useRouter } from 'next/router';
import { getAuth } from "firebase/auth";
const auth = getAuth();


function AuthenticatedRoute(WrappedComponent) {
    return function AuthenticatedPage() {
        const router = useRouter();
        const user = auth.currentUser;
        if (!user) router.push('/');

        return <WrappedComponent />
    }
}

export default AuthenticatedRoute