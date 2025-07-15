'use client';

import { ProductList } from '@/components/product/ProductList';
import { mockProducts } from '@/data/mock-data';
import { Product } from '@/types/product';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Home() {
    const [products, setProducts] = useState<Product[]>(mockProducts);

    const handleFavoriteToggle = (productId: string) => {
        // Find current product and toggle favorite status
        const product = products.find((p) => p.id === productId);
        if (!product) return;

        // Toggle favorite status
        const newIsFavorite = !product.isFavorite;

        // Show toast notification
        if (newIsFavorite) {
            toast.success('Đã thêm vào yêu thích', {
                position: 'top-right',
                duration: 2000,
                icon: '❤️',
                richColors: true,
            });
        } else {
            toast.info('Đã bỏ yêu thích', {
                position: 'top-right',
                duration: 2000,
                richColors: true,
            });
        }

        // Update product's favorite status
        setProducts((prevProducts) => prevProducts.map((p) => (p.id === productId ? { ...p, isFavorite: newIsFavorite } : p)));
    };

    return (
        <div className='min-h-screen bg-background'>
            <ProductList products={products} onFavoriteToggle={handleFavoriteToggle} />
        </div>
    );
}
