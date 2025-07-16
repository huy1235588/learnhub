import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Product } from '@/types/product';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { ProductModal } from '../product/ProductModal';

export const ProductSuggestionCard = ({ product }: { product: Product }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCardClick = () => {
        setSelectedProductId(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProductId(null);
    };

    return (
        <Card
            className='group relative w-full max-w-sm cursor-pointer overflow-hidden rounded-xl py-0 border-2 border-border/50 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 active:scale-[0.98] gap-y-1'
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Gradient overlay khi hover */}
            <div className='absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />

            {/* Badge discount */}
            {product.originalPrice && (
                <Badge className='absolute top-2 right-2 z-10 bg-destructive/90 text-white animate-pulse'>
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </Badge>
            )}

            <CardHeader className='p-0'>
                {/* Image container với loading state */}
                <div className='relative h-40 w-full overflow-hidden bg-muted'>
                    <div
                        className={`absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse transition-opacity duration-300 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}
                    />

                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className={`object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                    />

                    {/* Overlay gradient */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent' />
                </div>
            </CardHeader>

            <CardContent className='px-4 space-y-3'>
                {/* Title */}
                <h3 className='font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200'>
                    {product.title}
                </h3>

                {/* Price section */}
                <div className='flex items-center justify-between pt-1 border-t border-border/50'>
                    <div className='flex flex-col'>
                        <div className='flex items-center gap-2'>
                            <span className='font-bold text-primary text-sm'>{product.price}</span>
                            {product.originalPrice && (
                                <span className='text-xs text-muted-foreground line-through'>{product.originalPrice}</span>
                            )}
                        </div>
                    </div>

                    {/* Action button */}
                    <Button
                        size='sm'
                        variant='ghost'
                        className={`h-8 w-8 rounded-full p-0 transition-all duration-300 hover:bg-primary/10 hover:text-primary ${isHovered ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-70'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick();
                        }}
                    >
                        <ArrowRight className='h-4 w-4' />
                    </Button>
                </div>
            </CardContent>

            {/* Hover effect border */}
            <div className='absolute inset-0 rounded-xl border-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none' />

            {/* Product Modal */}
            <ProductModal product={selectedProductId} isOpen={isModalOpen} onClose={handleCloseModal} />
        </Card>
    );
};
