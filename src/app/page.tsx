import { FeaturedCategories } from '@/components/features/FeaturedCategories';
import HeroSection from '@/components/HeroSection';
import { ProductList } from '@/components/product/ProductList';
import { ViewedProductsList } from '@/components/product/ViewedProductsList';
import { PromoBanner } from '@/components/PromoBanner';
import axios from '@/lib/axios';
import { ApiResponse, ProductsApiResponse } from '@/types/api';
import { Product } from '@/types/product';

async function getProducts(): Promise<{ products: Product[]; totalProducts: number }> {
    try {
        const response = await axios(`/api/products?limit=9&page=1`);
        const result: ApiResponse<ProductsApiResponse> = await response.data;

        if (result.success && result.data) {
            return {
                products: result.data.products,
                totalProducts: result.data.pagination.totalItems,
            };
        }
        return { products: [], totalProducts: 0 };
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return { products: [], totalProducts: 0 };
    }
}

export default async function Home() {
    const initialProducts = await getProducts();

    return (
        <div className='min-h-screen bg-background'>
            {/* Hero Section */}
            <div className='relative'>
                <HeroSection />
            </div>

            {/* Featured Categories Section */}
            <div className='py-8'>
                <FeaturedCategories
                    categories={[
                        { id: '1', name: 'Lập trình', image: '/path/to/image1.png', courseCount: 12 },
                        { id: '2', name: 'Thiết kế', image: '/path/to/image2.png', courseCount: 8 },
                        { id: '3', name: 'Marketing', image: '/path/to/image3.png', courseCount: 5 },
                        { id: '4', name: 'Kinh doanh', image: '/path/to/image4.png', courseCount: 10 },
                    ]}
                    className='max-w-6xl mx-auto px-4'
                />
            </div>

            {/* Header Section */}
            <div className='text-center space-y-4 py-8'>
                <h1 className='text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
                    Khám phá khóa học
                </h1>
                <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                    Tìm kiếm và lựa chọn khóa học phù hợp với nhu cầu học tập của bạn
                </p>
            </div>

            {/* Product List Section */}
            <ProductList initialProducts={initialProducts.products} totalProducts={initialProducts.totalProducts} />

            {/* Viewed Product */}
            <ViewedProductsList />

            {/* Promo Banner Section */}
            <div className='py-8'>
                <PromoBanner />
            </div>
        </div>
    );
}
