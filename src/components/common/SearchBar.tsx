'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search as SearchIcon } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchBar({ onSearch, placeholder = 'Tìm kiếm khoá học...', className }: SearchBarProps) {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        onSearch(query);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className='flex w-full items-center space-x-2'>
            <Input
                type='search'
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className={cn('flex-1 border-slate-600', className)}
            />
            <Button type='button' onClick={handleSearch}>
                <SearchIcon className='h-4 w-4' />
            </Button>
        </div>
    );
}
