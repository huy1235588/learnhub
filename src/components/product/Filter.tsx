'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axiosInstance from '@/lib/axios';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

// Define the structure of filter values
export interface FilterValues {
    price: string;
    category: string;
    rating: string;
}

// Define props for the Filter component
interface FilterProps {
    onFilterChange: (filters: FilterValues) => void;
}

// Define the structure of API response for filter data
interface ApiFilterData {
    categories: string[];
    tags: string[];
}

export function Filter({ onFilterChange }: FilterProps) {
    const [apiData, setApiData] = useState<ApiFilterData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // State for filter values
    const [price, setPrice] = useState('all');
    const [category, setCategory] = useState('all');
    const [rating, setRating] = useState('all');

    // Fetch filter data from API
    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                const response = await axiosInstance('/api/filters');
                const result = await response.data;
                if (result.success) {
                    setApiData(result.data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu bộ lọc:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFilterData();
    }, []);

    // Update filter values when any of them changes
    useEffect(() => {
        onFilterChange({
            price,
            category,
            rating,
        });
    }, [price, category, rating, onFilterChange]);

    if (isLoading) {
        return <div>Đang tải bộ lọc...</div>;
    }

    return (
        <div className='flex flex-wrap items-center gap-4 p-4 bg-secondary rounded-lg'>
            {/* Filter by price */}
            <div className='flex items-center gap-2'>
                <Label htmlFor='price-filter' className='font-semibold'>
                    Lọc theo giá
                </Label>
                <Select onValueChange={setPrice} defaultValue={price}>
                    <SelectTrigger id='price-filter' className='w-[180px]'>
                        <SelectValue placeholder='Chọn mức giá' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>Tất cả</SelectItem>
                        <SelectItem value='<500000'>Dưới 500K</SelectItem>
                        <SelectItem value='500000-1000000'>500K - 1 triệu</SelectItem>
                        <SelectItem value='>1000000'>Trên 1 triệu</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Filter by category */}
            <div className='flex items-center gap-2'>
                <Label htmlFor='category-filter' className='font-semibold'>
                    Danh mục
                </Label>
                <Select onValueChange={setCategory} defaultValue={category}>
                    <SelectTrigger id='category-filter' className='w-[180px]'>
                        <SelectValue placeholder='Chọn danh mục' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>Tất cả</SelectItem>
                        {apiData?.categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Filter by rating */}
            <div className='flex items-center gap-2'>
                <Label htmlFor='rating-filter'>Lọc theo đánh giá</Label>
                <Select onValueChange={setRating} defaultValue='all'>
                    <SelectTrigger id='rating-filter' className='w-[180px]'>
                        <SelectValue placeholder='Chọn đánh giá' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>Tất cả</SelectItem>
                        <SelectItem value='5'>
                            <span className='flex items-center gap-1'>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className='text-yellow-400' fill='currentColor' />
                                ))}
                                <span className='text-xs ml-1'>trở lên</span>
                            </span>
                        </SelectItem>
                        <SelectItem value='4'>
                            <span className='flex items-center gap-1'>
                                {[...Array(4)].map((_, i) => (
                                    <Star key={i} size={16} className='text-yellow-400' fill='currentColor' />
                                ))}
                                <span className='text-xs ml-1'>trở lên</span>
                            </span>
                        </SelectItem>
                        <SelectItem value='3'>
                            <span className='flex items-center gap-1'>
                                {[...Array(3)].map((_, i) => (
                                    <Star key={i} size={16} className='text-yellow-400' fill='currentColor' />
                                ))}
                                <span className='text-xs ml-1'>trở lên</span>
                            </span>
                        </SelectItem>
                        <SelectItem value='2'>
                            <span className='flex items-center gap-1'>
                                {[...Array(2)].map((_, i) => (
                                    <Star key={i} size={16} className='text-yellow-400' fill='currentColor' />
                                ))}
                                <span className='text-xs ml-1'>trở lên</span>
                            </span>
                        </SelectItem>
                        <SelectItem value='1'>
                            <span className='flex items-center gap-1'>
                                {[...Array(1)].map((_, i) => (
                                    <Star key={i} size={16} className='text-yellow-400' fill='currentColor' />
                                ))}
                                <span className='text-xs ml-1'>trở lên</span>
                            </span>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
