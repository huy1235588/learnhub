'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterProps {
    onFilterChange: (value: string) => void;
}

export function Filter({ onFilterChange }: FilterProps) {
    return (
        <div className='flex items-center gap-2'>
            <Label htmlFor='price-filter'>Lọc theo giá</Label>
            <Select onValueChange={onFilterChange} defaultValue='all'>
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
    );
}
