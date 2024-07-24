// src/hooks/useNetworkStatus.js
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { onlineState } from '../../atoms/app/onlineState';

export function useNetworkStatus() {
    const [isOnline, setIsOnline] = useRecoilState(onlineState);

    function updateNetworkStatus() {
        setIsOnline(navigator.onLine);
    }

    useEffect(() => {
        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);

        // Cleanup listeners on unmount
        return () => {
            window.removeEventListener('online', updateNetworkStatus);
            window.removeEventListener('offline', updateNetworkStatus);
        };
    }, []);

    return isOnline;
}