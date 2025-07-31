"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockPlots } from '@/lib/mockData'; // Assuming mockPlots is imported
import type { Plot, Client } from '@/types/paraiso';
import { PLOT_STATUSES } from '@/lib/constants';
import { Search } from 'lucide-react';

interface AssignPlotDialogProps {
    client: Client; // The client to whom the plot will be assigned
    currentAssignedPlotIds: string[]; // IDs of plots already assigned to this client
    onAssignPlot: (clientId: string, plotId: string) => void; // Callback function when a plot is assigned
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AssignPlotDialog({
    client,
    currentAssignedPlotIds,
    onAssignPlot,
    open,
    onOpenChange
}: AssignPlotDialogProps) {
    const [availablePlots, setAvailablePlots] = useState<Plot[]>([]);
    const [selectedPlotId, setSelectedPlotId] = useState<string | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Filter for available plots that are not already assigned to *this* client
        // In a real app, this filtering might be more complex or done server-side
        const filtered = mockPlots.filter(
            (plot) => plot.status === PLOT_STATUSES.AVAILABLE && !currentAssignedPlotIds.includes(plot.id)
        );
        setAvailablePlots(filtered);
    }, [currentAssignedPlotIds, mockPlots]); // Added mockPlots dependency incase it changes


    const searchablePlots = useMemo(() => {
        if (!searchTerm) return availablePlots;
        return availablePlots.filter(plot =>
            `${plot.section}-${plot.blockNumber}-${plot.lotNumber}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plot.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [availablePlots, searchTerm]);

    const handleAssign = () => {
        if (selectedPlotId && client.id) {
            onAssignPlot(client.id, selectedPlotId);
            setSelectedPlotId(undefined); // Reset selection
            setSearchTerm(''); // Reset search
            // onOpenChange(false); // Dialog will be closed by DialogClose or by parent
        }
    };

    if (!client) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Trigger is handled by the parent component */}
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Assign New Plot to {client.firstName} {client.lastName}</DialogTitle>
                    <DialogDescription>
                        Select an available plot from the list to assign to this client.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search available plots (e.g., A-01-001, Lawn Lot)..."
                            className="w-full pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {searchablePlots.length > 0 ? (
                        <div className="space-y-2">
                            <Label htmlFor="available-plots">Available Plots</Label>
                            <Select onValueChange={setSelectedPlotId} value={selectedPlotId}>
                                <SelectTrigger id="available-plots" className="w-full">
                                    <SelectValue placeholder="Select an available plot" />
                                </SelectTrigger>
                                <SelectContent>
                                    <ScrollArea className="h-[200px]"> {/* Make the list scrollable */}
                                        {searchablePlots.map((plot) => (
                                            <SelectItem key={plot.id} value={plot.id}>
                                                {plot.section}-{plot.blockNumber}-{plot.lotNumber} ({plot.type}) - Status: {plot.status}
                                            </SelectItem>
                                        ))}
                                    </ScrollArea>
                                </SelectContent>
                            </Select>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            {searchTerm ? "No matching available plots found." : "No available plots to assign."}
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleAssign} disabled={!selectedPlotId}>
                        Confirm Assignment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 