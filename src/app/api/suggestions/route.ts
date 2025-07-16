import { mockProducts } from '@/data/mock-data';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Simulate a delay for the API response
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Extract query parameters
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, message: 'User ID is required' }, { status: 400 });
        }

        const viewedProducts = searchParams.get('viewedProducts')?.split(',') || [];
        const favoriteProducts = searchParams.get('favoriteProducts')?.split(',') || [];

        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const offset = (page - 1) * limit;

        // Get categories from viewed and favorite products
        const interestCategories = new Set<string>();
        const interestTags = new Set<string>();

        [...viewedProducts, ...favoriteProducts].forEach((productId) => {
            const product = mockProducts.find((p) => p.id === productId);
            if (product) {
                interestCategories.add(product.category);
                product.tags.forEach((tag) => interestTags.add(tag));
            }
        });

        // Find similar products based on categories and tags
        const suggestions = mockProducts
            .filter((product) => {
                // Don't suggest already viewed or favorited products
                if (viewedProducts.includes(product.id) || favoriteProducts.includes(product.id)) {
                    return false;
                }

                // Check if product matches user interests
                const matchesCategory = interestCategories.has(product.category);
                const matchesTags = product.tags.some((tag) => interestTags.has(tag));

                return matchesCategory || matchesTags;
            })
            .sort((a, b) => b.rating - a.rating) // Sort by rating
            .slice(0, 6); // Limit to 4 suggestions

        // Calculate pagination information
        const totalItems = suggestions.length;
        const totalPages = Math.ceil(totalItems / limit);
        const hasMore = page < totalPages;

        // Apply pagination
        const paginatedProducts = suggestions.slice(offset, offset + limit);

        return NextResponse.json({
            success: true,
            data: {
                products: paginatedProducts,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems,
                    itemsPerPage: limit,
                    hasMore,
                },
            },
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Unable to get suggestions',
            },
            { status: 500 }
        );
    }
}
