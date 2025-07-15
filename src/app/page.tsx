import { ProductList } from '@/components/product/ProductList';

export default function Home() {
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
            <ProductList apiUrl='/api/products' />
        </div>
    );
}
