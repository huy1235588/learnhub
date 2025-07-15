import { mockProducts } from '@/data/mock-data';
import { Product } from '@/types/product';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Get filter parameters from the query string
        const search = searchParams.get('search')?.toLowerCase() || '';
        const category = searchParams.get('category') || '';
        const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : 0;
        const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : Infinity;
        const instructor = searchParams.get('instructor')?.toLowerCase() || '';
        const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : 0;
        const tags = searchParams.get('tags')?.toLowerCase().split(',').filter(Boolean) || [];
        const sortBy = searchParams.get('sortBy') || 'title'; // title, price, rating, students, lastUpdated
        const sortOrder = searchParams.get('sortOrder') || 'asc'; // asc, desc

        const ids = searchParams.get('ids');
        if (ids) {
            // If 'ids' parameter is provided, filter products by these IDs
            const idList = ids.split(',').map((id) => id.trim());
            const filteredProducts = mockProducts.filter((product) => idList.includes(product.id));
            return NextResponse.json({
                success: true,
                data: {
                    products: filteredProducts,
                    total: filteredProducts.length,
                },
            });
        }

        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const offset = (page - 1) * limit;

        // Filter products
        const filteredProducts = mockProducts.filter((product: Product) => {
            // Filter by search keyword (search in title, description, instructor, etc.)
            const matchesSearch =
                !search ||
                product.title.toLowerCase().includes(search) ||
                product.description.toLowerCase().includes(search) ||
                product.fullDescription.toLowerCase().includes(search) ||
                product.instructor.name.toLowerCase().includes(search) ||
                product.tags.some((tag) => tag.toLowerCase().includes(search));

            // Filter by category
            const matchesCategory = !category || product.category.toLowerCase().includes(category.toLowerCase());

            // Filter by price range
            const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

            // Filter by instructor
            const matchesInstructor = !instructor || product.instructor.name.toLowerCase().includes(instructor);

            // Filter by minimum rating
            const matchesRating = product.rating >= minRating;

            // Filter by tags
            const matchesTags =
                tags.length === 0 ||
                tags.some((tag) => product.tags.some((productTag) => productTag.toLowerCase().includes(tag)));

            return matchesSearch && matchesCategory && matchesPrice && matchesInstructor && matchesRating && matchesTags;
        });

        // Sort products
        filteredProducts.sort((a: Product, b: Product) => {
            let comparison = 0;

            switch (sortBy) {
                case 'price':
                    comparison = a.price - b.price;
                    break;
                case 'rating':
                    comparison = a.rating - b.rating;
                    break;
                case 'students':
                    comparison = a.students - b.students;
                    break;
                case 'lastUpdated':
                    comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
                    break;
                case 'title':
                default:
                    comparison = parseInt(a.id, 10) - parseInt(b.id, 10);
                    break;
            }

            return sortOrder === 'desc' ? -comparison : comparison;
        });

        // Calculate pagination information
        const totalItems = filteredProducts.length;
        const totalPages = Math.ceil(totalItems / limit);
        const hasMore = page < totalPages;

        // Apply pagination
        const paginatedProducts = filteredProducts.slice(offset, offset + limit);

        // Return the result
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
                filters: {
                    search,
                    category,
                    minPrice,
                    maxPrice: maxPrice === Infinity ? null : maxPrice,
                    instructor,
                    minRating,
                    tags,
                    sortBy,
                    sortOrder,
                },
            },
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'An error occurred while fetching the product list',
            },
            { status: 500 }
        );
    }
}
