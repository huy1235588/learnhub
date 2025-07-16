'use client';

import axiosInstance from '@/lib/axios';
import { ApiResponse, ProductsApiResponse } from '@/types/api';
import { Product } from '@/types/product';
import { useEffect, useState } from 'react';
import { ProductList } from '../product/ProductList';

export default function ProductSection() {
    // Fetch initial products data
    const [initialProducts, setInitialProducts] = useState<{ products: Product[]; totalProducts: number }>({
        products: [],
        totalProducts: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get('/api/products', {
                    params: { limit: 6, page: 1 }, // Adjust as needed
                });
                const result: ApiResponse<ProductsApiResponse> = response.data;

                if (result.success && result.data) {
                    setInitialProducts({
                        products: result.data.products,
                        totalProducts: result.data.pagination.totalItems,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <ProductList
            initialProducts={initialProducts.products}
            totalProducts={initialProducts.totalProducts}
            isLoading={isLoading}
        />
    );
}
