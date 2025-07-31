"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { cn, generateId } from "@/lib/utils";
import type { Payment, Client, Plot, PaymentType, PaymentStatus } from '@/types/paraiso';
import { PAYMENT_TYPES, PAYMENT_STATUSES } from '@/lib/constants';
import { mockClients, mockPlots, mockUsers } from '@/lib/mockData';
import { useToast } from "@/components/ui/sonner";

interface PaymentFormProps {
    payment?: Payment | null;
    initialClientId?: string;
    initialPlotId?: string;
    onSave: (payment: Payment) => void;
    onClose: () => void;
}

const paymentMethods = ["Cash", "Bank Transfer", "Check", "GCash", "Credit Card", "Other"];
const NONE_PLOT_VALUE = "_NONE_";

export function PaymentForm({ payment, initialClientId, initialPlotId, onSave, onClose }: PaymentFormProps) {
    const toast = useToast();

    const [formData, setFormData] = useState<Partial<Payment>>(() => {
        if (payment) {
            return {
                ...payment,
                paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : new Date(),
                amount: payment.amount || 0,
            };
        }
        return {
            clientId: initialClientId || '',
            plotId: initialPlotId || '',
            amount: 0,
            paymentDate: new Date(),
            orNumber: '',
            paymentType: undefined,
            method: undefined,
            status: 'Paid',
            notes: '',
        };
    });
    const [availablePlots, setAvailablePlots] = useState<Plot[]>([]);

    useEffect(() => {
        if (payment) {
            setFormData({
                ...payment,
                paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : new Date(),
                amount: payment.amount || 0,
            });
        } else {
            setFormData({
                clientId: initialClientId || '',
                plotId: initialPlotId || '',
                amount: 0,
                paymentDate: new Date(),
                orNumber: '',
                paymentType: undefined,
                method: undefined,
                status: 'Paid',
                notes: '',
            });
        }
    }, [payment, initialClientId, initialPlotId]);

    useEffect(() => {
        const currentClientId = formData.clientId || initialClientId;
        if (currentClientId) {
            const clientOwnedPlots = mockPlots.filter(p => p.ownerClientId === currentClientId);
            let plotsForSelect = clientOwnedPlots;
            if (initialPlotId && !clientOwnedPlots.find(p => p.id === initialPlotId)) {
                const specificPlot = mockPlots.find(p => p.id === initialPlotId);
                if (specificPlot) plotsForSelect.push(specificPlot);
            }
            if (!initialClientId) {
                const generallyAvailablePlots = mockPlots.filter(p => p.status === "Available" && !p.ownerClientId);
                plotsForSelect = [...new Set([...plotsForSelect, ...generallyAvailablePlots])];
            }

            const uniquePlotIds = new Set();
            const uniquePlots = plotsForSelect.filter(plot => {
                if (!uniquePlotIds.has(plot.id)) {
                    uniquePlotIds.add(plot.id);
                    return true;
                }
                return false;
            });
            setAvailablePlots(uniquePlots);
        } else {
            setAvailablePlots(mockPlots.filter(p => p.status === "Available" || !p.ownerClientId));
        }
    }, [formData.clientId, initialClientId, initialPlotId, mockPlots]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) || 0 : value }));
    };

    const handleSelectChange = (name: keyof Payment, value: string) => {
        if (name === 'plotId') {
            setFormData(prev => ({ ...prev, plotId: value === NONE_PLOT_VALUE ? '' : value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (name === 'clientId') {
            const selectedClientPlots = mockPlots.filter(p => p.ownerClientId === value || p.status === "Available");
            if (!value || (formData.plotId && !selectedClientPlots.find(p => p.id === formData.plotId))) {
                setFormData(prev => ({ ...prev, plotId: '' }));
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const currentClientId = initialClientId || formData.clientId;
        if (!currentClientId) {
            toast.error("Client Not Selected", { description: "Please select a client." });
            return;
        }
        if (!formData.paymentType) {
            toast.error("Payment Type Missing", { description: "Please select a payment type." });
            return;
        }
        if (!formData.method) {
            toast.error("Payment Method Missing", { description: "Please select a payment method." });
            return;
        }
        if (!formData.orNumber) {
            toast.error("OR Number Missing", { description: "Please enter an OR Number." });
            return;
        }
        if (!formData.amount || formData.amount <= 0) {
            toast.error("Invalid Amount", { description: "Amount must be greater than zero." });
            return;
        }

        const client = mockClients.find(c => c.id === currentClientId);
        const plot = formData.plotId ? mockPlots.find(p => p.id === formData.plotId) : undefined;
        const currentUser = mockUsers[0];

        const finalPayment: Payment = {
            id: payment?.id || generateId('pay'),
            clientId: currentClientId!,
            clientName: client ? `${client.firstName} ${client.lastName}` : 'N/A',
            plotId: formData.plotId || undefined,
            plotIdentifier: plot ? `${plot.section}-${plot.blockNumber}-${plot.lotNumber}` : undefined,
            amount: formData.amount!,
            paymentDate: formData.paymentDate!,
            orNumber: formData.orNumber!,
            paymentType: formData.paymentType! as PaymentType,
            method: formData.method!,
            status: formData.status! as PaymentStatus,
            notes: formData.notes,
            recordedByUserId: currentUser.id,
            recordedByUsername: currentUser.username,
        };
        onSave(finalPayment);
        toast.success(payment ? "Payment Updated" : "Payment Recorded", { description: `OR# ${finalPayment.orNumber} has been saved.` });
        onClose();
    };

    const selectClassName = "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="clientId">Client <span className="text-red-500">*</span></Label>
                    <Select
                        name="clientId"
                        value={initialClientId || formData.clientId}
                        onValueChange={(value) => handleSelectChange('clientId', value)}
                        required
                        disabled={!!initialClientId}
                    >
                        <SelectTrigger id="clientId" className={selectClassName.replace("flex h-9", "h-9").replace("bg-transparent", "")}>
                            <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                            {(initialClientId ? mockClients.filter(c => c.id === initialClientId) : mockClients).map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                    {client.firstName} {client.lastName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="plotId">Associated Plot (Optional)</Label>
                    <Select name="plotId" value={formData.plotId} onValueChange={(value) => handleSelectChange('plotId', value)} disabled={availablePlots.length === 0}>
                        <SelectTrigger id="plotId" className={selectClassName.replace("flex h-9", "h-9").replace("bg-transparent", "")}>
                            <SelectValue placeholder="Select a plot (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={NONE_PLOT_VALUE}>None</SelectItem>
                            {availablePlots.map((plot) => (
                                <SelectItem key={plot.id} value={plot.id}>
                                    {plot.section}-{plot.blockNumber}-{plot.lotNumber} ({plot.type})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="amount">Amount <span className="text-red-500">*</span></Label>
                    <Input
                        id="amount"
                        name="amount"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount || ''}
                        onChange={handleChange}
                        min="0.01"
                        step="0.01"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="paymentDate">Payment Date <span className="text-red-500">*</span></Label>
                    <DatePicker
                        id="paymentDate"
                        date={formData.paymentDate ? new Date(formData.paymentDate) : undefined}
                        onDateChange={(date) => setFormData(prev => ({ ...prev, paymentDate: date }))}
                        buttonClassName={selectClassName}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="orNumber">OR Number <span className="text-red-500">*</span></Label>
                    <Input
                        id="orNumber"
                        name="orNumber"
                        type="text"
                        placeholder="e.g., OR123456"
                        value={formData.orNumber}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="paymentType">Payment Type <span className="text-red-500">*</span></Label>
                    <Select name="paymentType" value={formData.paymentType} onValueChange={(value) => handleSelectChange('paymentType', value)} required>
                        <SelectTrigger id="paymentType" className={selectClassName.replace("flex h-9", "h-9").replace("bg-transparent", "")}>
                            <SelectValue placeholder="Select payment type" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(PAYMENT_TYPES).map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="method">Payment Method <span className="text-red-500">*</span></Label>
                    <Select name="method" value={formData.method} onValueChange={(value) => handleSelectChange('method', value)} required>
                        <SelectTrigger id="method" className={selectClassName.replace("flex h-9", "h-9").replace("bg-transparent", "")}>
                            <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                            {paymentMethods.map((method) => (
                                <SelectItem key={method} value={method}>{method}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                    <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)} required>
                        <SelectTrigger id="status" className={selectClassName.replace("flex h-9", "h-9").replace("bg-transparent", "")}>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(PAYMENT_STATUSES).map((status) => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Any additional notes about this payment..."
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit">{payment ? 'Update Payment' : 'Record Payment'}</Button>
            </div>
        </form>
    );
} 