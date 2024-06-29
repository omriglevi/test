import React, { useEffect } from 'react';
import { useAuth } from './hooks/use-auth';

export default function Layout({children}) {
    const { user, expiresAt, logout } = useAuth();
    useEffect(() => {
        const tokenExpired = new Date().getTime() > expiresAt
        const missingCookie = !document.cookie.includes('jwt')

        if (!user || tokenExpired) {
            logout();
        }
    }, [expiresAt, logout, user]);

    return (
        // wrap with mui container with light margins and paddint in th esids and top
        <>
        {children}
        </>
    );
}
