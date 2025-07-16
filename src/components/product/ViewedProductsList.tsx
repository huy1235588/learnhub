'use client';

import { useProductModal } from '@/contexts/ProductModalContext';
import { useViewHistory } from '@/hooks/useViewHistory';
import { cn } from '@/lib/utils';
import { ApiResponse, ProductsApiResponse } from '@/types/api';
import { Product } from '@/types/product';
import axios from 'axios';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ProductCard } from './ProductCard';

export function ViewedProductsList() {
    const { history } = useViewHistory();
    const [products, setProducts] = useState<Product[]>([]);
    const { openModal } = useProductModal();

    // Filter products to only those that are in the history
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

    // Handle product click to open modal
    const handleProductClick = (product: Product) => {
        openModal(product);
    };

    return (
        <div className={cn('container mx-auto px-10 py-8', history.length === 0 && 'hidden')}>
            {/* Header */}
            <h2 className='text-2xl font-bold mb-4'>Khóa học đã xem</h2>

            {/* Swiper for viewed products */}
            <Swiper spaceBetween={16} slidesPerView={'auto'} pagination={{ clickable: true }} className='!pb-8'>
                {/* Product Cards */}
                {products.map((product) => (
                    <SwiperSlide key={product.id} className='!w-auto'>
                        <ProductCard key={product.id} product={product} className='w-sm' onClick={handleProductClick} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
