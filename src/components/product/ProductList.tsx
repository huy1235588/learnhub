'use client';

import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { Filter as FilterIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Filter } from './Filter';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';

interface ProductListProps {
    products: Product[];
    onFavoriteToggle: (productId: string) => void;
}

export function ProductList({ products, onFavoriteToggle }: ProductListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterValue, setFilterValue] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredProducts = useMemo(() => {
        let tempProducts = products;

        // 1. Filter by search query
        if (searchQuery) {
            tempProducts = tempProducts.filter(
                (product) =>
                    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // 2. Filter by price range
        if (filterValue !== 'all') {
            tempProducts = tempProducts.filter((product) => {
                const price = product.price;
                if (filterValue === '<500000') return price < 500000;
                if (filterValue === '500000-1000000') return price >= 500000 && price <= 1000000;
                if (filterValue === '>1000000') return price > 1000000;
                return true;
            });
        }

        return tempProducts;
    }, [products, searchQuery, filterValue]);

    const handleFavoriteToggle = (productId: string) => {
        onFavoriteToggle(productId);
    };

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    return (
        <div className='container mx-auto px-4 py-8 space-y-8'>
            {/* Header Section */}
            <div className='text-center space-y-4'>
                <h1 className='text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
                    Khám phá khóa học
                </h1>
                <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
                    Tìm kiếm và lựa chọn khóa học phù hợp với nhu cầu học tập của bạn
                </p>
            </div>

            {/* Search and Filter Section */}
            <Card className='p-6'>
                <div className='space-y-4'>
                    {/* Top row - Search and view controls */}
                    <div className='flex flex-col sm:flex-row gap-4 justify-between items-center'>
                        <div className='flex-1 w-full'>
                            <SearchBar onSearch={setSearchQuery} placeholder='Tìm kiếm khóa học...' className='h-12' />
                        </div>

                        <div className='flex items-center gap-2'>
                            {/* Filter toggle for mobile */}
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setShowFilters(!showFilters)}
                                className='sm:hidden'
                            >
                                <FilterIcon className='h-4 w-4' />
                                Lọc
                            </Button>
                        </div>
                    </div>

                    {/* Filter section */}
                    <div className={cn('transition-all duration-300 overflow-hidden', showFilters || 'hidden sm:block')}>
                        <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
                            <Filter onFilterChange={setFilterValue} />

                            {/* Results count */}
                            <div className='text-sm text-muted-foreground'>
                                Tìm thấy <span className='font-semibold'>{filteredProducts.length}</span> khóa học
                                {searchQuery && <span> cho &ldquo;{searchQuery}&rdquo;</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Product Grid */}
            <div className='transition-all duration-300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onClick={handleProductClick}
                        onFavoriteToggle={handleFavoriteToggle}
                    />
                ))}
            </div>

            {/* Product Modal */}
            <ProductModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onFavoriteToggle={handleFavoriteToggle}
            />
        </div>
    );
}
