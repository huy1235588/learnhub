import { mockProducts } from '@/data/mock-data';

// Store to hold user favorites
const favoritesStore = new Map<string, Set<string>>();

/**
 * Retrieve the list of favorite products for a specific user.
 * @param userId - The unique identifier of the user whose favorites are to be retrieved.
 * @returns An object containing the userId, an array of favorite products, and the total number of favorites.
 */
export const getFavoritesByUserId = (userId: string) => {
    if (!favoritesStore.has(userId)) {
        return {
            userId,
            products: [],
            total: 0,
        };
    }
    const userFavorites = favoritesStore.get(userId)!;
    const favoriteProducts = mockProducts.filter((product) => userFavorites.has(product.id));

    return {
        userId,
        products: favoriteProducts,
        total: favoriteProducts.length,
    };
};

/**
 * Add a product to the user's favorites list.
 * @param userId - ID of the user whose favorites are being updated.
 * @param productId - ID of the product to be added to favorites.
 * @throws {Error} If the product does not exist in the mock data.
 */
export const addFavorite = (userId: string, productId: string) => {
    const productExists = mockProducts.some((p) => p.id === productId);
    if (!productExists) {
        throw new Error('Không tìm thấy sản phẩm');
    }

    if (!favoritesStore.has(userId)) {
        favoritesStore.set(userId, new Set());
    }
    favoritesStore.get(userId)!.add(productId);
};

/**
 * Remove a product from the user's favorites list.
 * @param userId - ID of the user whose favorites are being updated.
 * @param productId - ID of the product to be removed from favorites.
 * @throws {Error} If the product does not exist in the mock data.
 */
export const removeFavorite = (userId: string, productId: string) => {
    const productExists = mockProducts.some((p) => p.id === productId);
    if (!productExists) {
        throw new Error('Không tìm thấy sản phẩm');
    }

    if (favoritesStore.has(userId)) {
        favoritesStore.get(userId)!.delete(productId);
    }
};
