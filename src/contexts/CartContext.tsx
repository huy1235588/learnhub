'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CART_PRODUCT_IDS = 'cartProductIds';

// Define the data type for the Context value
interface CartContextType {
    addToCart: (productId: string) => Promise<void>;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    isItemInCart: (productId: string) => boolean;
    isAddingToCart: boolean;
    cartCount: number;
}

// Create Context
export const CartContext = createContext<CartContextType | undefined>(undefined);

// Create Provider component
interface CartProviderProps {
    children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
    const [cartItems, setCartItems] = useState<string[]>(() => {
        // Only run on client side
        if (typeof window === 'undefined') {
            return [];
        }
        try {
            const storedItems = window.localStorage.getItem(CART_PRODUCT_IDS);
            return storedItems ? JSON.parse(storedItems) : [];
        } catch (error) {
            // Error handling: If localStorage is not available or data is corrupted
            console.error('Không thể đọc dữ liệu giỏ hàng từ localStorage', error);
            return [];
        }
    });

    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

    useEffect(() => {
        try {
            window.localStorage.setItem(CART_PRODUCT_IDS, JSON.stringify(cartItems));
        } catch (error) {
            // Thông báo: Không thể lưu dữ liệu giỏ hàng vào localStorage
            console.error('Không thể lưu dữ liệu giỏ hàng vào localStorage', error);
        }
    }, [cartItems]);

    // Check if product is already in cart
    const isItemInCart = useCallback(
        (productId: string) => {
            return cartItems.some((item) => item === productId);
        },
        [cartItems]
    );

    // Add product to cart (simulate loading)
    const addToCart = useCallback(
        async (productId: string) => {
            // If product is already in cart or loading, do nothing
            if (isItemInCart(productId) || isAddingToCart) {
                return;
            }

            setIsAddingToCart(true);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setCartItems((prevItems) => [...prevItems, productId]);
            setIsAddingToCart(false);
        },
        [isItemInCart, isAddingToCart]
    );

    // Remove product from cart
    const removeFromCart = useCallback((productId: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item !== productId));
    }, []);

    // Clear all items from cart
    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    // Calculate total number of products
    const cartCount = useMemo(() => cartItems.length, [cartItems]);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        isItemInCart,
        isAddingToCart,
        cartCount,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Custom hook
export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        // Error handling if used outside of CartProvider
        throw new Error('useCartmust be used within a trong CartProvider');
    }
    return context;
}
