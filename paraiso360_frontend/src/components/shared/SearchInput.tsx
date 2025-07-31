"use client";

import React, { useState, InputHTMLAttributes, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    initialValue?: string;
    onSearch?: (searchTerm: string) => void;
    onClear?: () => void;
    placeholder?: string;
    className?: string;
    showSearchButton?: boolean;
    liveSearch?: boolean;
    debounceTimeout?: number;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({
        initialValue = '',
        onSearch,
        onClear,
        placeholder = "Search...",
        className,
        showSearchButton = false,
        liveSearch = false,
        debounceTimeout = 300,
        ...props
    }, ref) => {
        const [searchTerm, setSearchTerm] = useState(initialValue);
        const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

        const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const newSearchTerm = event.target.value;
            setSearchTerm(newSearchTerm);

            if (liveSearch && onSearch) {
                if (debounceTimer) {
                    clearTimeout(debounceTimer);
                }
                const timer = setTimeout(() => {
                    onSearch(newSearchTerm);
                }, debounceTimeout);
                setDebounceTimer(timer);
            }
        };

        const handleSearchClick = () => {
            if (onSearch && !liveSearch) {
                onSearch(searchTerm);
            }
        };

        const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter' && onSearch && !liveSearch) {
                event.preventDefault();
                onSearch(searchTerm);
            }
        };

        const handleClearClick = () => {
            setSearchTerm('');
            if (onSearch && liveSearch) {
                onSearch('');
            }
            if (onClear) {
                onClear();
            }
            if (ref && typeof ref !== 'function' && ref.current) {
                ref.current.focus();
            }
        };

        return (
            <div className={cn("relative flex items-center w-full", className)}>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                    type="search"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="pl-10 pr-10 w-full"
                    ref={ref}
                    {...props}
                />
                {searchTerm && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-10 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full"
                        onClick={handleClearClick}
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
                {showSearchButton && !liveSearch && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-0 top-1/2 h-full w-10 -translate-y-1/2 rounded-l-none border-l"
                        onClick={handleSearchClick}
                        aria-label="Search"
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                )}
            </div>
        );
    }
);

SearchInput.displayName = "SearchInput"; 