"use client";

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { User } from '@/types/paraiso';
import { formatDate } from '@/lib/utils';

interface UserTableProps {
    users: User[];
    onEditUser: (user: User) => void;
    onDeactivateUser: (userId: string) => void;
    onViewUser?: (user: User) => void;
}

export function UserTable({ users, onEditUser, onDeactivateUser, onViewUser }: UserTableProps) {
    if (!users || users.length === 0) {
        return <p className="text-center text-muted-foreground py-8">No users found.</p>;
    }

    const getStatusBadgeVariant = (status: 'active' | 'inactive'): "default" | "destructive" => {
        switch (status) {
            case 'active':
                return 'default';
            case 'inactive':
                return 'destructive';
            default:
                return 'default';
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[150px]">Username</TableHead>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="w-[100px]">Role</TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                        <TableHead className="w-[150px]">Last Login</TableHead>
                        <TableHead className="w-[80px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.username}</TableCell>
                            <TableCell>{user.fullName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                                    {user.role}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadgeVariant(user.status)} className="capitalize">
                                    {user.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{user.lastLogin ? formatDate(new Date(user.lastLogin)) : 'N/A'}</TableCell>
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
                                        {onViewUser && (
                                            <DropdownMenuItem onClick={() => onViewUser(user)}>
                                                <Eye className="mr-2 h-4 w-4" /> View Details
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem onClick={() => onEditUser(user)}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit User
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => onDeactivateUser(user.id)}
                                            className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50 dark:focus:text-red-400"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
} 