import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Filter as FilterIcon, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { Filter } from './Filter';

interface ProductControlsProps {
    totalProducts: number;
    searchQuery: string;
    isSuggesting: boolean;
    viewingSuggestions: boolean;
    isFavoritesPage: boolean;
    onSearch: (query: string) => void;
    onFilterChange: (value: string) => void;
    onSuggest: () => void;
    onReturnToAll: () => void;
}

export function ProductControls({
    totalProducts,
    searchQuery,
    isSuggesting,
    viewingSuggestions,
    isFavoritesPage,
    onSearch,
    onFilterChange,
    onSuggest,
    onReturnToAll,
}: ProductControlsProps) {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className='space-y-4'>
            <div className='flex flex-col sm:flex-row gap-4 justify-between items-center'>
                <div className='flex-1 w-full'>
                    <SearchBar
                        onSearch={onSearch}
                        placeholder={isFavoritesPage ? 'Tìm kiếm trong yêu thích...' : 'Tìm kiếm khóa học...'}
                        className='h-12'
                    />
                </div>
                <div className='flex items-center gap-2'>
                    {!isFavoritesPage && (
                        <Button onClick={onSuggest} disabled={isSuggesting} variant='outline' className='h-12'>
                            <Wand2 className='h-4 w-4 mr-2' />
                            {isSuggesting ? 'Đang tìm...' : 'Gợi ý cho bạn'}
                        </Button>
                    )}
                    <Button variant='outline' size='sm' onClick={() => setShowFilters(!showFilters)} className='sm:hidden'>
                        <FilterIcon className='h-4 w-4' /> Lọc
                    </Button>
                </div>
            </div>

            <div
                className={cn(
                    'transition-all duration-300 overflow-hidden',
                    (showFilters || 'hidden sm:block') && !viewingSuggestions
                )}
            >
                <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
                    <Filter onFilterChange={onFilterChange} />
                    <div className='text-sm text-muted-foreground'>
                        Tìm thấy <span className='font-semibold'>{totalProducts}</span> khóa học
                        {searchQuery && <span> cho &ldquo;{searchQuery}&rdquo;</span>}
                    </div>
                </div>
            </div>

            {viewingSuggestions && (
                <div className='flex justify-between items-center pt-2'>
                    <div className='text-sm text-muted-foreground'>Hiển thị các gợi ý phù hợp nhất cho bạn.</div>
                    <Button variant='link' onClick={onReturnToAll}>
                        Quay lại tất cả khóa học
                    </Button>
                </div>
            )}
        </div>
    );
}
