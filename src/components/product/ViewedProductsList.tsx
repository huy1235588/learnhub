'use client';

import { useViewHistory } from '@/hooks/useViewHistory';
import { cn } from '@/lib/utils';
import { ApiResponse, ProductsApiResponse } from '@/types/api';
import { Product } from '@/types/product';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';

export function ViewedProductsList() {
    const { history } = useViewHistory();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        // Load viewed products from localStorage
        if (history.length > 0) {
            const fetchProducts = async () => {
                try {
                    const response = await axios.get(`/api/products?ids=${history.join(',')}`);

                    const result: ApiResponse<ProductsApiResponse> = await response.data;
                    if (!result.success) {
                        throw new Error(result.error || 'Failed to fetch viewed products');
                    }

                    setProducts(result.data.products);
                } catch (error) {
                    console.error('Failed to fetch viewed products:', error);
                }
            };

            fetchProducts();
        }
    }, [history]);

    return (
        <div className={cn('container mx-auto px-4 py-8', history.length === 0 && 'hidden')}>
            {/* Header */}
            <h2 className='text-2xl font-bold mb-4'>Khóa học đã xem</h2>

            {/* Product Cards */}
            <div className='flex gap-4 overflow-x-auto flex-nowrap pb-4'>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} className='w-sm flex-shrink-0' />
                ))}
            </div>
        </div>
    );
}
