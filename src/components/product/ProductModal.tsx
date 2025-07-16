'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useFavoritesContext } from '@/contexts/FavoritesContext';
import { cn } from '@/lib/utils';
import { Product } from '@/types/product';
import { BookOpen, Calendar, Check, Clock, Heart, ShoppingCart, Star, Users } from 'lucide-react';
import Image from 'next/image';

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
    const { toggleFavorite, isFavorite } = useFavoritesContext();
    const { addToCart, isItemInCart, isAddingToCart } = useCart();

    if (!product) return null;

    const isInCart = isItemInCart(product.id);

    const handleFavoriteToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        toggleFavorite(product.id);
    };

    const handleAddToCart = async () => {
        addToCart(product.id);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='max-h-[95vh] w-full max-w-md overflow-y-auto sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl'>
                {/* Title */}
                <DialogTitle className='text-2xl font-bold lg:hidden'>{product.title}</DialogTitle>

                <div className='grid gap-8 lg:grid-cols-3'>
                    {/* Left Column (2/3 width) */}
                    <div className='h-fit space-y-4 lg:sticky md:top-0 lg:col-span-1'>
                        <div className='relative w-full overflow-hidden rounded-lg aspect-video'>
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className='object-cover'
                                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                            />
                        </div>

                        <div className='space-y-3'>
                            <div className='flex items-baseline gap-2'>
                                <span className='text-3xl font-bold text-primary'>{formatPrice(product.price)}</span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <span className='text-lg text-gray-500 line-through'>
                                        {formatPrice(product.originalPrice)}
                                    </span>
                                )}
                            </div>

                            <div className='flex flex-col gap-2'>
                                {/* Add to Cart Button */}
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart || isInCart}
                                    size='lg'
                                    className={cn(
                                        'flex w-full items-center gap-2',
                                        isAddingToCart || isInCart ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                                    )}
                                >
                                    {isAddingToCart ? (
                                        <div className='h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent' />
                                    ) : isInCart ? (
                                        <Check className='h-5 w-5' />
                                    ) : (
                                        <ShoppingCart className='h-5 w-5' />
                                    )}
                                    {isAddingToCart ? 'Đang thêm...' : isInCart ? 'Đã có trong giỏ hàng' : 'Thêm vào giỏ hàng'}
                                </Button>

                                {/* Favorite Button */}
                                <Button variant='outline' size='lg' className='w-full' onClick={handleFavoriteToggle}>
                                    <Heart
                                        className={cn(
                                            'h-5 w-5 mr-2 transition-transform duration-200',
                                            isFavorite(product.id) ? 'fill-current text-red-500' : 'text-gray-500'
                                        )}
                                    />
                                    {isFavorite(product.id) ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        <div className='space-y-3 text-sm'>
                            <h4 className='text-base font-semibold'>Thông tin khóa học</h4>
                            <div className='flex items-center gap-2 text-muted-foreground'>
                                <Clock className='h-4 w-4' />
                                <span>Thời lượng: {product.duration}</span>
                            </div>
                            <div className='flex items-center gap-2 text-muted-foreground'>
                                <Calendar className='h-4 w-4' />
                                <span>Cập nhật: {formatDate(product.lastUpdated)}</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Badge variant='secondary'>{product.category}</Badge>
                            </div>
                        </div>

                        {product.tags.length > 0 && (
                            <div>
                                <h4 className='mb-2 text-base font-semibold'>Chủ đề</h4>
                                <div className='flex flex-wrap gap-2'>
                                    {product.tags.map((tag) => (
                                        <Badge key={tag} variant='outline' className='text-xs'>
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column (1/3 width) */}
                    <div className='space-y-6 lg:col-span-2'>
                        <DialogHeader className='space-y-2'>
                            <DialogTitle className='text-3xl font-bold leading-tight hidden lg:block'>
                                {product.title}
                            </DialogTitle>

                            <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground'>
                                <div className='flex items-center gap-1.5'>
                                    <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                                    <span className='font-medium'>{product.rating}</span>
                                    <span>({product.reviewCount} đánh giá)</span>
                                </div>
                                <div className='flex items-center gap-1.5'>
                                    <Users className='h-4 w-4' />
                                    <span>{product.students.toLocaleString()} học viên</span>
                                </div>
                            </div>
                        </DialogHeader>

                        {/* Instructor Info */}
                        <div className='space-y-4'>
                            <h3 className='flex items-center gap-2 text-xl font-semibold'>
                                <BookOpen className='h-5 w-5' />
                                Giảng viên
                            </h3>
                            <div className='flex items-start gap-4'>
                                <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full'>
                                    <Image
                                        src={product.instructor.avatar}
                                        alt={product.instructor.name}
                                        fill
                                        className='object-cover'
                                        sizes='64px'
                                    />
                                </div>
                                <div className='space-y-1'>
                                    <h4 className='text-lg font-semibold'>{product.instructor.name}</h4>
                                    <p className='text-sm leading-relaxed text-muted-foreground'>{product.instructor.bio}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Course Description */}
                        <div className='space-y-4'>
                            <h3 className='text-xl font-semibold'>Mô tả khóa học</h3>
                            <DialogDescription className='whitespace-pre-line text-base leading-relaxed'>
                                {product.fullDescription}
                            </DialogDescription>
                        </div>

                        <Separator />

                        {/* User Reviews */}
                        {product.reviews && product.reviews.length > 0 && (
                            <div className='space-y-4'>
                                <h3 className='text-xl font-semibold'>Đánh giá từ học viên</h3>
                                <div className='-my-4 divide-y divide-gray-200 dark:divide-gray-800'>
                                    {product.reviews.slice(0, 3).map((review) => (
                                        <div key={review.id} className='flex items-start gap-4 py-4'>
                                            <div className='relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted'>
                                                <span className='font-semibold text-muted-foreground'>
                                                    {review.userId.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className='flex-1'>
                                                <div className='flex items-center justify-between'>
                                                    <p className='text-sm font-semibold'>{review.userId}</p>
                                                    <p className='text-xs text-muted-foreground'>
                                                        {formatDate(review.createdAt)}
                                                    </p>
                                                </div>
                                                <div className='my-1 flex items-center gap-0.5'>
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={cn(
                                                                'h-4 w-4',
                                                                i < review.rating
                                                                    ? 'fill-yellow-400 text-yellow-400'
                                                                    : 'text-gray-300'
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                                <p className='text-sm text-muted-foreground'>{review.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {product.reviews.length > 3 && (
                                    <Button
                                        variant='outline'
                                        className='w-full mt-3'
                                        onClick={() => console.log('View all reviews')}
                                    >
                                        Xem thêm {product.reviews.length - 3} đánh giá
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
