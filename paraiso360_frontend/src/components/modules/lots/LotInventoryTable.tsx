"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, MapPin, Edit, Eye } from 'lucide-react';
import type { Plot, Client } from '@/types/paraiso';
import { mockClients, mockPlots } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { APP_ROUTES } from '@/lib/constants';
import { EditPlotForm } from './EditPlotForm';
import { toast } from "sonner";

interface LotInventoryTableProps {
    plots: Plot[];
}

const getOwnerName = (ownerClientId?: string): string => {
    if (!ownerClientId) return 'N/A';
    const owner = mockClients.find(client => client.id === ownerClientId);
    return owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown Owner';
};

const getStatusBadgeVariant = (status: Plot['status']): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" => {
    switch (status) {
        case 'Available':
            return 'success';
        case 'Reserved':
            return 'warning';
        case 'Occupied':
            return 'destructive';
        case 'Maintenance':
            return 'outline';
        default:
            return 'secondary';
    }
};

export function LotInventoryTable({ plots }: LotInventoryTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<Plot['status'] | 'All'>('All');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);

    const filteredPlots = useMemo(() => {
        return plots.filter(plot => {
            const matchesSearchTerm =
                plot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                plot.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
                plot.blockNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                plot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (plot.ownerClientId && getOwnerName(plot.ownerClientId).toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesStatus = filterStatus === 'All' || plot.status === filterStatus;

            return matchesSearchTerm && matchesStatus;
        });
    }, [plots, searchTerm, filterStatus]);

    const handleEditPlot = (plotId: string) => {
        const plotToEdit = plots.find(p => p.id === plotId);
        if (plotToEdit) {
            setSelectedPlot(plotToEdit);
            setIsEditModalOpen(true);
        } else {
            toast.error("Error", { description: "Plot not found." });
        }
    };
    
    const handleSavePlot = (updatedPlot: Plot) => {
        // In a real application, this would call an API to update the plot
        // For this prototype, we're just showing a toast notification
        
        // Find the plot in the mockPlots array and update it
        const plotIndex = mockPlots.findIndex(p => p.id === updatedPlot.id);
        if (plotIndex !== -1) {
            mockPlots[plotIndex] = updatedPlot;
            toast.success("Success", { description: `Plot ${updatedPlot.id} updated successfully.` });
            
            // Force re-rendering of the table (in a real app this would be handled by state management)
            // This is just a workaround for the prototype
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
                <Input
                    placeholder="Search lots (ID, Section, Owner...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                />
                <div className="flex gap-2 items-center">
                    <span className="text-sm text-muted-foreground">Filter by status:</span>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as Plot['status'] | 'All')}
                        className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Available">Available</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>
            </div>
            <Card className="border shadow-sm rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">Plot ID</TableHead>
                            <TableHead>Section</TableHead>
                            <TableHead>Block</TableHead>
                            <TableHead>Lot No.</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Current Owner</TableHead>
                            <TableHead className="text-right w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPlots.length > 0 ? (
                            filteredPlots.map((plot) => (
                                <TableRow key={plot.id}>
                                    <TableCell className="font-medium">{plot.id}</TableCell>
                                    <TableCell>{plot.section}</TableCell>
                                    <TableCell>{plot.blockNumber}</TableCell>
                                    <TableCell>{plot.lotNumber}</TableCell>
                                    <TableCell>{plot.type}</TableCell>
                                    <TableCell>
                                        <span className={`capitalize text-xs px-2 py-1 rounded ${
                                            plot.status === 'Available' ? 'bg-green-100 text-green-700' : 
                                            plot.status === 'Reserved' ? 'bg-yellow-100 text-yellow-700' : 
                                            plot.status === 'Occupied' ? 'bg-red-100 text-red-700' : 
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {plot.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{getOwnerName(plot.ownerClientId)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`${APP_ROUTES.STAFF_LOT_MAP}?plotId=${plot.id}`} >
                                                        <MapPin className="mr-2 h-4 w-4" />
                                                        View on Map
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEditPlot(plot.id)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/staff/lots/inventory/${plot.id}`} >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Full Details
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    No lots found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
            
            {/* Edit Plot Modal */}
            {selectedPlot && (
                <EditPlotForm
                    plot={selectedPlot}
                    isOpen={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                    onSave={handleSavePlot}
                />
            )}
        </div>
    );
}