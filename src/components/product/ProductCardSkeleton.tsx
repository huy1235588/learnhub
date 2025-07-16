import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ProductCardSkeletonProps {
    className?: string;
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
    return (
        <Card className={cn('border-border/50 overflow-hidden pt-0', className)}>
            <CardHeader className='p-0 relative h-56 w-full overflow-hidden'>
                {/* Image skeleton */}
                <Skeleton className='w-full h-56 bg-slate-300' />

                {/* Favorite button skeleton */}
                <div className='absolute top-3 right-3'>
                    <Skeleton className='w-8 h-8 rounded-full bg-slate-300' />
                </div>

                {/* Discount badge skeleton */}
                <div className='absolute top-3 left-3'>
                    <Skeleton className='w-12 h-6 rounded-md bg-slate-300' />
                </div>

                {/* Category badge skeleton */}
                <div className='absolute bottom-3 left-3'>
                    <Skeleton className='w-20 h-6 rounded-md bg-slate-300' />
                </div>
            </CardHeader>

            <CardContent className='flex-grow space-y-3'>
                {/* Title skeleton */}
                <div className='space-y-2'>
                    <Skeleton className='h-5 w-full bg-slate-300' />
                    <Skeleton className='h-5 w-3/4 bg-slate-300' />
                </div>

                {/* Description skeleton */}
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-full bg-slate-300' />
                    <Skeleton className='h-4 w-2/3 bg-slate-300' />
                </div>

                {/* Instructor skeleton */}
                <div className='flex items-center gap-2'>
                    <Skeleton className='w-6 h-6 rounded-full bg-slate-300' />
                    <Skeleton className='h-3 w-24 bg-slate-300' />
                </div>

                {/* Stats skeleton */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1'>
                        <Skeleton className='w-3 h-3 bg-slate-300' />
                        <Skeleton className='h-3 w-8 bg-slate-300' />
                        <Skeleton className='h-3 w-12 bg-slate-300' />
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className='flex items-center gap-1'>
                            <Skeleton className='w-3 h-3 bg-slate-300' />
                            <Skeleton className='h-3 w-8 bg-slate-300' />
                        </div>
                        <div className='flex items-center gap-1'>
                            <Skeleton className='w-3 h-3 bg-slate-300' />
                            <Skeleton className='h-3 w-12 bg-slate-300' />
                        </div>
                    </div>
                </div>
            </CardContent>

            <CardFooter className='px-4'>
                <div className='flex justify-between items-center w-full'>
                    {/* Price section skeleton */}
                    <div className='space-y-1'>
                        <div className='flex items-center gap-2'>
                            <Skeleton className='h-6 w-20 bg-slate-300' />
                            <Skeleton className='h-4 w-16 bg-slate-300' />
                        </div>
                    </div>

                    {/* Button skeleton */}
                    <Skeleton className='h-9 w-24 bg-slate-300' />
                </div>
            </CardFooter>
        </Card>
    );
}
