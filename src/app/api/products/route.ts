// @/app/api/products/route.ts

import { mockProducts } from '@/data/mock-data';
import { ApiResponse, ProductsApiResponse } from '@/types/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Extract pagination parameters
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
        const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '9', 10))); // Limit max items per page

        // Extract sorting parameters
        const sortBy = searchParams.get('sortBy') || 'rating';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Extract filter parameters
        const searchQuery = searchParams.get('search')?.trim().toLowerCase() || '';
        const category = searchParams.get('category')?.trim() || '';
        const instructor = searchParams.get('instructor')?.trim() || '';
        const tag = searchParams.get('tag')?.trim() || '';

        // Price range parameters
        const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
        const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

        // Rating parameter
        const minRating = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined;

        // Start with all products
        let filteredProducts = [...mockProducts];

        // Apply filters in order of selectivity (most selective first for performance)

        // 1. Category filter (usually most selective)
        if (category) {
            filteredProducts = filteredProducts.filter((product) => product.category?.toLowerCase() === category.toLowerCase());
        }

        // 2. Instructor filter
        if (instructor) {
            filteredProducts = filteredProducts.filter(
                (product) => product.instructor?.name?.toLowerCase() === instructor.toLowerCase()
            );
        }

        // 3. Tag filter
        if (tag) {
            filteredProducts = filteredProducts.filter((product) =>
                product.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
            );
        }

        // 4. Price range filters
        if (minPrice !== undefined) {
            filteredProducts = filteredProducts.filter((product) => product.price >= minPrice);
        }
        if (maxPrice !== undefined) {
            filteredProducts = filteredProducts.filter((product) => product.price <= maxPrice);
        }

        // 5. Rating filter
        if (minRating !== undefined) {
            filteredProducts = filteredProducts.filter((product) => product.rating >= minRating);
        }

        // 6. Search query filter (applied last as it's usually less selective)
        if (searchQuery) {
            filteredProducts = filteredProducts.filter((product) => {
                const searchableFields = [
                    product.title?.toLowerCase() || '',
                    product.description?.toLowerCase() || '',
                    product.instructor?.name?.toLowerCase() || '',
                    product.category?.toLowerCase() || '',
                    ...(product.tags?.map((tag) => tag.toLowerCase()) || []),
                ];

                return searchableFields.some((field) => field.includes(searchQuery));
            });
        }

        // Apply sorting
        filteredProducts.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'price':
                    comparison = a.price - b.price;
                    break;
                case 'rating':
                    comparison = a.rating - b.rating;
                    break;
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                default:
                    comparison = a.rating - b.rating; // Default to rating
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        // Calculate pagination
        const totalItems = filteredProducts.length;
        const totalPages = Math.ceil(totalItems / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        // Apply pagination
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        // Prepare response
        const response: ApiResponse<ProductsApiResponse> = {
            success: true,
            data: {
                products: paginatedProducts,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1,
                },
                filters: {
                    search: searchQuery || undefined,
                    category: category || undefined,
                    instructor: instructor || undefined,
                    tags: tag ? [tag] : [],
                    minPrice,
                    maxPrice,
                    minRating,
                    sortBy,
                    sortOrder: sortOrder as 'asc' | 'desc',
                },
                total: totalItems,
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Có lỗi xảy ra khi lấy danh sách sản phẩm',
            },
            { status: 500 }
        );
    }
}

// Optional: Add POST method for advanced filtering
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { page = 1, limit = 9, sortBy = 'rating', sortOrder = 'desc', filters = {} } = body;

        // Use the same filtering logic as GET but with more complex filter object
        const searchParams = new URLSearchParams();

        // Convert filters to search params format
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.set(key, String(value));
            }
        });

        // Set pagination and sorting
        searchParams.set('page', String(page));
        searchParams.set('limit', String(limit));
        searchParams.set('sortBy', sortBy);
        searchParams.set('sortOrder', sortOrder);

        // Create a new request with the converted parameters
        const newRequest = new NextRequest(`${request.url}?${searchParams.toString()}`, { method: 'GET' });

        // Reuse the GET logic
        return GET(newRequest);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Có lỗi xảy ra khi lấy thông tin bộ lọc',
            },
            { status: 500 }
        );
    }
}
