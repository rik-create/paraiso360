"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getPaymentById, getClientById, getPlotById } from '@/lib/mockData'; // Assuming these helpers exist
import type { Payment, Client, Plot, BreadcrumbItem } from '@/types/paraiso';
import { ArrowLeft, Printer, Edit3, FileText, User, MapPin } from 'lucide-react';
import { APP_ROUTES, PAYMENT_STATUSES, PAYMENT_TYPES } from '@/lib/constants';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useToast } from "@/components/ui/sonner";

// This would typically be fetched or live in mockData
const getStatusBadgeVariant = (status: Payment['status']) => {
    switch (status) {
        case PAYMENT_STATUSES.PAID: return "success"; // You might need to define this variant in Badge component or Tailwind
        case PAYMENT_STATUSES.PENDING: return "warning";
        case PAYMENT_STATUSES.OVERDUE: return "destructive";
        case PAYMENT_STATUSES.CANCELLED: return "outline";
        default: return "secondary";
    }
};


export default function PaymentDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const toast = useToast();
    const paymentId = params.paymentId as string;

    const [payment, setPayment] = useState<Payment | null | undefined>(undefined); // undefined for loading
    const [client, setClient] = useState<Client | null | undefined>(null);
    const [plot, setPlot] = useState<Plot | null | undefined>(null);

    useEffect(() => {
        if (paymentId) {
            const foundPayment = getPaymentById(paymentId);
            setPayment(foundPayment);

            if (foundPayment) {
                if (foundPayment.clientId) {
                    setClient(getClientById(foundPayment.clientId));
                }
                if (foundPayment.plotId) {
                    setPlot(getPlotById(foundPayment.plotId));
                }
            }
        }
    }, [paymentId]);

    const handlePrintReceipt = () => {
        // Basic browser print
        window.print();
        toast.info("Printing Receipt", { description: "Your browser's print dialog should appear." });
    };

    const handleEditPayment = () => {
        // Navigate to an edit page or open an edit modal
        // For now, just log and show a toast
        console.log("Editing payment:", payment?.id);
        // router.push(`${APP_ROUTES.STAFF_PAYMENTS}/${payment?.id}/edit`); // Example route
        toast.info("Edit Payment", { description: "Navigation to edit page (not yet implemented)." });
    };


    if (payment === undefined) {
        return <PageWrapper title="Loading Payment Details..."><p>Loading...</p></PageWrapper>;
    }

    if (!payment) {
        return <PageWrapper title="Payment Not Found"><p>The requested payment record could not be found.</p></PageWrapper>;
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Dashboard", href: APP_ROUTES.STAFF_DASHBOARD },
        { label: "Payments", href: APP_ROUTES.STAFF_PAYMENTS },
        { label: `Payment OR# ${payment.orNumber}` },
    ];

    const pageActions = (
        <>
            <Button variant="outline" onClick={handlePrintReceipt}>
                <Printer className="mr-2 h-4 w-4" /> Print Receipt
            </Button>
            <Button onClick={handleEditPayment}>
                <Edit3 className="mr-2 h-4 w-4" /> Edit Payment
            </Button>
        </>
    );

    return (
        <PageWrapper
            title={`Payment Details: OR# ${payment.orNumber}`}
            description={`Viewing transaction details for Official Receipt ${payment.orNumber}.`}
            breadcrumbs={breadcrumbs}
            actions={pageActions}
        >
            <div className="max-w-3xl mx-auto">
                <Card className="overflow-hidden">
                    <CardHeader className="bg-muted/30 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                                <CardTitle className="text-2xl">Official Receipt: {payment.orNumber}</CardTitle>
                                <CardDescription>Date of Transaction: {formatDate(payment.paymentDate)}</CardDescription>
                            </div>
                            <Badge
                                // @ts-ignore // Assuming Badge variant can accept these strings for now
                                variant={getStatusBadgeVariant(payment.status)}
                                className="px-3 py-1 text-sm capitalize w-fit"
                            >
                                {payment.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        {/* Client and Plot Information */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {client && (
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground flex items-center"><User className="mr-2 h-4 w-4" />Client Information</h3>
                                    <p className="font-semibold text-foreground">{client.firstName} {client.lastName}</p>
                                    <p className="text-sm text-muted-foreground">{client.email || client.contactNumber}</p>
                                    <Button variant="link" size="sm" asChild className="px-0 h-auto py-0">
                                        <Link href={`${APP_ROUTES.STAFF_CLIENT_DETAIL(client.id)}`}>View Client Profile →</Link>
                                    </Button>
                                </div>
                            )}
                            {plot && (
                                <div className="space-y-1">
                                    <h3 className="text-sm font-medium text-muted-foreground flex items-center"><MapPin className="mr-2 h-4 w-4" />Plot Information</h3>
                                    <p className="font-semibold text-foreground">
                                        {plot.section} - {plot.blockNumber} - {plot.lotNumber} ({plot.type})
                                    </p>
                                    <p className="text-sm text-muted-foreground">Status: {plot.status}</p>
                                    {/* Link to plot details page would be good here */}
                                </div>
                            )}
                        </div>

                        {(client || plot) && <Separator className="my-4" />}

                        {/* Payment Details */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-foreground">Transaction Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Payment Type:</span>
                                    <span className="font-medium text-foreground">{payment.paymentType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Payment Method:</span>
                                    <span className="font-medium text-foreground">{payment.method}</span>
                                </div>
                                <div className="flex justify-between sm:col-span-2 pt-2 mt-2 border-t">
                                    <span className="text-lg font-semibold text-muted-foreground">Amount Paid:</span>
                                    <span className="text-lg font-bold text-primary">{formatCurrency(payment.amount)}</span>
                                </div>
                            </div>
                        </div>

                        {payment.notes && (
                            <>
                                <Separator className="my-4" />
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground flex items-center"><FileText className="mr-2 h-4 w-4" />Notes / Remarks</h3>
                                    <p className="mt-1 text-sm text-foreground whitespace-pre-wrap">{payment.notes}</p>
                                </div>
                            </>
                        )}

                        <Separator className="my-4" />
                        <div className="text-xs text-muted-foreground">
                            <p>Recorded by: {payment.recordedByUsername || 'System'}</p>
                            <p>Payment ID: {payment.id}</p>
                        </div>

                    </CardContent>
                    <CardFooter className="bg-muted/30 p-6 flex justify-end">
                        <Button variant="outline" onClick={() => router.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Payments
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </PageWrapper>
    );
} 