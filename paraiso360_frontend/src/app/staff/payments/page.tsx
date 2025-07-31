"use client";

import React, { useState, useMemo } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper'; // Assuming this is a local layout component
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

import { Card, CardContent } from "@/components/ui/card";

import { MoreHorizontal, PlusCircle, Search, Filter, Edit2, Trash2, Eye } from "lucide-react";
import { PaymentForm } from '@/components/modules/payments/PaymentForm';
import type { Payment, BreadcrumbItem } from '@/types/paraiso';
import { mockPayments as initialMockPayments } from '@/lib/mockData';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useToast } from "@/components/ui/sonner";
import { ConfirmationDialog } from '@/components/modules/shared/ConfirmationDialog';
import { APP_ROUTES } from '@/lib/constants';

export default function PaymentLedgerPage() {
    const toast = useToast();
    const [payments, setPayments] = useState<Payment[]>(initialMockPayments);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
    const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);

    const filteredPayments = useMemo(() => {
        return payments.filter(payment =>
            (payment.clientName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            payment.orNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (payment.plotIdentifier?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );
    }, [payments, searchTerm]);

    const handleSavePayment = (paymentData: Payment) => {
        if (editingPayment) {
            setPayments(prev => prev.map(p => p.id === paymentData.id ? paymentData : p));
            toast.success("Payment Updated", { description: `OR# ${paymentData.orNumber} has been updated.` });
        } else {
            setPayments(prev => [paymentData, ...prev]);
            toast.success("Payment Recorded", { description: `OR# ${paymentData.orNumber} has been recorded.` });
        }
        setEditingPayment(null);
        setIsFormModalOpen(false);
    };

    const handleAddNewPayment = () => {
        setEditingPayment(null);
        setIsFormModalOpen(true);
    };

    const handleEditPayment = (payment: Payment) => {
        setEditingPayment(payment);
        setIsFormModalOpen(true);
    };

    const handleDeletePayment = (payment: Payment) => {
        setPaymentToDelete(payment);
        setIsConfirmDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (paymentToDelete) {
            setPayments(prev => prev.filter(p => p.id !== paymentToDelete!.id));
            toast.error("Payment Deleted", { description: `OR# ${paymentToDelete.orNumber} has been deleted.` });
            setPaymentToDelete(null);
        }
        setIsConfirmDeleteDialogOpen(false);
    };

    const handleViewPaymentDetails = (payment: Payment) => {
        console.log("View details for payment:", payment);
        toast.info("View Details", { description: `Viewing details for OR# ${payment.orNumber}. (Implement details view)` });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Dashboard", href: APP_ROUTES.STAFF_DASHBOARD },
        { label: "Payments" },
    ];

    return (
        <PageWrapper
            title="Payment Ledger"
            breadcrumbs={breadcrumbs}
            actions={(
                <Button onClick={handleAddNewPayment}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Record New Payment
                </Button>
            )}
        >
            <div className="mb-4 flex flex-col sm:flex-row gap-2 items-center justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by Client, OR#, Plot..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-full"
                    />
                </div>
                <Button variant="outline" onClick={() => alert('Filter functionality to be implemented.')}>
                    <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>OR Number</TableHead>
                            <TableHead>Payment Date</TableHead>
                            <TableHead>Client Name</TableHead>
                            <TableHead>Plot</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPayments.length > 0 ? (
                            filteredPayments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-medium">{payment.orNumber}</TableCell>
                                    <TableCell>{formatDate(new Date(payment.paymentDate))}</TableCell>
                                    <TableCell>{payment.clientName || 'N/A'}</TableCell>
                                    <TableCell>{payment.plotIdentifier || 'N/A'}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(payment.amount)}</TableCell>
                                    <TableCell>{payment.paymentType}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${payment.status === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                            payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                payment.status === 'Cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                    payment.status === 'Overdue' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : // Added Overdue color
                                                        payment.status === 'Refunded' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : // Added Refunded color
                                                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                            }`}>
                                            {payment.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleViewPaymentDetails(payment)}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleEditPayment(payment)}>
                                                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleDeletePayment(payment)} className="text-red-600 dark:text-red-400 hover:!text-red-600 dark:hover:!text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    No payments found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>

            <Dialog
                open={isFormModalOpen}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setIsFormModalOpen(false);
                        setEditingPayment(null);
                    } else {
                        setIsFormModalOpen(true);
                    }
                }}
            >
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingPayment ? 'Edit Payment Record' : 'Record New Payment'}
                        </DialogTitle>
                    </DialogHeader>
                    <PaymentForm
                        payment={editingPayment}
                        onSave={handleSavePayment}
                        onClose={() => {
                            setIsFormModalOpen(false);
                            setEditingPayment(null);
                        }}
                    />
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                isOpen={isConfirmDeleteDialogOpen}
                onClose={() => setIsConfirmDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Payment"
                description={`Are you sure you want to delete the payment with OR# ${paymentToDelete?.orNumber}? This action cannot be undone.`}
            />

        </PageWrapper>
    );
} 