import { LocalStorageUtils } from '@/lib/localStorageUtils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

// The key for storing favorite product IDs in localStorage.
const FAVORITES_KEY = 'favoriteProductIds';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<string[]>(() => {
        // Lazy initialize state from localStorage to avoid reading on every render.
        if (typeof window !== 'undefined') {
            return LocalStorageUtils.getArray<string>(FAVORITES_KEY, []);
        }
        return [];
    });

    // Use a Set for performant lookups (O(1) average time complexity).
    const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

    // Sync with localStorage whenever the favorites state changes.
    useEffect(() => {
        if (typeof window !== 'undefined') {
            LocalStorageUtils.setArray<string>(FAVORITES_KEY, favorites);
        }
    }, [favorites]);

    /**
     * Toggles a product's favorite status.
     * @returns {'added' | 'removed'} - The action performed.
     */
    const toggleFavorite = useCallback(
        (productId: string): 'added' | 'removed' => {
            const isCurrentlyFavorite = favoritesSet.has(productId);
            if (isCurrentlyFavorite) {
                setFavorites((prev) => prev.filter((id) => id !== productId));

                // Show toast notification
                toast.info('Đã bỏ yêu thích', {
                    position: 'top-right',
                    duration: 2000,
                    richColors: true,
                });

                return 'removed';
            } else {
                setFavorites((prev) => [...prev, productId]);

                // Show toast notification
                toast.success('Đã thêm vào yêu thích', {
                    position: 'top-right',
                    duration: 2000,
                    icon: '❤️',
                    richColors: true,
                });

                return 'added';
            }
        },
        [favoritesSet]
    );

    /**
     * Checks if a product is in the favorites list.
     * @returns {boolean} - True if the product is a favorite, false otherwise.
     */
    const isFavorite = useCallback(
        (productId: string): boolean => {
            return favoritesSet.has(productId);
        },
        [favoritesSet]
    );

    /**
     * Removes all items from the favorites list.
     */
    const clearAllFavorites = useCallback(() => {
        setFavorites([]);
    }, []);

    const favoritesCount = favorites.length;

    return {
        favorites,
        favoritesCount,
        toggleFavorite,
        isFavorite,
        clearAllFavorites,
    };
};
