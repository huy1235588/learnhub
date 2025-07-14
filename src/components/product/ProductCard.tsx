import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { Clock, Heart, Star, Users } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
    product: Product;
    onClick?: (product: Product) => void;
    onFavoriteToggle?: (productId: string) => void;
    className?: string;
}

export function ProductCard({ product, onClick, onFavoriteToggle, className }: ProductCardProps) {
    const handleCardClick = () => {
        onClick?.(product);
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFavoriteToggle?.(product.id);
    };

    return (
        <Card
            className={cn(
                'group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-border/50 hover:border-border overflow-hidden pt-0',
                className
            )}
            onClick={handleCardClick}
        >
            <CardHeader className='p-0 relative h-56 w-full overflow-hidden'>
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className='object-cover transition-transform duration-300 group-hover:scale-105'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />

                {/* Overlay actions */}
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300' />

                {/* Favorite button */}
                <button
                    onClick={handleFavoriteClick}
                    className={cn(
                        'absolute top-3 right-3 p-2 rounded-full transition-all duration-200',
                        'bg-white/90 hover:bg-white shadow-sm hover:shadow-md',
                        product.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    )}
                >
                    <Heart
                        className={cn(
                            'h-4 w-4 transition-transform duration-200',
                            product.isFavorite && 'fill-current scale-110'
                        )}
                    />
                </button>

                {/* Discount badge */}
                {product.originalPrice && (
                    <Badge variant='destructive' className='absolute top-3 left-3 bg-red-500 hover:bg-red-600'>
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </Badge>
                )}

                {/* Category badge */}
                <Badge variant='secondary' className='absolute bottom-3 left-3 bg-white/90 text-gray-700 hover:bg-white'>
                    {product.category.split(',')[0].trim()}
                </Badge>
            </CardHeader>

            <CardContent className='flex-grow space-y-3'>
                <CardTitle className='text-lg font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors h-12 mb-1'>
                    {product.title}
                </CardTitle>

                <p className='text-sm text-muted-foreground line-clamp-2 leading-relaxed'>{product.description}</p>

                {/* Instructor */}
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                    <div className='w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center'>
                        <Avatar>
                            <AvatarImage src={product.instructor.avatar} alt={product.instructor.name} />
                            <AvatarFallback>{product.instructor.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                    <span className='truncate'>{product.instructor.name}</span>
                </div>

                {/* Stats */}
                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                    <div className='flex items-center gap-1'>
                        <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                        <span className='font-medium'>{product.rating}</span>
                        <span>({product.reviewCount.toLocaleString()})</span>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-1'>
                            <Users className='h-3 w-3' />
                            <span>{product.students.toLocaleString()}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <Clock className='h-3 w-3' />
                            <span>{product.duration}</span>
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className='px-4 '>
                <div className='flex justify-between items-center w-full'>
                    {/* Price section */}
                    <div className='space-y-1'>
                        <div className='flex items-center gap-2'>
                            <span className='text-xl font-bold text-primary'>{product.price.toLocaleString('vi-VN')}₫</span>
                            {product.originalPrice && (
                                <span className='text-sm text-muted-foreground line-through'>
                                    {product.originalPrice.toLocaleString('vi-VN')}₫
                                </span>
                            )}
                        </div>
                    </div>

                    {/* View details button */}
                    <Button
                        size='sm'
                        className='group-hover:bg-primary/90 transition-colors'
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick?.(product);
                        }}
                    >
                        Xem chi tiết
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
