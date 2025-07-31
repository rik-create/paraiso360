"use client";

import React, { useState, useMemo } from 'react';
import { mockAuditLogs, mockUsers } from '@/lib/mockData';
import type { AuditLog } from '@/types/paraiso';
// import { formatDate } from '@/lib/utils'; // Not used directly if using toLocaleString for more detail

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"; // Assuming Table is available or will be added
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { FilterX, Search } from 'lucide-react';

// For a proper date range picker, you'd import your shadcn/ui DatePicker component here
// import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"; // Example name
// import { DateRange } from "react-day-picker";

const uniqueUsernames = Array.from(new Set(mockAuditLogs.map(log => log.username))).sort();
const uniqueActionTypes = Array.from(new Set(mockAuditLogs.map(log => log.actionPerformed))).sort();

export function AuditLogTable() {
    const [logs] = useState<AuditLog[]>(mockAuditLogs); // setLogs is not used, so remove it for now
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsername, setSelectedUsername] = useState<string>('');
    const [selectedActionType, setSelectedActionType] = useState<string>('');
    const [dateFrom, setDateFrom] = useState<string>(''); // YYYY-MM-DD
    const [dateTo, setDateTo] = useState<string>('');     // YYYY-MM-DD

    const filteredLogs = useMemo(() => {
        return logs
            .filter(log => {
                const logDate = new Date(log.timestamp);
                const from = dateFrom ? new Date(dateFrom) : null;
                const to = dateTo ? new Date(dateTo) : null;

                if (from && logDate < from) return false;
                if (to) {
                    const toEndOfDay = new Date(to);
                    toEndOfDay.setHours(23, 59, 59, 999);
                    if (logDate > toEndOfDay) return false;
                }
                return true;
            })
            .filter(log => selectedUsername ? log.username === selectedUsername : true)
            .filter(log => selectedActionType ? log.actionPerformed === selectedActionType : true)
            .filter(log =>
                searchTerm
                    ? (log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.affectedRecordId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.username.toLowerCase().includes(searchTerm.toLowerCase()))
                    : true
            );
    }, [logs, searchTerm, selectedUsername, selectedActionType, dateFrom, dateTo]);

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedUsername('');
        setSelectedActionType('');
        setDateFrom('');
        setDateTo('');
    };

    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 15;
    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

    const formatDetailedTimestamp = (dateString: Date | string) => {
        const date = new Date(dateString);
        return date.toLocaleString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    };

    const commonSelectClass = "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Activity Logs</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-6 p-4 border rounded-lg bg-muted/50 dark:bg-gray-800/30">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end">
                        <div className="space-y-1">
                            <label htmlFor="searchDetails" className="text-sm font-medium text-muted-foreground">Search Details/ID</label>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="searchDetails"
                                    placeholder="Search in details, ID, user..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="userFilter" className="text-sm font-medium text-muted-foreground">User</label>
                            <Select value={selectedUsername} onValueChange={setSelectedUsername}>
                                <SelectTrigger id="userFilter" className={commonSelectClass.replace("flex h-9", "h-9").replace("bg-transparent", "")}>
                                    <SelectValue placeholder="All Users" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Users</SelectItem>
                                    {uniqueUsernames.map(username => (
                                        <SelectItem key={username} value={username}>{username}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="actionFilter" className="text-sm font-medium text-muted-foreground">Action Type</label>
                            <Select value={selectedActionType} onValueChange={setSelectedActionType}>
                                <SelectTrigger id="actionFilter" className={commonSelectClass.replace("flex h-9", "h-9").replace("bg-transparent", "")}>
                                    <SelectValue placeholder="All Actions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Actions</SelectItem>
                                    {uniqueActionTypes.map(action => (
                                        <SelectItem key={action} value={action}>{action}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="dateFrom" className="text-sm font-medium text-muted-foreground">Date From</label>
                            <Input
                                id="dateFrom"
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="dateTo" className="text-sm font-medium text-muted-foreground">Date To</label>
                            <Input
                                id="dateTo"
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>
                    </div>
                    <Button onClick={clearFilters} variant="outline" size="sm" className="mt-4">
                        <FilterX className="mr-2 h-4 w-4" /> Clear Filters
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[220px]">Timestamp</TableHead> {/* Increased width for detailed timestamp */}
                                <TableHead className="w-[120px]">User</TableHead>
                                <TableHead className="w-[180px]">Action Performed</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead className="w-[120px]">Affected ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentLogs.length > 0 ? (
                                currentLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>
                                            {formatDetailedTimestamp(log.timestamp)}
                                        </TableCell>
                                        <TableCell>{log.username}</TableCell>
                                        <TableCell>{log.actionPerformed}</TableCell>
                                        <TableCell className="max-w-xs truncate" title={log.details}>{log.details}</TableCell>
                                        <TableCell>{log.affectedRecordId || 'N/A'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        No audit logs found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 