'use client';

import { ProductList } from '@/components/product/ProductList';
import { mockProducts } from '@/data/mock-data';
import { Product } from '@/types/product';
import { useState } from 'react';

export default function Home() {
    const [products, setProducts] = useState<Product[]>(mockProducts);

    const handleFavoriteToggle = (productId: string) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) => (product.id === productId ? { ...product, isFavorite: !product.isFavorite } : product))
        );
    };

    return (
        <div className='min-h-screen bg-background'>
            <ProductList products={products} onFavoriteToggle={handleFavoriteToggle} />
        </div>
    );
}
