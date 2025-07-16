'use client';

import { ApiResponse, ProductsApiResponse } from '@/types/api';
import { Product } from '@/types/product';
import { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { ProductModal } from './ProductModal';

export function ProductSuggestions() {
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State cho modal
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchSuggestions = async () => {
            setIsLoading(true);
            setError(null);

            // Lấy ID sản phẩm đã xem và yêu thích từ localStorage
            const viewedProductIds = JSON.parse(localStorage.getItem('viewedProductIds') || '[]');
            const favoriteProductIds = JSON.parse(localStorage.getItem('favoriteProductIds') || '[]'); // Giả sử bạn cũng lưu các sản phẩm yêu thích

            // Chỉ gọi API nếu có lịch sử xem hoặc yêu thích
            if (viewedProductIds.length === 0 && favoriteProductIds.length === 0) {
                setIsLoading(false);
                return;
            }

            try {
                // Xây dựng URL với các tham số
                const params = new URLSearchParams();
                if (viewedProductIds.length > 0) {
                    params.append('viewedProducts', viewedProductIds.join(','));
                }
                if (favoriteProductIds.length > 0) {
                    params.append('favoriteProducts', favoriteProductIds.join(','));
                }
                params.append('limit', '4'); // Giới hạn 4 gợi ý

                const response = await fetch(`/api/suggestions?${params.toString()}`);
                const result: ApiResponse<ProductsApiResponse> = await response.json();

                if (result.success && result.data) {
                    setSuggestions(result.data.products);
                } else {
                    throw new Error(result.error || 'Không thể tải gợi ý.');
                }
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi không mong muốn.';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuggestions();
    }, []);

    // Logic để mở/đóng modal
    const handleProductClick = (product: Product) => {
        setSelectedProductId(product.id);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProductId(null);
    };

    const selectedProduct = suggestions.find((p) => p.id === selectedProductId) || null;

    // Không hiển thị gì nếu đang tải và không có gợi ý nào
    if (isLoading) {
        return (
            <div className='space-y-4'>
                <h2 className='text-2xl font-bold'>Gợi ý cho bạn</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    // Không hiển thị component nếu không có gợi ý hoặc có lỗi
    if (error || suggestions.length === 0) {
        return null;
    }

    return (
        <div className='space-y-4'>
            <h2 className='text-2xl font-bold'>Gợi ý cho bạn</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {suggestions.map((product) => (
                    <ProductCard key={product.id} product={product} onClick={handleProductClick} />
                ))}
            </div>
            {/* Product Modal */}
            <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
}
