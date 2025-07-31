import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Plot, Client } from '@/types/paraiso';
import { mockClients } from '@/lib/mockData';
import { toast } from "sonner";

interface EditPlotFormProps {
    plot: Plot;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSave: (updatedPlot: Plot) => void;
}

// TODO: Get these from a central place if they grow, e.g., constants.ts
const PLOT_TYPES = ['Lawn Lot', 'Garden Lot', 'Mausoleum Niche', 'Columbarium Unit', 'Ossuary Niche'];
const PLOT_STATUSES = ['Available', 'Reserved', 'Occupied', 'Unavailable', 'Under Maintenance'];


export function EditPlotForm({ plot, isOpen, onOpenChange, onSave }: EditPlotFormProps) {
    const [formData, setFormData] = useState<Plot>(plot);
    const [allClients, setAllClients] = useState<Client[]>([]);

    useEffect(() => {
        setFormData(plot);
        // Ensure mockClients are loaded on the client-side
        setAllClients(mockClients);
    }, [plot]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'capacity' ? parseInt(value, 10) || 0 : value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            // Business Rule: If status changes to "Available", clear owner and reservation date
            if (name === 'status' && value === 'Available') {
                newState.ownerClientId = undefined;
                newState.reservationDate = undefined;
            }
            // Business Rule: If status is not "Reserved" or "Occupied", clear owner
            if (name === 'status' && value !== 'Reserved' && value !== 'Occupied') {
                 newState.ownerClientId = undefined;
            }
            // Business Rule: If status is not "Reserved", clear reservation date
            if (name === 'status' && value !== 'Reserved') {
                 newState.reservationDate = undefined;
            }
            return newState;
        });
    };

    const handleDateChange = (name: string, date?: Date) => {
        setFormData(prev => ({ ...prev, [name]: date }));
    };

    const handleSubmit = () => {
        // Basic Validation
        if (!formData.type || !formData.status || !formData.capacity) {
            toast.error("Validation Error", { description: "Plot Type, Status, and Capacity are required." });
            return;
        }
        if (formData.capacity <= 0) {
            toast.error("Validation Error", { description: "Capacity must be a positive number." });
            return;
        }
        // Ownership Logic
        if ((formData.status === 'Reserved' || formData.status === 'Occupied') && !formData.ownerClientId) {
            toast.error("Validation Error", { description: `An owner must be assigned for plots with status '${formData.status}'.` });
            return;
        }
        if (formData.status === 'Reserved' && !formData.reservationDate) {
            toast.error("Validation Error", { description: "Reservation Date is required for reserved plots." });
            return;
        }

        onSave(formData);
        onOpenChange(false); // Close modal on successful save
        toast.success("Plot Details Updated", { description: `Plot ${formData.id} has been successfully updated.` });
    };

    const handleCancel = () => {
        onOpenChange(false);
        setFormData(plot); // Reset form to initial plot data
    };

    if (!plot) return null; // Should not happen if isOpen is true with a plot

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Plot Details: {plot.id}</DialogTitle>
                    <DialogDescription>
                        Modify the details of the plot. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Plot Information - Read Only */}
                    <div className="font-semibold text-sm mb-2">Plot Identifiers (Read-Only)</div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="plotId" className="text-right">Plot ID</Label>
                        <Input id="plotId" name="plotId" value={formData.id} readOnly className="col-span-3 bg-slate-50" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="section" className="text-right">Section</Label>
                        <Input id="section" name="section" value={formData.section} readOnly className="col-span-3 bg-slate-50" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="blockNumber" className="text-right">Block</Label>
                        <Input id="blockNumber" name="blockNumber" value={formData.blockNumber} readOnly className="col-span-3 bg-slate-50" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="lotNumber" className="text-right">Lot #</Label>
                        <Input id="lotNumber" name="lotNumber" value={formData.lotNumber} readOnly className="col-span-3 bg-slate-50" />
                    </div>

                    {/* Plot Information - Editable */}
                    <div className="font-semibold text-sm mt-4 mb-2">Plot Details</div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type*</Label>
                        <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select plot type" />
                            </SelectTrigger>
                            <SelectContent>
                                {PLOT_TYPES.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dimensions" className="text-right">Dimensions</Label>
                        <Input id="dimensions" name="dimensions" value={formData.dimensions || ''} onChange={handleChange} className="col-span-3" placeholder="e.g., 2.5m x 2.5m"/>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="capacity" className="text-right">Capacity*</Label>
                        <Input id="capacity" name="capacity" type="number" value={formData.capacity} onChange={handleChange} className="col-span-3" placeholder="e.g., 4"/>
                    </div>

                    {/* Status & Ownership */}
                    <div className="font-semibold text-sm mt-4 mb-2">Status & Ownership</div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Status*</Label>
                        <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {PLOT_STATUSES.map(status => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ownerClientId" className="text-right">Owner</Label>
                        <Select
                            name="ownerClientId"
                            value={formData.ownerClientId || ''}
                            onValueChange={(value) => handleSelectChange('ownerClientId', value === 'none' ? '' : value)}
                            disabled={formData.status === 'Available' || (formData.status !== 'Reserved' && formData.status !== 'Occupied')}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Search/Select Client" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">-- No Owner --</SelectItem>
                                {allClients.map(client => (
                                    <SelectItem key={client.id} value={client.id}>
                                        {client.firstName} {client.lastName} ({client.id.substring(0,8)}...)
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {formData.status === 'Reserved' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="reservationDate" className="text-right">Reservation Date*</Label>
                            <DatePicker
                                date={formData.reservationDate ? new Date(formData.reservationDate) : undefined}
                                onDateChange={(date) => handleDateChange('reservationDate', date)}
                                className="col-span-3"
                            />
                        </div>
                    )}
                     {/* Notes */}
                    <div className="font-semibold text-sm mt-4 mb-2">Notes</div>
                    <div className="grid grid-cols-1 gap-2"> {/* Changed to grid-cols-1 for full width textarea */}
                        <Textarea
                            id="notes"
                            name="notes"
                            value={formData.notes || ''}
                            onChange={handleChange}
                            placeholder="Enter any relevant notes for this plot..."
                            rows={3}
                            className="col-span-full" // Ensure it takes full width if inside a grid context that might constrain it
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}