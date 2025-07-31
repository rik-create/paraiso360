"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Client } from '@/types/paraiso';
import { useToast } from "@/components/ui/sonner";

interface ClientFormProps {
    client?: Client | null;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onSave?: (updatedClient: Client) => void;
    trigger?: React.ReactNode;
}

export function ClientForm({ client, open: controlledOpen, onOpenChange, onSave, trigger }: ClientFormProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [alternativeContactNumber, setAlternativeContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const toast = useToast();

    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setIsOpen = controlledOpen !== undefined && onOpenChange ? onOpenChange : setInternalOpen;

    useEffect(() => {
        if (client) {
            setFirstName(client.firstName || '');
            setLastName(client.lastName || '');
            setContactNumber(client.contactNumber || '');
            setAlternativeContactNumber(client.alternativeContactNumber || '');
            setEmail(client.email || '');
            setAddress(client.address || '');
            setNotes(client.notes || '');
        } else {
            setFirstName('');
            setLastName('');
            setContactNumber('');
            setAlternativeContactNumber('');
            setEmail('');
            setAddress('');
            setNotes('');
        }
    }, [client, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!firstName || !lastName || !contactNumber || !address) {
            toast.error("Validation Error", {
                description: "Please fill in all required fields (First Name, Last Name, Contact, Address).",
            });
            return;
        }

        const updatedClientData: Client = {
            ...(client || { id: `new_${Date.now()}`, registrationDate: new Date(), associatedPlotIds: [] }),
            firstName,
            lastName,
            contactNumber,
            alternativeContactNumber,
            email,
            address,
            notes,
        };

        if (onSave) {
            onSave(updatedClientData);
        }

        toast.success(client ? "Client Updated" : "Client Created", {
            description: `${firstName} ${lastName}\'s information has been saved.`,
        });
        setIsOpen(false);
    };

    const formTitle = client ? "Edit Client Details" : "Add New Client";
    const formDescription = client ? `Update the information for ${client.firstName} ${client.lastName}.` : "Enter the details for the new client.";

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{formTitle}</DialogTitle>
                    <DialogDescription>{formDescription}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Client's first name" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Client's last name" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="contactNumber">Contact Number <span className="text-red-500">*</span></Label>
                                <Input id="contactNumber" type="tel" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} placeholder="09XXXXXXXXX" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="altContactNumber">Alternative Contact</Label>
                                <Input id="altContactNumber" type="tel" value={alternativeContactNumber} onChange={(e) => setAlternativeContactNumber(e.target.value)} placeholder="Optional" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@example.com" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                            <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full street address" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional notes about the client" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">{client ? "Save Changes" : "Create Client"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 