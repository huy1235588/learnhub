'use client';

import { useViewHistory } from '@/hooks/useViewHistory';
import { cn } from '@/lib/utils';
import { ApiResponse, ProductsApiResponse } from '@/types/api';
import { Product } from '@/types/product';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';

export function ViewedProductsList() {
    const { history } = useViewHistory();
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    // Handle product card click to open modal
    const selectedProduct = useMemo(() => {
        if (!selectedProductId) return null;
        return products.find((p) => p.id === selectedProductId) || null;
    }, [selectedProductId, products]);

    // Handle product click to open modal and track view history
    const handleProductClick = (product: Product) => {
        setSelectedProductId(product.id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProductId(null);
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

            {/* Product Modal */}
            <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
}
