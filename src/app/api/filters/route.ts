import { mockProducts } from '@/data/mock-data';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Lấy tất cả danh mục duy nhất
        const categories = [...new Set(mockProducts.map((product) => product.category))];

        // Lấy tất cả tags duy nhất
        const allTags = mockProducts.flatMap((product) => product.tags);
        const tags = [...new Set(allTags)];

        // Lấy tất cả giảng viên duy nhất
        const instructors = [...new Set(mockProducts.map((product) => product.instructor.name))];

        // Tính khoảng giá
        const prices = mockProducts.map((product) => product.price);
        const priceRange = {
            min: Math.min(...prices),
            max: Math.max(...prices),
        };

        // Tính khoảng đánh giá
        const ratings = mockProducts.map((product) => product.rating);
        const ratingRange = {
            min: Math.min(...ratings),
            max: Math.max(...ratings),
        };

        // Thống kê tổng quan
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
