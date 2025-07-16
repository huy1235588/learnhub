import HeroSection from '@/components/features/HeroSection';
import ProductSection from '@/components/features/ProductSection';
import { PromoBanner } from '@/components/features/PromoBanner';
import { ViewedProductsList } from '@/components/product/ViewedProductsList';

export default function Home() {
    return (
        <div className='min-h-screen bg-background'>
            {/* Hero Section */}
            <div className='relative'>
                <HeroSection />
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
            <ProductSection />

            {/* Viewed Product */}
            <ViewedProductsList />

            {/* Promo Banner Section */}
            <div className='py-8'>
                <PromoBanner />
            </div>
        </div>
    );
}
