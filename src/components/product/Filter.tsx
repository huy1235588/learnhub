'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axiosInstance from '@/lib/axios';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';

// Định nghĩa kiểu dữ liệu cho các giá trị lọc sẽ được gửi lên component cha
export interface FilterValues {
    price: string;
    category: string;
    rating: string;
}

// Định nghĩa kiểu dữ liệu cho props của component Filter
interface FilterProps {
    onFilterChange: (filters: FilterValues) => void;
}

// Định nghĩa kiểu dữ liệu cho dữ liệu lấy về từ API
interface ApiFilterData {
    categories: string[];
    tags: string[];
}

export function Filter({ onFilterChange }: FilterProps) {
    // State để lưu trữ dữ liệu lọc từ API
    const [apiData, setApiData] = useState<ApiFilterData | null>(null);
    // State để quản lý trạng thái loading
    const [isLoading, setIsLoading] = useState(true);

    // State cho từng giá trị bộ lọc được chọn
    const [price, setPrice] = useState('all');
    const [category, setCategory] = useState('all');
    const [rating, setRating] = useState('all');

    // Lấy dữ liệu cho các bộ lọc khi component được mount
    useEffect(() => {
        const fetchFilterData = async () => {
            try {
                // Giả sử API route của bạn là '/api/filters' dựa trên cấu trúc file
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

    // Gửi các giá trị lọc mới nhất lên component cha mỗi khi có sự thay đổi
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
            {/* Bộ lọc theo giá */}
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

            {/* Bộ lọc theo danh mục */}
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

            {/*  Bộ lọc đánh giá (Rating) */}
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
