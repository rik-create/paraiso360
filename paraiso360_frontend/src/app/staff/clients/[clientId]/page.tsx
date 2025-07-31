"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ClientForm } from '@/components/modules/clients/ClientForm';
import { Toaster } from "@/components/ui/sonner";
import { Pencil, UserCircle, MapPin, CreditCard, FileText as FileTextIcon, PlusCircle, ArrowLeft, Link2, UploadCloud } from 'lucide-react';
import Link from 'next/link';

import {
    mockClients,
    mockPlots as globalMockPlots,
    mockPayments,
    mockDocuments,
    getClientById,
    getPaymentsByClientId,
    getDocumentsByClientId,
} from '@/lib/mockData';
import type { Client, Plot, Payment, DocumentRecord, BreadcrumbItem } from '@/types/paraiso';
import { formatDate, formatCurrency } from '@/lib/utils';
import { APP_ROUTES, PLOT_STATUSES } from '@/lib/constants';
import { AssignPlotDialog } from '@/components/modules/clients/AssignPlotDialog';
import { useToast } from "@/components/ui/sonner";
import { PaymentForm } from '@/components/modules/payments/PaymentForm';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { DocumentUploadForm } from '@/components/modules/documents/DocumentUploadForm';

const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

export default function ClientProfilePage() {
    const router = useRouter();
    const params = useParams();
    const clientId = params.clientId as string;
    const toast = useToast();

    const [client, setClient] = useState<Client | null | undefined>(undefined);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [allPlots, setAllPlots] = useState<Plot[]>(globalMockPlots);
    const [clientPlots, setClientPlots] = useState<Plot[]>([]);
    const [isAssignPlotDialogOpen, setIsAssignPlotDialogOpen] = useState(false);
    const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
    const [isDocumentUploadDialogOpen, setIsDocumentUploadDialogOpen] = useState(false);
    const [editingDocument, setEditingDocument] = useState<DocumentRecord | null>(null);

    const refreshClientData = useCallback(() => {
        if (clientId) {
            const foundClient = getClientById(clientId);
            setClient(foundClient);

            if (foundClient) {
                const updatedClientPlots = allPlots.filter(plot =>
                    foundClient.associatedPlotIds.includes(plot.id)
                );
                setClientPlots(updatedClientPlots);
            } else {
                setClientPlots([]);
            }
        }
    }, [clientId, allPlots]);

    useEffect(() => {
        refreshClientData();
    }, [refreshClientData]);

    const handleClientSave = (updatedClientData: Client) => {
        console.log("Profile Page: Client Saved", updatedClientData);
        const clientIndex = mockClients.findIndex(c => c.id === updatedClientData.id);
        if (clientIndex > -1) {
            mockClients[clientIndex] = updatedClientData;
        } else {
            mockClients.push(updatedClientData);
        }
        setClient(updatedClientData);
        setIsEditModalOpen(false);
        toast("Client Updated Successfully");
    };

    const handleAssignPlot = (assignedClientId: string, plotIdToAssign: string) => {
        const updatedAllPlots = allPlots.map(p =>
            p.id === plotIdToAssign
                ? { ...p, status: PLOT_STATUSES.RESERVED, ownerClientId: assignedClientId, reservationDate: new Date() }
                : p
        );
        setAllPlots(updatedAllPlots);

        const clientIndex = mockClients.findIndex(c => c.id === assignedClientId);
        if (clientIndex > -1) {
            const updatedAssociatedPlotIds = [...mockClients[clientIndex].associatedPlotIds, plotIdToAssign];
            mockClients[clientIndex] = {
                ...mockClients[clientIndex],
                associatedPlotIds: updatedAssociatedPlotIds,
            };
            setClient(prevClient => {
                if (!prevClient || prevClient.id !== assignedClientId) return prevClient;
                return {
                    ...prevClient,
                    associatedPlotIds: updatedAssociatedPlotIds
                };
            });
        }
        if (client && client.id === assignedClientId) {
            const newlyUpdatedClient = getClientById(assignedClientId);
            if (newlyUpdatedClient) {
                const updatedClientPlotsView = updatedAllPlots.filter(plot =>
                    newlyUpdatedClient.associatedPlotIds.includes(plot.id)
                );
                setClientPlots(updatedClientPlotsView);
            }
        }

        toast("Plot Assigned Successfully!");
        setIsAssignPlotDialogOpen(false);
    };

    const handleOpenNewPaymentForm = () => {
        setEditingPayment(null);
        setIsPaymentFormOpen(true);
    };

    const handleSaveNewPayment = (paymentData: Payment) => {
        mockPayments.push(paymentData);
        toast.success("Payment Recorded", {
            description: `OR# ${paymentData.orNumber} for ${paymentData.clientName} has been recorded.`
        });
        setIsPaymentFormOpen(false);
    };

    const handleOpenNewDocumentDialog = () => {
        setEditingDocument(null);
        setIsDocumentUploadDialogOpen(true);
    };

    const handleSaveNewDocument = (formData: FormData) => {
        const file = formData.get('file') as File | null;
        if (!file && !editingDocument) {
            toast.error("File Missing", { description: "Please select a file to upload for the new document." });
            return;
        }

        const newDocId = `doc_${Date.now()}`;
        const fileName = formData.get('fileName') as string || (file ? file.name : 'Untitled');
        const fileType = file ? file.type : (editingDocument?.fileType || 'application/octet-stream');

        const newDocument: DocumentRecord = {
            id: editingDocument?.id || newDocId,
            fileName: fileName,
            fileType: fileType,
            filePath: file ? `/documents/clients/${client?.id || 'unknown'}/${file.name}` : (editingDocument?.filePath || ''),
            uploadDate: new Date(),
            uploadedByUserId: 'staff01',
            uploadedByUsername: 'staff01',
            clientId: client?.id,
            plotId: undefined,
            description: formData.get('description') as string || undefined,
            tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean),
        };

        if (editingDocument) {
            const docIndex = mockDocuments.findIndex(d => d.id === editingDocument.id);
            if (docIndex > -1) {
                mockDocuments[docIndex] = newDocument;
            }
            toast.success("Document Updated", { description: `${newDocument.fileName} has been updated.` });
        } else {
            mockDocuments.push(newDocument);
            toast.success("Document Uploaded", { description: `${newDocument.fileName} has been uploaded for ${client?.firstName}.` });
        }

        if (client) {
            const updatedClientDocs = mockDocuments.filter(doc => doc.clientId === client.id);
        }

        setIsDocumentUploadDialogOpen(false);
        setEditingDocument(null);
    };

    if (client === undefined) {
        return (
            <PageWrapper title="Loading Client Profile...">
                <div className="flex justify-center items-center h-64">
                    <p>Loading...</p>
                </div>
            </PageWrapper>
        );
    }

    if (!client) {
        return (
            <PageWrapper title="Client Not Found">
                <Card>
                    <CardContent className="pt-6">
                        <p>The client with ID "{clientId}" could not be found.</p>
                        <Button onClick={() => router.back()} className="mt-4" variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                        </Button>
                    </CardContent>
                </Card>
            </PageWrapper>
        );
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Dashboard", href: APP_ROUTES.STAFF_DASHBOARD },
        { label: "Clients", href: APP_ROUTES.STAFF_CLIENTS },
        { label: `${client.firstName} ${client.lastName}` },
    ];

    const paymentHistory = mockPayments.filter(payment => payment.clientId === client.id);
    const associatedDocuments = mockDocuments.filter(doc => doc.clientId === client.id);

    const safeFormatCurrency = (amount: number) => {
        return typeof formatCurrency === 'function' ? formatCurrency(amount) : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
    };

    return (
        <PageWrapper
            title={`${client.firstName} ${client.lastName}`}
            description={`Manage details, plots, payments, and documents for ${client.email || client.contactNumber}.`}
            breadcrumbs={breadcrumbs}
            actions={
                <>
                    <Button variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
                    </Button>
                    <ClientForm
                        client={client}
                        open={isEditModalOpen}
                        onOpenChange={setIsEditModalOpen}
                        onSave={handleClientSave}
                        trigger={
                            <Button variant="default">
                                <Pencil className="mr-2 h-4 w-4" /> Edit Client
                            </Button>
                        }
                    />
                </>
            }
        >
            <Toaster />
            <Tabs defaultValue="personal-info" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
                    <TabsTrigger value="personal-info"><UserCircle className="mr-2 h-4 w-4" />Personal Info</TabsTrigger>
                    <TabsTrigger value="associated-plots"><MapPin className="mr-2 h-4 w-4" />Associated Plots ({clientPlots.length})</TabsTrigger>
                    <TabsTrigger value="payment-history"><CreditCard className="mr-2 h-4 w-4" />Payment History ({paymentHistory.length})</TabsTrigger>
                    <TabsTrigger value="documents"><FileTextIcon className="mr-2 h-4 w-4" />Documents ({associatedDocuments.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="personal-info">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-2xl">{getInitials(client.firstName, client.lastName)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-2xl">{client.firstName} {client.lastName}</CardTitle>
                                    <CardDescription>Client ID: {client.id}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                <div><strong>Contact Number:</strong> {client.contactNumber}</div>
                                <div><strong>Alt. Contact:</strong> {client.alternativeContactNumber || 'N/A'}</div>
                                <div><strong>Email:</strong> {client.email || 'N/A'}</div>
                                <div><strong>Registration Date:</strong> {formatDate(client.registrationDate)}</div>
                                <div className="md:col-span-2"><strong>Address:</strong> {client.address}</div>
                                {client.notes && <div className="md:col-span-2"><strong>Notes:</strong> <p className="whitespace-pre-wrap text-muted-foreground">{client.notes}</p></div>}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="associated-plots">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Associated Plots</CardTitle>
                                <CardDescription>Plots owned or reserved by this client.</CardDescription>
                            </div>
                            <Button size="sm" onClick={() => setIsAssignPlotDialogOpen(true)}>
                                <Link2 className="mr-2 h-4 w-4" /> Assign New Plot
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {clientPlots.length > 0 ? (
                                <ul className="space-y-3">
                                    {clientPlots.map(plot => (
                                        <li key={plot.id} className="p-3 border rounded-md hover:shadow-sm transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold">{plot.section}-{plot.blockNumber}-{plot.lotNumber} <span className="text-xs text-muted-foreground">({plot.type})</span></p>
                                                    <p className="text-sm">Status: <span className={`font-medium ${plot.status === PLOT_STATUSES.OCCUPIED ? 'text-red-600' : plot.status === PLOT_STATUSES.RESERVED ? 'text-yellow-600' : 'text-green-600'}`}>{plot.status}</span></p>
                                                    {plot.reservationDate && plot.status === PLOT_STATUSES.RESERVED && (
                                                        <p className="text-xs text-muted-foreground">Reserved On: {new Date(plot.reservationDate).toLocaleDateString()}</p>
                                                    )}
                                                </div>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/staff/lots/map?plotId=${plot.id}`}>View on Map</Link>
                                                </Button>
                                            </div>
                                            {plot.notes && <p className="text-xs mt-1 text-muted-foreground">Notes: {plot.notes}</p>}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center py-4 text-muted-foreground">No plots currently associated with this client.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payment-history">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Payment History</CardTitle>
                                <CardDescription>Record of payments made by this client.</CardDescription>
                            </div>
                            <Button size="sm" onClick={handleOpenNewPaymentForm}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Record New Payment
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {paymentHistory.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>OR Number</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Plot ID</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paymentHistory.map((payment) => (
                                            <TableRow key={payment.id}>
                                                <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                                                <TableCell>{payment.orNumber}</TableCell>
                                                <TableCell>{safeFormatCurrency(payment.amount)}</TableCell>
                                                <TableCell>{payment.paymentType}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${payment.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                        payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            payment.status === 'Overdue' ? 'bg-orange-100 text-orange-700' :
                                                                payment.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                        }`}>{payment.status}</span>
                                                </TableCell>
                                                <TableCell>{payment.plotId || 'N/A'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : <p className="text-center py-4 text-muted-foreground">No payment history found.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="documents">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Associated Documents</CardTitle>
                                <CardDescription>Files and documents related to this client.</CardDescription>
                            </div>
                            <Button size="sm" onClick={handleOpenNewDocumentDialog}>
                                <UploadCloud className="mr-2 h-4 w-4" /> Upload New Document
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {associatedDocuments.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>File Name</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Upload Date</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {associatedDocuments.map((doc) => (
                                            <TableRow key={doc.id}>
                                                <TableCell className="font-medium">{doc.fileName}</TableCell>
                                                <TableCell>{doc.fileType}</TableCell>
                                                <TableCell>{formatDate(doc.uploadDate)}</TableCell>
                                                <TableCell>
                                                    <Button variant="outline" size="sm">View</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : <p className="text-center py-4 text-muted-foreground">No documents found.</p>}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {client && (
                <AssignPlotDialog
                    client={client}
                    currentAssignedPlotIds={client.associatedPlotIds}
                    onAssignPlot={handleAssignPlot}
                    open={isAssignPlotDialogOpen}
                    onOpenChange={setIsAssignPlotDialogOpen}
                />
            )}

            {client && (
                <Dialog open={isPaymentFormOpen} onOpenChange={setIsPaymentFormOpen}>
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                            <DialogTitle>Record New Payment for {client.firstName} {client.lastName}</DialogTitle>
                            <DialogDescription>
                                Fill in the details for the new payment transaction.
                            </DialogDescription>
                        </DialogHeader>
                        <PaymentForm
                            initialClientId={client.id}
                            onSave={handleSaveNewPayment}
                            onClose={() => setIsPaymentFormOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            )}

            {client && (
                <Dialog open={isDocumentUploadDialogOpen} onOpenChange={(isOpen) => {
                    setIsDocumentUploadDialogOpen(isOpen);
                    if (!isOpen) setEditingDocument(null);
                }}>
                    <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                            <DialogTitle>{editingDocument ? 'Edit Document' : 'Upload New Document for ' + client.firstName}</DialogTitle>
                            <DialogDescription>
                                {editingDocument
                                    ? `Update details for ${editingDocument.fileName}`
                                    : `Select a file to upload for ${client.firstName} ${client.lastName}.`}
                            </DialogDescription>
                        </DialogHeader>
                        <DocumentUploadForm
                            document={editingDocument}
                            onSave={handleSaveNewDocument}
                            onCancel={() => {
                                setIsDocumentUploadDialogOpen(false);
                                setEditingDocument(null);
                            }}
                        />
                    </DialogContent>
                </Dialog>
            )}
        </PageWrapper>
    );
} 