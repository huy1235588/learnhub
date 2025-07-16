'use client';

import { ProductList } from '@/components/product/ProductList';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import axios from '@/lib/axios';
import { ApiResponse, ProductsApiResponse } from '@/types/api';
import { Product } from '@/types/product';
import { useEffect, useState } from 'react';

export default function FavoritesPage() {
    // 1. Get the list of favorite product IDs from the hook
    const { favorites } = useFavoritesContext();

    // 2. State to store detailed information of favorite products
    const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);

    // 3. useEffect to fetch product details whenever the favorites list changes
    useEffect(() => {
        // If there are no favorite products, no need to call API
        if (favorites.length === 0) {
            setFavoriteProducts([]);
            setIsLoading(false);
            return;
        }

        const fetchFavoriteProducts = async () => {
            setIsLoading(true);
            setError(undefined);
            try {
                const response = await axios(`/api/products?ids=${favorites.join(',')}`);
                const result: ApiResponse<ProductsApiResponse> = await response.data;

                if (result.success && result.data) {
                    setFavoriteProducts(result.data.products);
                } else {
                    throw new Error(result.error || 'Không thể tải danh sách yêu thích.');
                }
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFavoriteProducts();
    }, [favorites]);

    return (
        <div className='min-h-screen bg-background'>
            <h1 className='text-3xl font-bold text-center my-8'>Sản phẩm yêu thích</h1>
            <ProductList
                initialProducts={favoriteProducts}
                totalProducts={favoriteProducts.length}
                isLoading={isLoading}
                error={error}
                isFavoritesPage={true}
            />
        </div>
    );
}
