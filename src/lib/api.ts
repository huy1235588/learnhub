import {
    ApiResponse,
    FavoriteApiResponse,
    FavoriteRequest,
    FavoriteUpdateResponse,
    FiltersApiResponse,
    ProductDetailApiResponse,
    ProductQueryParams,
    ProductsApiResponse,
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Utility function để xây dựng query string
function buildQueryString(params: Record<string, string | number | boolean | string[] | undefined | null>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
                searchParams.append(key, value.join(','));
            } else {
                searchParams.append(key, String(value));
            }
        }
    });

    return searchParams.toString();
}

// Generic fetch function
async function apiFetch<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API fetch error:', error);
        throw error;
    }
}

// Products API
export const productsApi = {
    // Lấy danh sách sản phẩm với lọc
    getProducts: async (params: ProductQueryParams = {}): Promise<ApiResponse<ProductsApiResponse>> => {
        const queryString = buildQueryString(params);
        return apiFetch<ProductsApiResponse>(`/api/products?${queryString}`);
    },

    // Lấy chi tiết sản phẩm
    getProduct: async (id: string): Promise<ApiResponse<ProductDetailApiResponse>> => {
        return apiFetch<ProductDetailApiResponse>(`/api/products/${id}`);
    },
};

// Filters API
export const filtersApi = {
    // Lấy tất cả bộ lọc có sẵn
    getFilters: async (): Promise<ApiResponse<FiltersApiResponse>> => {
        return apiFetch<FiltersApiResponse>('/api/filters');
    },
};

// Favorite API
export const FavoriteApi = {
    // Lấy danh sách Favorite của user
    getFavorite: async (userId: string): Promise<ApiResponse<FavoriteApiResponse>> => {
        return apiFetch<FavoriteApiResponse>(`/api/favorite?userId=${userId}`);
    },

    // Thêm/bỏ sản phẩm khỏi Favorite
    updateFavorite: async (request: FavoriteRequest): Promise<ApiResponse<FavoriteUpdateResponse>> => {
        return apiFetch<FavoriteUpdateResponse>('/api/favorite', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    },
};

// Suggestions API (đã có sẵn)
export const suggestionsApi = {
    getSuggestions: async (userId: string): Promise<ApiResponse<SuggestionsApiResponse>> => {
        return apiFetch(`/api/suggestions?userId=${userId}`);
    },
};

// Export tất cả APIs
export const api = {
    products: productsApi,
    filters: filtersApi,
    Favorite: FavoriteApi,
    suggestions: suggestionsApi,
};
