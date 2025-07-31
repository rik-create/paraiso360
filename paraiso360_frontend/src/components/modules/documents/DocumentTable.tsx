"use client";

import React, { useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileText, Search, Filter, UploadCloud, Eye, Edit2, Trash2, Download } from 'lucide-react';
import type { DocumentRecord } from '@/types/paraiso';
import { formatDate } from '@/lib/utils';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { APP_ROUTES } from '@/lib/constants';
import { mockClients, mockPlots } from '@/lib/mockData'; // Import mock data directly

// Placeholder for Upload/Edit Form (can be moved to its own component later)
function DocumentForm({ document, onSave, onCancel }: { document?: DocumentRecord | null, onSave: (data: FormData) => void, onCancel: () => void }) {
    const [fileName, setFileName] = useState(document?.fileName || '');
    const [description, setDescription] = useState(document?.description || '');
    const [tags, setTags] = useState(document?.tags?.join(', ') || '');
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        if (file) formData.append('file', file);
        formData.append('fileName', fileName); // Actual file name might be derived from File object
        formData.append('description', description);
        formData.append('tags', tags);
        if (document?.id) formData.append('id', document.id);
        // Add clientId, plotId if needed from separate inputs in a real form
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {!document && ( // Only show file input for new documents
                (<div>
                    <Label htmlFor="documentFile">Document File</Label>
                    <Input id="documentFile" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required={!document} />
                </div>)
            )}
            <div>
                <Label htmlFor="fileName">File Name (Display Name)</Label>
                <Input id="fileName" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="e.g., Contract_ClientA.pdf" disabled={!!document && !file} />
                {document && !file && <p className="text-xs text-muted-foreground mt-1">To change the actual file, re-upload it.</p>}
            </div>
            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the document" />
            </div>
            <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., contract, clientA, sectionB" />
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">{document ? 'Save Changes' : 'Upload Document'}</Button>
            </DialogFooter>
        </form>
    );
}

interface DocumentTableProps {
    documents: DocumentRecord[];
    onViewDocument: (doc: DocumentRecord) => void;
    onEditDocument: (doc: DocumentRecord) => void;
    onDeleteDocument: (docId: string) => void;
    onDownloadDocument: (doc: DocumentRecord) => void;
}

export function DocumentTable({
    documents,
    onViewDocument,
    onEditDocument,
    onDeleteDocument,
    onDownloadDocument,
}: DocumentTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    // Add filter states if needed, e.g., by file type, upload date range

    const filteredDocuments = useMemo(() => {
        return documents.filter(doc =>
            doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (doc.clientName && doc.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (doc.plotIdentifier && doc.plotIdentifier.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
        );
    }, [documents, searchTerm]);

    // For modals
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<DocumentRecord | null>(null);

    const handleDeleteConfirmation = (doc: DocumentRecord) => {
        setDocumentToDelete(doc);
        setIsConfirmDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (documentToDelete) {
            onDeleteDocument(documentToDelete.id);
        }
        setIsConfirmDeleteDialogOpen(false);
        setDocumentToDelete(null);
    };

    const getLinkedClientName = (clientId?: string) => {
        if (!clientId) return 'N/A';
        const client = mockClients.find(c => c.id === clientId);
        return client ? `${client.firstName} ${client.lastName}` : 'Unknown Client';
    };

    const getLinkedPlotIdentifier = (plotId?: string) => {
        if (!plotId) return 'N/A';
        const plot = mockPlots.find(p => p.id === plotId);
        return plot ? `Plot ${plot.section}-${plot.blockNumber}-${plot.lotNumber}` : 'Unknown Plot';
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative w-full sm:flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search documents (name, desc, client, plot, tags)..."
                        className="w-full pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
                {/* Upload button is typically at the page level, not inside the table component directly */}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px] hidden sm:table-cell"><FileText className="h-4 w-4" /></TableHead>
                            <TableHead>File Name</TableHead>
                            <TableHead className="hidden md:table-cell">Description</TableHead>
                            <TableHead className="hidden lg:table-cell">Associated With</TableHead>
                            <TableHead className="hidden sm:table-cell">Upload Date</TableHead>
                            <TableHead className="hidden md:table-cell">Tags</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDocuments.length > 0 ? (
                            filteredDocuments.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell className="hidden sm:table-cell">
                                        {/* Display different icons based on file type (simplified) */}
                                        {doc.fileType?.startsWith('image/') ? <Eye className="h-5 w-5 text-blue-500" /> : <FileText className="h-5 w-5 text-gray-500" />}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="truncate max-w-[150px] sm:max-w-[200px]">{doc.fileName}</span>
                                            <span className="text-xs text-muted-foreground">{doc.fileType}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell truncate max-w-[200px]">{doc.description || 'N/A'}</TableCell>
                                    <TableCell className="hidden lg:table-cell text-xs">
                                        {doc.clientName && <div>Client: {doc.clientName}</div>}
                                        {doc.plotIdentifier && <div>Plot: {doc.plotIdentifier}</div>}
                                        {!doc.clientName && !doc.plotIdentifier && <span className="text-muted-foreground">General</span>}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">{formatDate(doc.uploadDate)}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {doc.tags && doc.tags.length > 0 ? (
                                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                                                {doc.tags.slice(0, 2).map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                                {doc.tags.length > 2 && <Badge variant="outline">+{doc.tags.length - 2}</Badge>}
                                            </div>
                                        ) : <span className="text-muted-foreground">No tags</span>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Actions</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onViewDocument(doc)}>
                                                    <Eye className="mr-2 h-4 w-4" /> View/Preview
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onDownloadDocument(doc)}>
                                                    <Download className="mr-2 h-4 w-4" /> Download
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onEditDocument(doc)}>
                                                    <Edit2 className="mr-2 h-4 w-4" /> Edit Metadata
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                    onClick={() => handleDeleteConfirmation(doc)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No documents found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Pagination would go here */}

            {/* Confirmation Dialog for Delete */}
            <Dialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the document "{documentToDelete?.fileName}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 