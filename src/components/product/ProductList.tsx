'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useProductModal } from '@/contexts/ProductModalContext';
import { useProducts } from '@/hooks/useProducts'; // Import a new hook
import { Product } from '@/types/product';
import { ProductControls } from './ProductControls'; // Import a new component
import { ProductGrid } from './ProductGrid'; // Import a new component

interface ProductListProps {
    initialProducts: Product[];
    totalProducts: number;
    isLoading?: boolean;
    error?: string;
    isFavoritesPage?: boolean;
}

export function ProductList({ initialProducts, totalProducts, isLoading, error, isFavoritesPage = false }: ProductListProps) {
    const {
        productsToDisplay,
        totalProducts: totalFilteredProducts,
        searchQuery,
        isSuggesting,
        viewingSuggestions,
        isLoadMoreLoading,
        setSearchQuery,
        setFilterValue,
        handleSuggestProducts,
        setViewingSuggestions,
        handleLoadMore,
        trackViewedProduct,
    } = useProducts(initialProducts, totalProducts, isFavoritesPage);
    const { openModal } = useProductModal();

    // Handle product click to open modal
    const handleProductClick = (product: Product) => {
        openModal(product);

        trackViewedProduct(product); // Track product view
    };

    const shouldShowLoadMore =
        !isFavoritesPage &&
        !isLoading &&
        !error &&
        !viewingSuggestions &&
        productsToDisplay.length > 0 &&
        productsToDisplay.length < totalProducts;

    return (
        <div className='container mx-auto p-8 pt-0 space-y-8'>
            <Card className='p-6'>
                <ProductControls
                    totalProducts={totalFilteredProducts}
                    searchQuery={searchQuery}
                    isSuggesting={isSuggesting}
                    viewingSuggestions={viewingSuggestions}
                    isFavoritesPage={isFavoritesPage}
                    onSearch={setSearchQuery}
                    onFilterChange={setFilterValue}
                    onSuggest={handleSuggestProducts}
                    onReturnToAll={() => setViewingSuggestions(false)}
                />
            </Card>

            <ProductGrid
                products={productsToDisplay}
                isLoading={isLoading || isSuggesting}
                error={error}
                isFavoritesPage={isFavoritesPage}
                onProductClick={handleProductClick}
            />

            {shouldShowLoadMore && (
                <div className='text-center mt-8'>
                    <Button onClick={handleLoadMore} disabled={isLoadMoreLoading} size='lg'>
                        {isLoadMoreLoading ? 'Đang tải...' : 'Xem thêm'}
                    </Button>
                </div>
            )}
        </div>
    );
}
