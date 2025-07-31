"use client";

import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ListChecks, FileSearch, Download, Filter } from 'lucide-react';
import { REPORT_TYPES, ReportDefinition } from '@/lib/constants';
import { APP_ROUTES } from '@/lib/constants';
import type { BreadcrumbItem } from '@/types/paraiso';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";

import { DatePickerWithRange } from '@/components/ui/date-range-picker';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const availableReports: ReportDefinition[] = Object.values(REPORT_TYPES);

export default function ReportsHubPage() {
    const [selectedReport, setSelectedReport] = useState<ReportDefinition | null>(null);
    const [showReportContent, setShowReportContent] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);

    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [statusFilter, setStatusFilter] = useState<string>('');

    const handleReportClick = (report: ReportDefinition) => {
        setSelectedReport(report);
        setDateRange(undefined);
        setStatusFilter('');
        setShowFilterModal(true);
    };

    const handleGenerateReport = () => {
        if (selectedReport) {
            console.log(`Generating report: ${selectedReport.title} with filters:`, { dateRange, statusFilter });
            setShowReportContent(true);
            setShowFilterModal(false);
        }
    };

    const closeReportView = () => {
        setShowReportContent(false);
        setSelectedReport(null);
    };

    const renderFilterOptions = () => {
        if (!selectedReport) return null;

        const commonSelectClass = "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

        switch (selectedReport.id) {
            case REPORT_TYPES.PAYMENT_COLLECTION.id:
                return (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="date-range-picker">Date Range</Label>
                            <DatePickerWithRange
                                id="date-range-picker"
                                date={dateRange}
                                onDateChange={setDateRange}
                                className="mt-1"
                            />
                            <p className="text-xs text-muted-foreground">Select a date range for payments.</p>
                        </div>
                        <div className="grid gap-2 mt-4">
                            <Label htmlFor="payment-status">Payment Status</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger id="payment-status" className={commonSelectClass.replace("flex h-9", "h-9").replace("bg-transparent", "")}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="overdue">Overdue</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </>
                );
            case REPORT_TYPES.LOT_OCCUPANCY.id:
            case REPORT_TYPES.AVAILABLE_LOTS.id:
                return (
                    <div className="grid gap-2">
                        <Label htmlFor="lot-type">Lot Type</Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger id="lot-type" className={commonSelectClass.replace("flex h-9", "h-9").replace("bg-transparent", "")}>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Sold">Sold</SelectItem>
                                <SelectItem value="Diamond">Diamond</SelectItem>
                                <SelectItem value="Platinum">Platinum</SelectItem>
                                <SelectItem value="Gold">Gold</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                );
            default:
                return <p className="text-sm text-muted-foreground">No specific filters available for this report.</p>;
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Dashboard", href: APP_ROUTES.STAFF_DASHBOARD },
        { label: "Reports" },
    ];

    if (showReportContent && selectedReport) {
        const reportBreadcrumbs: BreadcrumbItem[] = [
            ...breadcrumbs,
            { label: selectedReport.title },
        ];

        let filterLabel = "";
        let filterValue = "";

        if (selectedReport.id === REPORT_TYPES.LOT_OCCUPANCY.id || selectedReport.id === REPORT_TYPES.AVAILABLE_LOTS.id) {
            filterLabel = "Type";
            filterValue = statusFilter;
        } else if (selectedReport.id === REPORT_TYPES.PAYMENT_COLLECTION.id) {
            filterLabel = "Payment Status";
            filterValue = statusFilter;
        }

        return (
            <PageWrapper
                title={`Report: ${selectedReport.title}`}
                className="relative"
                breadcrumbs={reportBreadcrumbs}
            >
                <Button
                    variant="outline"
                    size="sm"
                    onClick={closeReportView}
                    className="absolute top-4 right-6 md:top-6"
                >
                    Back to Reports List
                </Button>
                <Card className="mt-6">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                                <CardTitle>{selectedReport.title}</CardTitle>
                                <CardDescription className="text-xs line-clamp-3 min-h-[45px]">{selectedReport.description}</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => { setShowFilterModal(true); setShowReportContent(false); }}><Filter className="mr-2 h-4 w-4" /> Modify Filters</Button>
                                <Button size="sm" onClick={() => alert('PDF Download functionality to be implemented.')}><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
                            </div>
                        </div>
                        <Separator />
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p><strong>Applied Filters:</strong></p>
                            {dateRange && (dateRange.from || dateRange.to) && <p>Date Range: {dateRange.from?.toLocaleDateString() || 'N/A'} - {dateRange.to?.toLocaleDateString() || 'N/A'}</p>}
                            {filterValue && filterValue !== 'all' && <p>{filterLabel}: {filterValue}</p>}
                            {filterValue === 'all' && <p>{filterLabel}: All</p>}
                            {!(dateRange && (dateRange.from || dateRange.to)) && !filterValue && <p>None</p>}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-center py-10 text-muted-foreground">
                            Report data for "{selectedReport.title}" would be displayed here based on selected filters.
                        </p>
                    </CardContent>
                </Card>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper
            title="System Reports"
            breadcrumbs={breadcrumbs}
            actions={
                <Button variant="outline" size="sm" disabled>
                    <FileSearch className="mr-2 h-4 w-4" />
                    Custom Report Builder (Future)
                </Button>
            }
        >
            <p className="mb-6 text-muted-foreground">
                Select a report from the list below to view its details and generate output.
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {availableReports.map((report) => (
                    <Card key={report.id} className="flex flex-col">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <ListChecks className="h-6 w-6 text-primary" />
                                <CardTitle>{report.title}</CardTitle>
                            </div>
                            <CardDescription className="text-xs line-clamp-3 min-h-[45px]">{report.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="mt-auto pt-4">
                            <Button
                                variant="default"
                                size="sm"
                                className="w-full"
                                onClick={() => handleReportClick(report)}
                            >
                                <Filter className="mr-2 h-4 w-4" /> Configure & View
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {selectedReport && (
                <Dialog open={showFilterModal} onOpenChange={(isOpen) => { if (!isOpen) { setShowFilterModal(false); /* if (!showReportContent) setSelectedReport(null); */ } else { setShowFilterModal(true); } }}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>{`Configure Report: ${selectedReport.title}`}</DialogTitle>
                            <DialogDescription>Set filters below before generating the report.</DialogDescription>
                        </DialogHeader>
                        <div className="py-4 max-h-[60vh] overflow-y-auto pr-2">
                            {renderFilterOptions()}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleGenerateReport}>Generate Report</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </PageWrapper>
    );
}
