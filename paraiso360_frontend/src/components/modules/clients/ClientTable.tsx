"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import type { Client } from '@/types/paraiso';
import { mockClients } from '@/lib/mockData';
import { formatDate, generateId } from '@/lib/utils';
import { APP_ROUTES } from '@/lib/constants';
import { SearchInput } from '@/components/shared/SearchInput';
import { ClientForm } from './ClientForm';

interface ClientTableProps {
    initialClients?: Client[];
}

export function ClientTable({ initialClients }: ClientTableProps) {
    const [clients, setClients] = useState<Client[]>(initialClients || mockClients);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

    const filteredClients = useMemo(() => {
        if (!searchTerm) return clients;
        return clients.filter(client =>
            client.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.contactNumber.includes(searchTerm)
        );
    }, [clients, searchTerm]);

    const handleAddNewClient = () => {
        setEditingClient(null);
        setIsFormOpen(true);
    };

    const handleEditClient = (client: Client) => {
        setEditingClient(client);
        setIsFormOpen(true);
    };

    const handleSaveClient = (clientData: Omit<Client, 'id' | 'registrationDate' | 'associatedPlotIds'> & { id?: string }) => {
        if (clientData.id) {
            setClients(prevClients => prevClients.map(c => c.id === clientData.id ? { ...c, ...clientData, registrationDate: c.registrationDate, associatedPlotIds: c.associatedPlotIds } as Client : c));
        } else {
            const newClient: Client = {
                ...clientData,
                id: generateId('client'),
                registrationDate: new Date(),
                associatedPlotIds: [],
            };
            setClients(prevClients => [newClient, ...prevClients]);
        }
        setIsFormOpen(false);
        setEditingClient(null);
    };

    const handleDeleteClient = (clientId: string) => {
        setClients(prevClients => prevClients.filter(c => c.id !== clientId));
        setClientToDelete(null);
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <SearchInput
                    initialValue={searchTerm}
                    onSearch={setSearchTerm}
                    onClear={() => setSearchTerm('')}
                    placeholder="Search clients (Name, Email, Contact)..."
                    className="w-full sm:w-auto sm:max-w-xs"
                    liveSearch={true}
                    debounceTimeout={300}
                />
                <Button onClick={handleAddNewClient}>Add New Client</Button>
            </div>
            <Card className="shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px]">Full Name</TableHead>
                                <TableHead>Contact No.</TableHead>
                                <TableHead className="hidden md:table-cell">Email</TableHead>
                                <TableHead className="hidden sm:table-cell text-center">Plots</TableHead>
                                <TableHead className="hidden md:table-cell">Registered</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClients.length > 0 ? (
                                filteredClients.map((client) => (
                                    <TableRow key={client.id}>
                                        <TableCell>
                                            <div className="font-medium">{client.firstName} {client.lastName}</div>
                                            <div className="text-xs text-muted-foreground hidden md:block">{client.email || 'N/A'}</div>
                                        </TableCell>
                                        <TableCell>{client.contactNumber}</TableCell>
                                        <TableCell className="hidden md:table-cell">{client.email || 'N/A'}</TableCell>
                                        <TableCell className="hidden sm:table-cell text-center">
                                            {client.associatedPlotIds.length}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{formatDate(client.registrationDate)}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={APP_ROUTES.STAFF_CLIENT_DETAIL(client.id)}>
                                                            <Eye className="mr-2 h-4 w-4" /> View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleEditClient(client)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                                        onClick={() => setClientToDelete(client)}
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
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No clients found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <ClientForm
                client={editingClient}
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                onSave={handleSaveClient}
            />
            {clientToDelete && <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded mt-4">AlertDialog component missing. Delete confirmation for {clientToDelete.firstName} {clientToDelete.lastName} is skipped. Click again on a real delete button if it were here. <button onClick={() => handleDeleteClient(clientToDelete!.id)}>Confirm Delete (temp)</button> <button onClick={() => setClientToDelete(null)}>Cancel (temp)</button> </div>}
        </>
    );
} 