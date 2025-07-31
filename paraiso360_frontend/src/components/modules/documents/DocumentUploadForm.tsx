"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { UploadCloud } from 'lucide-react';
import type { DocumentRecord } from '@/types/paraiso';

interface DocumentUploadFormProps {
    document?: DocumentRecord | null;
    onSave: (data: FormData) => void;
    onCancel: () => void;
}

export function DocumentUploadForm({
    document,
    onSave,
    onCancel,
}: DocumentUploadFormProps) {
    const [fileName, setFileName] = useState(document?.fileName || '');
    const [description, setDescription] = useState(document?.description || '');
    const [tags, setTags] = useState(document?.tags?.join(', ') || '');
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file && !document) {
            alert("Please select a file to upload.");
            return;
        }
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
            formData.append('fileName', fileName || file.name);
        } else if (document) {
            formData.append('fileName', fileName || document.fileName);
        }
        if (!formData.has('fileName') && fileName) {
            formData.append('fileName', fileName);
        }

        formData.append('description', description);
        formData.append('tags', tags);
        if (document?.id) {
            formData.append('id', document.id);
        }

        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {!document || file ? (
                <div>
                    <Label htmlFor="documentFileModal">Document File {document ? '(Optional: to replace current)' : '*'}</Label>
                    <Input
                        id="documentFileModal"
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        required={!document}
                    />
                </div>
            ) : (
                document && (
                    <div className="py-2 px-3 bg-muted/50 rounded-md border">
                        <p className="text-sm font-medium">Current file: <span className='text-foreground'>{document.fileName}</span></p>
                        <p className="text-xs text-muted-foreground">To replace the file, choose a new one using the input field above (it will reappear if you clear the current selection or if it's optional for edit).</p>
                    </div>
                )
            )}
            <div>
                <Label htmlFor="fileNameModal">File Name (Display Name)</Label>
                <Input
                    id="fileNameModal"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="e.g., Contract_ClientA.pdf (defaults to original if blank & new file chosen)"
                />
            </div>
            <div>
                <Label htmlFor="descriptionModal">Description</Label>
                <Textarea
                    id="descriptionModal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the document"
                />
            </div>
            <div>
                <Label htmlFor="tagsModal">Tags (comma-separated)</Label>
                <Input
                    id="tagsModal"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., contract, clientA, sectionB"
                />
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit">
                    <UploadCloud className="mr-2 h-4 w-4" />
                    {document ? 'Save Changes' : 'Upload Document'}
                </Button>
            </DialogFooter>
        </form>
    );
} 