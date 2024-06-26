import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useAuth } from './hooks/use-auth';

export default function Layout({children}) {
    const { user, expiresAt, logout } = useAuth();
    useEffect(() => {
        if (!user || new Date().getTime() > expiresAt) {
            logout();
        }
    }, []);

    return (
        // wrap with mui container with light margins and paddint in th esids and top
        <>
        {children}
        </>
    );
}
