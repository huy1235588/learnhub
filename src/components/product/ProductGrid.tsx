import { Card } from '@/components/ui/card';
import { Product } from '@/types/product';
import { WifiOff } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';

interface ProductGridProps {
    products: Product[];
    isLoading: boolean;
    error?: string;
    isFavoritesPage?: boolean;
    onProductClick: (product: Product) => void;
}

export function ProductGrid({ products, isLoading, error, isFavoritesPage, onProductClick }: ProductGridProps) {
    if (isLoading) {
        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {Array.from({ length: 6 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Card className='col-span-full flex flex-col items-center justify-center p-12 text-center'>
                <WifiOff className='h-16 w-16 text-destructive mb-4' />
                <h3 className='text-xl font-semibold'>Đã có lỗi xảy ra</h3>
                <p className='text-muted-foreground'>{error}</p>
            </Card>
        );
    }

    if (products.length === 0) {
        const emptyMessage = isFavoritesPage ? 'Bạn chưa có khóa học yêu thích nào' : 'Không tìm thấy khóa học nào';
        const emptyDescription = isFavoritesPage
            ? 'Hãy thêm khóa học vào danh sách yêu thích để xem tại đây.'
            : 'Vui lòng thử lại với từ khóa hoặc bộ lọc khác.';
        return (
            <Card className='col-span-full flex flex-col items-center justify-center p-12 text-center'>
                <h3 className='text-xl font-semibold'>{emptyMessage}</h3>
                <p className='text-muted-foreground'>{emptyDescription}</p>
            </Card>
        );
    }

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
            ))}
        </div>
    );
}
