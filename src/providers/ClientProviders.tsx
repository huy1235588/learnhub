'use client';

import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { ProductModalProvider } from '@/contexts/ProductModalContext';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

export function ClientProviders({ children }: { children: ReactNode }) {
    return (
        <FavoritesProvider>
            <CartProvider>
                <ProductModalProvider>
                    {children}
                    <Toaster richColors />
                </ProductModalProvider>
            </CartProvider>
        </FavoritesProvider>
    );
}
