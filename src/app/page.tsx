import { ProductList } from '@/components/product/ProductList';
import { ViewedProductsList } from '@/components/product/ViewedProductsList';
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
        </div>
    );
}
