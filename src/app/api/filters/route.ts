import { mockProducts } from '@/data/mock-data';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Get all unique categories from products
        const categories = [...new Set(mockProducts.map((product) => product.category))];

        // Get all unique tags from products
        const allTags = mockProducts.flatMap((product) => product.tags);
        const tags = [...new Set(allTags)];

        // Get all unique instructors from products
        const instructors = [...new Set(mockProducts.map((product) => product.instructor.name))];

        // Calculate price range
        const prices = mockProducts.map((product) => product.price);
        const priceRange = {
            min: Math.min(...prices),
            max: Math.max(...prices),
        };

        // Calculate rating range
        const ratings = mockProducts.map((product) => product.rating);
        const ratingRange = {
            min: Math.min(...ratings),
            max: Math.max(...ratings),
        };

        // Calculate statistics
        const stats = {
            totalProducts: mockProducts.length,
            totalInstructors: instructors.length,
            totalCategories: categories.length,
            averagePrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
            averageRating: Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)),
        };

        return NextResponse.json({
            success: true,
            data: {
                categories: categories.sort(),
                tags: tags.sort(),
                instructors: instructors.sort(),
                priceRange,
                ratingRange,
                stats,
            },
        });
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
