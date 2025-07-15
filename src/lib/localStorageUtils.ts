export class LocalStorageUtils {
    /**
     * Get an array from localStorage by key, or return defaultValue if not found/invalid
     */
    static getArray<T = string>(key: string, defaultValue: T[] = []): T[] {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return defaultValue;
            const arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr : defaultValue;
        } catch {
            return defaultValue;
        }
    }

    /**
     * Set an array to localStorage by key
     */
    static setArray<T = string>(key: string, arr: T[]): void {
        try {
            localStorage.setItem(key, JSON.stringify(arr));
        } catch {
            // Ignore write errors
        }
    }

    /**
     * Add an item to a localStorage array (no duplicates)
     */
    static addItem<T = string>(key: string, item: T): void {
        const arr = LocalStorageUtils.getArray<T>(key);
        if (!arr.includes(item)) {
            arr.push(item);
            LocalStorageUtils.setArray(key, arr);
        }
    }

    /**
     * Remove an item from a localStorage array
     */
    static removeItem<T = string>(key: string, item: T): void {
        const arr = LocalStorageUtils.getArray<T>(key);
        const newArr = arr.filter((i) => i !== item);
        LocalStorageUtils.setArray(key, newArr);
    }
}
