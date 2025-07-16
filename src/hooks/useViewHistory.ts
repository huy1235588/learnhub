import { LocalStorageUtils } from '@/lib/localStorageUtils';
import { useCallback, useEffect, useMemo, useState } from 'react';

// The key for storing viewed product IDs in localStorage.
const VIEW_HISTORY_KEY = 'viewedProductIds';
// The maximum number of items to keep in the history.
const MAX_HISTORY_SIZE = 6;

export const useViewHistory = () => {
    const [history, setHistory] = useState<string[]>(() => {
        // Lazy initialize state from localStorage to avoid reading on every render.
        if (typeof window !== 'undefined') {
            return LocalStorageUtils.getArray<string>(VIEW_HISTORY_KEY, []);
        }
        return [];
    });

    // Use a Set for performant lookups (O(1) average time complexity).
    const historySet = useMemo(() => new Set(history), [history]);

    // Sync with localStorage whenever the history state changes.
    useEffect(() => {
        if (typeof window !== 'undefined') {
            LocalStorageUtils.setArray<string>(VIEW_HISTORY_KEY, history);
        }
    }, [history]);

    /**
     * Adds a product to the view history.
     * If the product already exists, it is moved to the top.
     * The list is capped at MAX_HISTORY_SIZE.
     */
    const addToHistory = useCallback((productId: string) => {
        setHistory((prevHistory) => {
            // Filter out the item if it already exists to move it to the front.
            const otherItems = prevHistory.filter((id) => id !== productId);
            // Add the new item to the beginning of the array.
            const newHistory = [productId, ...otherItems];
            // Enforce the size limit.
            return newHistory.slice(0, MAX_HISTORY_SIZE);
        });
    }, []);

    /**
     * Checks if a product has been viewed.
     * @returns {boolean} - True if the product is in history, false otherwise.
     */
    const isViewed = useCallback(
        (productId: string): boolean => {
            return historySet.has(productId);
        },
        [historySet]
    );

    /**
     * Removes all items from the view history.
     */
    const clearHistory = useCallback(() => {
        setHistory([]);
    }, []);

    const historyCount = history.length;

    return {
        history,
        historyCount,
        addToHistory,
        isViewed,
        clearHistory,
    };
};
