'use client';

import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useFavorites } from '@/hooks/useFavorites';
import { LocalStorageUtils } from '@/lib/localStorageUtils';
import { cn } from '@/lib/utils';
import { ApiResponse, ProductsApiResponse } from '@/types/api';
import { Product } from '@/types/product';
import { Filter as FilterIcon, WifiOff } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Filter } from './Filter';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { ProductModal } from './ProductModal';

interface ProductListProps {
    apiUrl?: string; // Optional API URL for fetching products
}

const ITEMS_PER_PAGE = 9; // Default items per page for pagination
const MAX_VIEWED_PRODUCTS = 8; // Maximum number of viewed products to keep

export function ProductList({ apiUrl }: ProductListProps) {
    // State for managing products and pagination
    const [products, setProducts] = useState<Product[]>([]);
    const { toggleFavorite, favorites } = useFavorites();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterValue, setFilterValue] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalProducts, setTotalProducts] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const userId = 'user123'; // Hardcoded userId for the mock API

    // Fetch products on initial load
    useEffect(() => {
        const fetchInitialProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`${apiUrl}?limit=${ITEMS_PER_PAGE}&page=1&userId=${userId}`);
                const result: ApiResponse<ProductsApiResponse> = await response.json();

                if (result.success && result.data) {
                    setProducts(result.data.products);
                    setTotalProducts(result.data.pagination.totalItems);
                } else {
                    throw new Error(result.error || 'Không thể tải danh sách sản phẩm.');
                }
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
                setError(errorMessage);
                console.error('Failed to fetch products:', err);
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialProducts();
    }, [apiUrl]);

    // Load more products when the user clicks "Load More"
    const handleLoadMore = async () => {
        if (isLoadMoreLoading) return;

        setIsLoadMoreLoading(true);
        const nextPage = currentPage + 1;

        try {
            const response = await fetch(`/api/products?limit=${ITEMS_PER_PAGE}&page=${nextPage}`);
            const result: ApiResponse<ProductsApiResponse> = await response.json();

            if (result.success && result.data) {
                // Nối sản phẩm mới vào danh sách hiện có
                setProducts((prevProducts) => [...prevProducts, ...result.data.products]);
                setCurrentPage(nextPage);
            } else {
                throw new Error(result.error || 'Không thể tải thêm sản phẩm.');
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
            toast.error(errorMessage);
        } finally {
            setIsLoadMoreLoading(false);
        }
    };

    // Filter products based on search query and filter value
    const filteredProducts = useMemo(() => {
        let tempProducts = products;

        // 1. Filter by search query
        if (searchQuery) {
            tempProducts = tempProducts.filter(
                (product) =>
                    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // 2. Filter by price range
        if (filterValue !== 'all') {
            tempProducts = tempProducts.filter((product) => {
                const price = product.price;
                if (filterValue === '<500000') return price < 500000;
                if (filterValue === '500000-1000000') return price >= 500000 && price <= 1000000;
                if (filterValue === '>1000000') return price > 1000000;
                return true;
            });
        }

        return tempProducts;
    }, [products, searchQuery, filterValue]);

    // Function to handle product view tracking
    const handleFavoriteToggle = async (productId: string) => {
        const action = toggleFavorite(productId);

        // Show toast notification
        if (action === 'added') {
            LocalStorageUtils.addItem('favoriteProductIds', productId);

            toast.success('Đã thêm vào yêu thích', {
                position: 'top-right',
                duration: 2000,
                icon: '❤️',
                richColors: true,
            });
        } else {
            LocalStorageUtils.removeItem('favoriteProductIds', productId);

            toast.info('Đã bỏ yêu thích', {
                position: 'top-right',
                duration: 2000,
                richColors: true,
            });
        }
    };

    // Handle product click to open modal and track view history
    const handleProductClick = (product: Product) => {
        setSelectedProductId(product.id);
        setIsModalOpen(true);

        // Get viewed products from localStorage
        const stored = typeof window !== 'undefined' ? window.localStorage.getItem('viewedProductIds') : null;
        const viewedProductIds = stored ? JSON.parse(stored) : [];

        // Delete the product if it already exists in the viewed list
        const filteredViewedIds = viewedProductIds.filter((id: string) => id !== product.id);
        const updatedViewedIds = [product.id, ...filteredViewedIds].slice(0, MAX_VIEWED_PRODUCTS); // Limit to last 8 viewed

        // Save to localStorage
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('viewedProductIds', JSON.stringify(updatedViewedIds));
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProductId(null);
    };

    const selectedProduct = useMemo(() => {
        if (!selectedProductId) return null;
        return filteredProducts.find((p) => p.id === selectedProductId) || null;
    }, [selectedProductId, filteredProducts]);

    const renderContent = () => {
        // --- 1. Loading State ---
        if (isLoading) {
            return (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <ProductCardSkeleton key={index} />
                    ))}
                </div>
            );
        }

        // --- 2. Error State ---
        if (error) {
            return (
                <Card className='col-span-full flex flex-col items-center justify-center p-12 text-center'>
                    <WifiOff className='h-16 w-16 text-destructive mb-4' />
                    <h3 className='text-xl font-semibold'>Đã có lỗi xảy ra</h3>
                    <p className='text-muted-foreground'>{error}</p>
                </Card>
            );
        }

        // --- 3. No Products Found ---
        if (filteredProducts.length === 0) {
            return (
                <Card className='col-span-full flex flex-col items-center justify-center p-12 text-center'>
                    <h3 className='text-xl font-semibold'>Không tìm thấy khóa học nào</h3>
                    <p className='text-muted-foreground'>Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
                </Card>
            );
        }

        // --- 4. Product Grid ---
        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        isFavorite={favorites.includes(product.id)}
                        onClick={handleProductClick}
                        onFavoriteToggle={handleFavoriteToggle}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className='container mx-auto px-4 py-8 space-y-8'>
            {/* Search and Filter Section */}
            <Card className='p-6 pt-0'>
                <div className='space-y-4'>
                    {/* Top row - Search and view controls */}
                    <div className='flex flex-col sm:flex-row gap-4 justify-between items-center'>
                        <div className='flex-1 w-full'>
                            <SearchBar onSearch={setSearchQuery} placeholder='Tìm kiếm khóa học...' className='h-12' />
                        </div>

                        <div className='flex items-center gap-2'>
                            {/* Filter toggle for mobile */}
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setShowFilters(!showFilters)}
                                className='sm:hidden'
                            >
                                <FilterIcon className='h-4 w-4' />
                                Lọc
                            </Button>
                        </div>
                    </div>

                    {/* Filter section */}
                    <div className={cn('transition-all duration-300 overflow-hidden', showFilters || 'hidden sm:block')}>
                        <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
                            <Filter onFilterChange={setFilterValue} />

                            {/* Results count */}
                            <div className='text-sm text-muted-foreground'>
                                Tìm thấy <span className='font-semibold'>{totalProducts}</span> khóa học
                                {searchQuery && <span> cho &ldquo;{searchQuery}&rdquo;</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Product Grid */}
            {renderContent()}

            {/* Load More Button */}
            {!isLoading && !error && products.length < totalProducts && (
                <div className='text-center mt-8'>
                    <Button onClick={handleLoadMore} disabled={isLoadMoreLoading} size='lg'>
                        {isLoadMoreLoading ? 'Đang tải...' : 'Xem thêm'}
                    </Button>
                </div>
            )}

            {/* Product Modal */}
            <ProductModal
                product={selectedProduct}
                isFavorite={selectedProduct ? favorites.includes(selectedProduct.id) : false}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onFavoriteToggle={handleFavoriteToggle}
            />
        </div>
    );
}
