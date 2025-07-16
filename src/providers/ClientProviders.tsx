'use client';

import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

export function ClientProviders({ children }: { children: ReactNode }) {
    return (
        <FavoritesProvider>
            {children}
            <Toaster richColors />
        </FavoritesProvider>
    );
}
