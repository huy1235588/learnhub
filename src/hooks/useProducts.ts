import { FilterValues } from '@/components/product/Filter';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import axiosInstance from '@/lib/axios';
import { ApiResponse, ProductsApiResponse } from '@/types/api';
import { Product } from '@/types/product';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 9;
const MAX_VIEWED_PRODUCTS = 8;
const userId = 'user123';

export function useProducts(initialProducts: Product[], totalProducts: number, isFavoritesPage = false) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterValue, setFilterValue] = useState<FilterValues>({
        price: 'all',
        category: 'all',
        rating: 'all',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(totalProducts);
    const [isLoading, setIsLoading] = useState(false);

    const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [viewingSuggestions, setViewingSuggestions] = useState(false);

    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);

    const { favorites } = useFavoritesContext();

    // Fetch products from API with filters
    const fetchProducts = useCallback(
        async (page: number = 1, search: string = '', filters: FilterValues, isLoadMore: boolean = false) => {
            if (isFavoritesPage) return; // Skip API call for favorites page

            const loadingState = isLoadMore ? setIsLoadMoreLoading : setIsLoading;
            loadingState(true);

            try {
                const params: Record<string, string | number | boolean | undefined> = {
                    page,
                    limit: ITEMS_PER_PAGE,
                    userId,
                };

                // Add search query
                if (search.trim()) {
                    params.search = search.trim();
                }

                // Add filters
                if (filters.category && filters.category !== 'all') {
                    params.category = filters.category;
                }

                if (filters.price && filters.price !== 'all') {
                    // Convert price range to min/max
                    if (filters.price === '<500000') {
                        params.maxPrice = 499999;
                    } else if (filters.price === '500000-1000000') {
                        params.minPrice = 500000;
                        params.maxPrice = 1000000;
                    } else if (filters.price === '>1000000') {
                        params.minPrice = 1000001;
                    }
                }

                if (filters.rating && filters.rating !== 'all') {
                    params.minRating = Number(filters.rating);
                }

                const response = await axiosInstance.get('/api/products', { params });
                const result: ApiResponse<ProductsApiResponse> = response.data;

                if (result.success && result.data) {
                    if (isLoadMore) {
                        setProducts((prev) => [...prev, ...result.data.products]);
                    } else {
                        setProducts(result.data.products);
                    }
                    setTotalItems(result.data.total);
                    setCurrentPage(page);
                } else {
                    throw new Error(result.error || 'Không thể tải sản phẩm.');
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định.';
                toast.error(errorMessage);
            } finally {
                loadingState(false);
            }
        },
        [isFavoritesPage, userId]
    );

    // Handle search query change
    const handleSearchChange = useCallback(
        (query: string) => {
            setSearchQuery(query);
            setCurrentPage(1);
            setViewingSuggestions(false);
            fetchProducts(1, query, filterValue);
        },
        [filterValue, fetchProducts]
    );

    // Handle filter change
    const handleFilterChange = useCallback(
        (filters: FilterValues) => {
            setFilterValue(filters);
            setCurrentPage(1);
            setViewingSuggestions(false);
            fetchProducts(1, searchQuery, filters);
        },
        [searchQuery, fetchProducts]
    );

    // Handle suggest products
    const handleSuggestProducts = async () => {
        setIsSuggesting(true);
        setViewingSuggestions(false);

        try {
            const viewedIds = JSON.parse(localStorage.getItem('viewedProductIds') || '[]');
            const response = await axiosInstance.get('/api/suggestions', {
                params: {
                    userId,
                    viewedProducts: viewedIds.join(','),
                    favoriteProducts: favorites.join(','),
                },
            });
            const result: ApiResponse<ProductsApiResponse> = response.data;

            if (result.success && result.data && result.data.products.length > 0) {
                setSuggestedProducts(result.data.products);
                setViewingSuggestions(true);
                toast.success('Đã tải gợi ý sản phẩm thành công!', {
                    position: 'top-right',
                    richColors: true,
                });
            } else if (result.success) {
                toast.info('Không tìm thấy sản phẩm gợi ý nào phù hợp.');
            } else {
                throw new Error(result.error || 'Không thể tải gợi ý.');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định.';
            toast.error(errorMessage);
        } finally {
            setIsSuggesting(false);
        }
    };

    // Handle load more
    const handleLoadMore = useCallback(() => {
        if (isLoadMoreLoading || viewingSuggestions) return;

        const nextPage = currentPage + 1;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        if (nextPage <= totalPages) {
            fetchProducts(nextPage, searchQuery, filterValue, true);
        }
    }, [isLoadMoreLoading, viewingSuggestions, currentPage, totalItems, searchQuery, filterValue, fetchProducts]);

    // Track viewed product
    const trackViewedProduct = useCallback((product: Product) => {
        const stored = localStorage.getItem('viewedProductIds');
        const viewedProductIds = stored ? JSON.parse(stored) : [];
        const filteredViewedIds = viewedProductIds.filter((id: string) => id !== product.id);
        const updatedViewedIds = [product.id, ...filteredViewedIds].slice(0, MAX_VIEWED_PRODUCTS);
        localStorage.setItem('viewedProductIds', JSON.stringify(updatedViewedIds));
    }, []);

    // Reset suggestions view
    const resetSuggestions = useCallback(() => {
        setViewingSuggestions(false);
        // Reload current filtered products
        fetchProducts(1, searchQuery, filterValue);
    }, [searchQuery, filterValue, fetchProducts]);

    // Initialize with initial products for favorites page
    useEffect(() => {
        if (isFavoritesPage) {
            setProducts(initialProducts);
            setTotalItems(initialProducts.length);
        }
    }, [initialProducts, isFavoritesPage]);

    // For favorites page, we still need client-side filtering
    const getFilteredFavorites = useCallback(() => {
        if (!isFavoritesPage) return products;

        let filtered = products;

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // Apply other filters
        if (filterValue) {
            filtered = filtered.filter((p) => {
                const { price, category, rating } = filterValue;

                // Price filter
                if (price && price !== 'all') {
                    const productPrice = p.price;
                    if (price === '<500000' && productPrice >= 500000) return false;
                    if (price === '500000-1000000' && (productPrice < 500000 || productPrice > 1000000)) return false;
                    if (price === '>1000000' && productPrice <= 1000000) return false;
                }

                // Category filter
                if (category && category !== 'all' && p.category?.toLowerCase() !== category.toLowerCase()) {
                    return false;
                }

                // Rating filter
                if (rating && rating !== 'all' && p.rating < Number(rating)) {
                    return false;
                }

                return true;
            });
        }

        return filtered;
    }, [products, searchQuery, filterValue, isFavoritesPage]);

    // Get products to display
    const productsToDisplay = viewingSuggestions ? suggestedProducts : isFavoritesPage ? getFilteredFavorites() : products;

    // Check if can load more
    const canLoadMore = !isFavoritesPage && !viewingSuggestions && currentPage * ITEMS_PER_PAGE < totalItems;

    return {
        // States
        products: productsToDisplay,
        totalProducts: isFavoritesPage ? getFilteredFavorites().length : totalItems,
        searchQuery,
        filterValue,
        currentPage,
        isLoading,
        isSuggesting,
        viewingSuggestions,
        isLoadMoreLoading,
        canLoadMore,

        // Handlers
        setSearchQuery: handleSearchChange,
        setFilterValue: handleFilterChange,
        handleSuggestProducts,
        setViewingSuggestions: resetSuggestions,
        handleLoadMore,
        trackViewedProduct,
    };
}
