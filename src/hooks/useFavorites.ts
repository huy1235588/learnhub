import { useCallback, useEffect, useMemo, useState } from 'react';

const FAVORITES_KEY = 'productFavorites';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<string[]>(() => {
        // Lazy initialization - chỉ chạy 1 lần khi component mount
        if (typeof window !== 'undefined') {
            try {
                const storedFavorites = localStorage.getItem(FAVORITES_KEY);
                return storedFavorites ? JSON.parse(storedFavorites) : [];
            } catch (error) {
                console.warn('Failed to parse favorites from localStorage:', error);
                return [];
            }
        }
        return [];
    });

    // Sử dụng Set để tăng hiệu suất khi check favorite
    const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

    // Sync với localStorage khi favorites thay đổi
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
            } catch (error) {
                console.warn('Failed to save favorites to localStorage:', error);
            }
        }
    }, [favorites]);

    const toggleFavorite = useCallback(
        (productId: string): 'added' | 'removed' => {
            const isCurrentlyFavorite = favoritesSet.has(productId);

            setFavorites((prevFavorites) => {
                if (isCurrentlyFavorite) {
                    return prevFavorites.filter((id) => id !== productId);
                } else {
                    return [...prevFavorites, productId];
                }
            });

            return isCurrentlyFavorite ? 'removed' : 'added';
        },
        [favoritesSet]
    );

    const isFavorite = useCallback(
        (productId: string): boolean => {
            return favoritesSet.has(productId);
        },
        [favoritesSet]
    );

    // Thêm các utility methods hữu ích
    const addFavorite = useCallback(
        (productId: string): boolean => {
            if (!favoritesSet.has(productId)) {
                setFavorites((prev) => [...prev, productId]);
                return true;
            }
            return false;
        },
        [favoritesSet]
    );

    const removeFavorite = useCallback(
        (productId: string): boolean => {
            if (favoritesSet.has(productId)) {
                setFavorites((prev) => prev.filter((id) => id !== productId));
                return true;
            }
            return false;
        },
        [favoritesSet]
    );

    const clearAllFavorites = useCallback(() => {
        setFavorites([]);
    }, []);

    const favoritesCount = favorites.length;

    return {
        favorites,
        favoritesCount,
        toggleFavorite,
        isFavorite,
        addFavorite,
        removeFavorite,
        clearAllFavorites,
    };
};
