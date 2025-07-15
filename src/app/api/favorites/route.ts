import { addFavorite, getFavoritesByUserId, removeFavorite } from '@/services/favorite.service';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET: Get the list of favorite products for a user with pagination.
 * Query params:
 * - userId (required): The ID of the user.
 * - page (optional): The current page number (defaults to 1).
 * - limit (optional): The number of items per page (defaults to 12).
 * URL: /api/favorites?userId=xxx&page=1&limit=12
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID is a required parameter' }, { status: 400 });
        }

        // Get pagination parameters from the query string
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const offset = (page - 1) * limit;

        // Assuming getFavoritesByUserId returns an array of all favorite products
        const { products: allFavoriteProducts } = getFavoritesByUserId(userId);

        // Calculate pagination information
        const totalItems = allFavoriteProducts.length;
        const totalPages = Math.ceil(totalItems / limit);
        const hasMore = page < totalPages;

        // Apply pagination to the results
        const paginatedProducts = allFavoriteProducts.slice(offset, offset + limit);

        // Return the result with a structure similar to the product API
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
        console.error('API GET Error:', error);
        return NextResponse.json(
            { success: false, error: 'An error occurred while fetching the favorites list' },
            { status: 500 }
        );
    }
}

/**
 * POST: Add or remove a product from the user's favorites list.
 * Body: { "userId": "xxx", "productId": 123, "action": "add" | "remove" }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, productId, action } = body;

        if (!userId || !productId || !action) {
            return NextResponse.json(
                { success: false, error: 'userId, productId, and action are required fields' },
                { status: 400 }
            );
        }

        let message = '';
        if (action === 'add') {
            addFavorite(userId, productId);
            message = 'Successfully added the product to the favorites list';
        } else if (action === 'remove') {
            removeFavorite(userId, productId);
            message = 'Successfully removed the product from the favorites list';
        } else {
            return NextResponse.json(
                { success: false, error: 'The value for action must be "add" or "remove"' },
                { status: 400 }
            );
        }

        // Standardize the success response
        return NextResponse.json({
            success: true,
            data: { message },
        });
    } catch (error: unknown) {
        console.error('API POST Error:', error);
        return NextResponse.json(
            { success: false, error: 'An error occurred while updating the favorites list' },
            { status: 500 }
        );
    }
}
