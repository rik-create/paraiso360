"use client";

import React, { useState, useMemo, useCallback } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DataTableColumn<TData> {
    accessorKey: keyof TData | string;
    header: React.ReactNode | ((props: { column: DataTableColumn<TData>; sort: () => void; sortDirection?: 'asc' | 'desc' }) => React.ReactNode);
    cell: (props: { row: TData; value: any }) => React.ReactNode;
    enableSorting?: boolean;
    enableFiltering?: boolean;
    size?: string;
}

interface DataTableProps<TData> {
    columns: DataTableColumn<TData>[];
    data: TData[];
    initialPageSize?: number;
    enableGlobalFilter?: boolean;
    globalFilterPlaceholder?: string;
    onRowClick?: (row: TData) => void;
    noResultsMessage?: string;
    className?: string;
    isLoading?: boolean;
    loadingRows?: number;
}

export function DataTable<TData extends { id: string | number }>({
    columns,
    data,
    initialPageSize = 10,
    enableGlobalFilter = true,
    globalFilterPlaceholder = "Search all columns...",
    onRowClick,
    noResultsMessage = "No results found.",
    className,
    isLoading = false,
    loadingRows = 5,
}: DataTableProps<TData>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof TData | string; direction: 'asc' | 'desc' } | null>(null);

    const filteredData = useMemo(() => {
        if (!data) return [];
        let filtered = data;
        if (globalFilter) {
            filtered = filtered.filter(item =>
                columns.some(column => {
                    const value = getNestedValue(item, column.accessorKey as string);
                    return String(value).toLowerCase().includes(globalFilter.toLowerCase());
                })
            );
        }
        return filtered;
    }, [data, globalFilter, columns]);

    const sortedData = useMemo(() => {
        if (!sortConfig) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aValue = getNestedValue(a, sortConfig.key as string);
            const bValue = getNestedValue(b, sortConfig.key as string);

            if (aValue === null || aValue === undefined) return 1; // Sort nulls/undefined to the end
            if (bValue === null || bValue === undefined) return -1;

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }
            // Basic string/other comparison
            if (String(aValue).toLowerCase() < String(bValue).toLowerCase()) return sortConfig.direction === 'asc' ? -1 : 1;
            if (String(aValue).toLowerCase() > String(bValue).toLowerCase()) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return sortedData.slice(startIndex, startIndex + pageSize);
    }, [sortedData, currentPage, pageSize]);

    const totalPages = Math.ceil(sortedData.length / pageSize);

    const handleSort = useCallback((key: keyof TData | string) => {
        setSortConfig(prevConfig => {
            if (prevConfig && prevConfig.key === key) {
                return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
        setCurrentPage(1);
    }, []);

    const getNestedValue = (obj: any, path: string): any => {
        if (!path || typeof path !== 'string') return undefined;
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    if (isLoading) {
        return (
            <div className={cn("space-y-4", className)}>
                {enableGlobalFilter && <div className="h-10 w-full md:max-w-sm bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableHead key={`header-skeleton-${index}`} className={cn(column.size, "h-12 bg-gray-200 dark:bg-gray-700 animate-pulse")}></TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: loadingRows }).map((_, rowIndex) => (
                                <TableRow key={`row-skeleton-${rowIndex}`}>
                                    {columns.map((column, cellIndex) => (
                                        <TableCell key={`cell-skeleton-${rowIndex}-${cellIndex}`} className="h-10 bg-gray-100 dark:bg-gray-700/50 animate-pulse"></TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("space-y-4", className)}>
            {enableGlobalFilter && (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder={globalFilterPlaceholder}
                        value={globalFilter}
                        onChange={(e) => {
                            setGlobalFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full md:max-w-sm pl-10"
                    />
                </div>
            )}
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column, index) => (
                                <TableHead key={`header-${index}`} className={cn(column.size)}>
                                    {typeof column.header === 'function' ? (
                                        column.header({ column, sort: () => column.enableSorting && handleSort(column.accessorKey), sortDirection: sortConfig?.key === column.accessorKey ? sortConfig.direction : undefined })
                                    ) : column.enableSorting ? (
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort(column.accessorKey)}
                                            className="-ml-3 whitespace-nowrap"
                                        >
                                            {column.header}
                                            {sortConfig?.key === column.accessorKey && (
                                                sortConfig.direction === 'asc' ? <ArrowUpDown className="ml-2 h-4 w-4 rotate-180 flex-shrink-0" /> : <ArrowUpDown className="ml-2 h-4 w-4 flex-shrink-0" />
                                            )}
                                            {sortConfig?.key !== column.accessorKey && <ArrowUpDown className="ml-2 h-4 w-4 opacity-50 flex-shrink-0" />}
                                        </Button>
                                    ) : (
                                        column.header
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row) => (
                                <TableRow
                                    key={row.id}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    className={cn(onRowClick && "cursor-pointer hover:bg-muted/50")}
                                    data-state={undefined}
                                >
                                    {columns.map((column, cellIndex) => (
                                        <TableCell key={`cell-${row.id}-${cellIndex}`}>
                                            {column.cell({ row, value: getNestedValue(row, column.accessorKey as string) })}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {noResultsMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {totalPages > 1 && (
                <div className="flex items-center justify-between py-4 flex-wrap gap-2">
                    <div className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}. Total {sortedData.length} results.
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
} 