import { useFavoritesContext } from '@/contexts/FavoritesContext';
import axiosInstance from '@/lib/axios';
import { ApiResponse, ProductsApiResponse } from '@/types/api';
import { Product } from '@/types/product';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 9;
const MAX_VIEWED_PRODUCTS = 8;
const userId = 'user123';

export function useProducts(initialProducts: Product[], totalProducts: number, isFavoritesPage = false) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterValue, setFilterValue] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [viewingSuggestions, setViewingSuggestions] = useState(false);

    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);

    const { favorites } = useFavoritesContext();

    // Update products when initialProducts or isFavoritesPage changes
    useEffect(() => {
        if (isFavoritesPage) {
            setProducts(initialProducts);
        }
    }, [initialProducts, isFavoritesPage]);

    // Get products to display based on suggestions or filtered products
    const handleSuggestProducts = async () => {
        setIsSuggesting(true);
        setViewingSuggestions(false);

        try {
            const viewedIds = JSON.parse(localStorage.getItem('viewedProductIds') || '[]');
            const response = await axiosInstance(
                `/api/suggestions?userId=${userId}&viewedProducts=${viewedIds.join(',')}&favoriteProducts=${favorites.join(',')}`
            );
            const result: ApiResponse<ProductsApiResponse> = await response.data;

            if (result.success && result.data && result.data.products.length > 0) {
                setSuggestedProducts(result.data.products);
                setViewingSuggestions(true);
                toast.success('Đã tải gợi ý sản phẩm thành công!');
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

    // Load more products when the user scrolls down
    const handleLoadMore = async () => {
        if (isLoadMoreLoading || isFavoritesPage) return;
        setIsLoadMoreLoading(true);
        const nextPage = currentPage + 1;

        try {
            const response = await fetch(`/api/products?limit=${ITEMS_PER_PAGE}&page=${nextPage}`);
            const result: ApiResponse<ProductsApiResponse> = await response.json();

            if (result.success && result.data) {
                setProducts((prev) => [...prev, ...result.data.products]);
                setCurrentPage(nextPage);
            } else {
                throw new Error(result.error || 'Không thể tải thêm sản phẩm.');
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Lỗi không xác định.');
        } finally {
            setIsLoadMoreLoading(false);
        }
    };

    // Filter products based on search query and filter value
    const filteredProducts = useMemo(() => {
        let tempProducts = products;
        if (searchQuery) {
            tempProducts = tempProducts.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (filterValue !== 'all') {
            tempProducts = tempProducts.filter((p) => {
                const price = p.price;
                if (filterValue === '<500000') return price < 500000;
                if (filterValue === '500000-1000000') return price >= 500000 && price <= 1000000;
                if (filterValue === '>1000000') return price > 1000000;
                return true;
            });
        }
        return tempProducts;
    }, [products, searchQuery, filterValue]);

    // Paginate products for display
    const productsToDisplay = viewingSuggestions ? suggestedProducts : filteredProducts;

    // Calculate total filtered products
    const trackViewedProduct = (product: Product) => {
        const stored = localStorage.getItem('viewedProductIds');
        const viewedProductIds = stored ? JSON.parse(stored) : [];
        const filteredViewedIds = viewedProductIds.filter((id: string) => id !== product.id);
        const updatedViewedIds = [product.id, ...filteredViewedIds].slice(0, MAX_VIEWED_PRODUCTS);
        localStorage.setItem('viewedProductIds', JSON.stringify(updatedViewedIds));
    };

    return {
        // States
        productsToDisplay,
        totalProducts,
        searchQuery,
        isSuggesting,
        viewingSuggestions,
        isLoadMoreLoading,

        // Handlers
        setSearchQuery,
        setFilterValue,
        handleSuggestProducts,
        setViewingSuggestions,
        handleLoadMore,
        trackViewedProduct,
    };
}
