import { SWRConfig } from 'swr';
import type { ReactNode } from 'react';

interface SWRProviderProps {
  children: ReactNode;
}

export const SWRProvider = ({ children }: SWRProviderProps) => {
  return (
    <SWRConfig
      value={{
        // Global fetcher
        fetcher: async (url: string) => {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        },
        // Global configuration
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        dedupingInterval: 60000, // 1 minute
        errorRetryCount: 3,
        errorRetryInterval: 5000, // 5 seconds
        // Error handling
        onError: () => {
          // Error logged for debugging (removed for production)
        },
        // Success handling
        onSuccess: () => {
          // Success logged for debugging (removed for production)
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}; 