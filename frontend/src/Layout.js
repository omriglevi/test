import React, { useEffect } from 'react';
import { useAuth } from './hooks/use-auth';
import { Box } from '@mui/material';

export default function Layout({children}) {
    const { user, expiresAt, logout } = useAuth();
    useEffect(() => {
        const tokenExpired = new Date().getTime() > expiresAt

        if (!user || tokenExpired) {
            logout();
        }
    }, [expiresAt, logout, user]);

    return (
        // wrap with mui container with light margins and paddint in th esids and top
        <Box padding={"5% 15%"}>
        {children}
        </Box>
    );
}
