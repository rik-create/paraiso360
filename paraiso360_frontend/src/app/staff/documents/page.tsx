"use client";
import React, { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import { DocumentTable } from '@/components/modules/documents/DocumentTable'; // To be created
import { mockDocuments } from '@/lib/mockData'; // Import your mock data
import type { DocumentRecord, BreadcrumbItem } from '@/types/paraiso';
import { UploadCloud, PlusCircle } from 'lucide-react';
import { APP_ROUTES } from '@/lib/constants';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/sonner"; // For notifications
import { DocumentUploadForm } from '@/components/modules/documents/DocumentUploadForm';

// Re-using the DocumentForm from DocumentTable.tsx for simplicity in this example
// In a larger app, DocumentForm would be its own component in src/components/modules/documents/
// For brevity, I'll assume DocumentForm is accessible or re-defined here if not imported from DocumentTable directly.

// Let's assume DocumentForm is defined as it was in DocumentTable.tsx or imported.
// If DocumentForm is inside DocumentTable.tsx and not exported, you'd need to extract it or redefine it.
// For this example, let's assume we can use a placeholder for the form structure.

export default function DocumentRepositoryPage() {
    const [documents, setDocuments] = useState<DocumentRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [editingDocument, setEditingDocument] = useState<DocumentRecord | null>(null); // For editing metadata

    const toast = useToast();

    useEffect(() => {
        // Simulate fetching documents
        setIsLoading(true);
        // In a real app, you'd fetch this from an API
        // For now, add denormalized data to mockDocuments for display if not already there
        const processedMockDocuments = mockDocuments.map(doc => ({
            ...doc,
            // Assuming mockUsers, mockClients, mockPlots are available from mockData.ts
            // These should ideally be part of your mockDocuments structure or fetched/joined in a real backend call
            uploadedByUsername: doc.uploadedByUsername || 'Unknown User', // Use existing or default
            clientName: doc.clientName || undefined, // Use existing or default
            plotIdentifier: doc.plotIdentifier || undefined, // Use existing or default
        }));
        setDocuments(processedMockDocuments);
        setIsLoading(false);
    }, []);

    const handleViewDocument = (doc: DocumentRecord) => {
        console.log("Viewing document:", doc.fileName);
        // In a real app, this might open a new tab to doc.filePath or a preview modal
        window.open(doc.filePath, '_blank'); // Simple placeholder action
        toast.info("Previewing Document", { description: `Opening ${doc.fileName}...` });
    };

    const handleDownloadDocument = (doc: DocumentRecord) => {
        console.log("Downloading document:", doc.fileName);
        // Simulate download
        const link = document.createElement('a');
        link.href = doc.filePath; // In a real app, this might be a signed URL
        link.setAttribute('download', doc.fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.info("Download Started", { description: `${doc.fileName} is downloading.` });
    };

    const handleOpenEditModal = (doc: DocumentRecord) => {
        setEditingDocument(doc);
        setIsUploadModalOpen(true); // Re-use the same modal for editing metadata
    };

    const handleDeleteDocument = (docId: string) => {
        console.log("Deleting document ID:", docId);
        // Simulate deletion
        setDocuments(prevDocs => prevDocs.filter(d => d.id !== docId));
        toast.error("Document Deleted", {
            description: `The document has been successfully deleted.`
        });
    };

    const handleSaveDocument = (formData: FormData) => {
        // Simulate upload/update
        const file = formData.get('file') as File | null;
        const id = formData.get('id') as string | undefined;

        if (id && editingDocument) { // Editing existing document metadata
            const updatedDoc: DocumentRecord = {
                ...editingDocument,
                fileName: formData.get('fileName') as string || editingDocument.fileName,
                description: formData.get('description') as string || undefined,
                tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean),
                // If file is also being replaced
                ...(file && {
                    filePath: `/documents/updated_${file.name}`, // mock path
                    fileType: file.type,
                    fileName: file.name // Overwrite fileName if new file is uploaded
                }),
            };
            setDocuments(docs => docs.map(d => d.id === id ? updatedDoc : d));
            toast.success("Metadata Updated", { description: `${updatedDoc.fileName} metadata saved.` });
        } else if (file) { // Uploading new document
            const newDoc: DocumentRecord = {
                id: `doc_${Date.now()}`, // Simple unique ID for mock
                fileName: formData.get('fileName') as string || file.name,
                fileType: file.type,
                filePath: `/documents/uploaded_${file.name}`, // Mock path
                uploadDate: new Date(),
                uploadedByUserId: 'staff01', // Mock current user
                uploadedByUsername: 'staff01', // Mock username, ensure this matches a user in mockUsers if you have one
                description: formData.get('description') as string || undefined,
                tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean),
                // You might want to add clientId and plotId here if your form collects them
            };
            setDocuments(prevDocs => [newDoc, ...prevDocs]);
            toast.success("Document Uploaded", { description: `${newDoc.fileName} has been successfully uploaded.` });
        }
        setIsUploadModalOpen(false);
        setEditingDocument(null);
    };

    // Define breadcrumbs here
    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Dashboard", href: APP_ROUTES.STAFF_DASHBOARD },
        { label: "Document Repository" }, // Current page
    ];

    const pageActions = (
        <Dialog open={isUploadModalOpen} onOpenChange={(isOpen) => {
            setIsUploadModalOpen(isOpen);
            if (!isOpen) setEditingDocument(null); // Reset editing state when modal closes
        }}>
            <DialogTrigger asChild>
                <Button>
                    <UploadCloud className="mr-2 h-4 w-4" /> Upload New Document
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{editingDocument ? 'Edit Document Metadata' : 'Upload New Document'}</DialogTitle>
                    <DialogDescription>
                        {editingDocument
                            ? `Update the details for "${editingDocument.fileName}".`
                            : "Select a file and provide its details to upload it to the repository."}
                    </DialogDescription>
                </DialogHeader>
                <DocumentUploadForm
                    key={editingDocument ? editingDocument.id : 'new'}
                    document={editingDocument}
                    onSave={handleSaveDocument}
                    onCancel={() => { setIsUploadModalOpen(false); setEditingDocument(null); }}
                />
            </DialogContent>
        </Dialog>
    );

    if (isLoading) {
        // Pass breadcrumbs even to loading state for consistency
        return <PageWrapper title="Loading Documents..." breadcrumbs={breadcrumbs}><p>Fetching document list...</p></PageWrapper>;
    }

    return (
        <PageWrapper
            title="Document Repository"
            description="Manage all park-related documents, contracts, and records."
            breadcrumbs={breadcrumbs}
            actions={pageActions}
        >
            <DocumentTable
                documents={documents}
                onViewDocument={handleViewDocument}
                onEditDocument={handleOpenEditModal}
                onDeleteDocument={handleDeleteDocument}
                onDownloadDocument={handleDownloadDocument}
            />
        </PageWrapper>
    );
} 