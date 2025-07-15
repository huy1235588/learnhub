'use client';

import { cn } from '@/lib/utils';
import { ApiResponse, ProductsApiResponse } from '@/types/api';
import { Product } from '@/types/product';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ProductCard } from './ProductCard';

export function ViewedProductsList() {
    const [favoriteIds, setFavoriteIds] = useState(new Set<string>());
    const [history, setHistory] = useState<Product[]>([]);

    useEffect(() => {
        // Load viewed products from localStorage
        const storedHistory = JSON.parse(localStorage.getItem('viewedProductIds') || '[]');

        if (storedHistory.length > 0) {
            const fetchProducts = async () => {
                try {
                    const response = await axios.get(`/api/products?ids=${storedHistory.join(',')}`);

                    const result: ApiResponse<ProductsApiResponse> = await response.data;
                    if (!result.success) {
                        throw new Error(result.error || 'Failed to fetch viewed products');
                    }

                    setHistory(result.data.products);
                } catch (error) {
                    console.error('Failed to fetch viewed products:', error);
                }
            };

            fetchProducts();

            // Get favorite product IDs from localStorage
            const storedFavoriteIds = JSON.parse(localStorage.getItem('favoriteProductIds') || '[]');
            if (storedFavoriteIds) {
                setFavoriteIds(new Set(storedFavoriteIds));
            }
        }
    }, []);

    // Function to handle product view tracking
    const handleFavoriteToggle = async (productId: string) => {
        // Find current product and toggle favorite status
        const isCurrentlyFavorite = favoriteIds.has(productId);
        const action = isCurrentlyFavorite ? 'remove' : 'add';

        // Toggle favorite status
        const newFavoriteIds = new Set(favoriteIds);
        if (action === 'add') {
            newFavoriteIds.add(productId);
        } else {
            newFavoriteIds.delete(productId);
        }
        setFavoriteIds(newFavoriteIds);

        // Show toast notification
        if (action === 'add') {
            // Save to localStorage
            localStorage.setItem('favoriteProductIds', JSON.stringify(Array.from(newFavoriteIds)));

            toast.success('Đã thêm vào yêu thích', {
                position: 'top-right',
                duration: 2000,
                icon: '❤️',
                richColors: true,
            });
        } else {
            // Remove from localStorage
            localStorage.setItem('favoriteProductIds', JSON.stringify(Array.from(newFavoriteIds)));

            toast.info('Đã bỏ yêu thích', {
                position: 'top-right',
                duration: 2000,
                richColors: true,
            });
        }
    };

    return (
        <div className={cn('container mx-auto px-4 py-8', history.length === 0 && 'hidden')}>
            {/* Header */}
            <h2 className='text-2xl font-bold mb-4'>Khóa học đã xem</h2>

            {/* Product Cards */}
            <div className='flex gap-4 overflow-x-auto flex-nowrap pb-4'>
                {history.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        isFavorite={favoriteIds.has(product.id)}
                        onFavoriteToggle={handleFavoriteToggle}
                        className='w-sm flex-shrink-0'
                    />
                ))}
            </div>
        </div>
    );
}
