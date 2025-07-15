import { PaginationInfo, Product } from './product';

// API Response interfaces
export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    error?: string;
}

export interface ApiSuccessResponse {
    success: true;
    data: {
        products: Product[];
    };
}

// Define the shape of a failed API response
export interface ApiErrorResponse {
    success: false;
    error: string;
}

export interface ProductsApiResponse {
    products: Product[];
    pagination: PaginationInfo;
    filters: ProductFilters;
    total: number;
}

export interface ProductFilters {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number | null;
    instructor?: string;
    minRating?: number;
    tags?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface FiltersApiResponse {
    categories: string[];
    tags: string[];
    instructors: string[];
    priceRange: {
        min: number;
        max: number;
    };
    ratingRange: {
        min: number;
        max: number;
    };
    stats: {
        totalProducts: number;
        totalInstructors: number;
        totalCategories: number;
        averagePrice: number;
        averageRating: number;
    };
}

export interface ProductDetailApiResponse {
    product: Product;
    relatedProducts: Product[];
}

export interface FavoriteApiResponse {
    userId: string;
    products: Product[];
    total: number;
}

export interface FavoriteUpdateResponse {
    userId: string;
    productId: string;
    action: 'add' | 'remove';
    isFavorite: boolean;
    message: string;
}

// Query parameters interface
export interface ProductQueryParams {
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    instructor?: string;
    minRating?: string;
    tags?: string;
    sortBy?: 'title' | 'price' | 'rating' | 'students' | 'lastUpdated';
    sortOrder?: 'asc' | 'desc';
    page?: string;
    limit?: string;
}

// Favorite request interface
export interface FavoriteRequest {
    userId: string;
    productId: string;
    action: 'add' | 'remove';
}

export interface SuggestionsApiResponse {
    recommendations: Product[];
}
