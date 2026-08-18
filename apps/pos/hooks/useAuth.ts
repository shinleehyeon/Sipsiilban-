import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/utils/auth';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const authenticated = await isAuthenticated();
            setIsLoggedIn(authenticated);
        } catch (error) {
            console.error('인증 상태 확인 실패:', error);
            setIsLoggedIn(false);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshAuthStatus = () => {
        checkAuthStatus();
    };

    return {
        isLoading,
        isLoggedIn,
        refreshAuthStatus,
    };
};
