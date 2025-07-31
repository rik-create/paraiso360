"use client";

import React, { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { UserTable } from '@/components/modules/admin/UserTable';
import { UserForm } from '@/components/modules/admin/UserForm';
import { User, BreadcrumbItem } from '@/types/paraiso';
import { mockUsers as initialMockUsers } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/sonner";
import { APP_ROUTES } from '@/lib/constants';

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>(initialMockUsers);
    const [filteredUsers, setFilteredUsers] = useState<User[]>(initialMockUsers);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const toast = useToast();

    useEffect(() => {
        let result = users;
        if (searchTerm) {
            result = result.filter(user =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (roleFilter !== 'all') {
            result = result.filter(user => user.role === roleFilter);
        }
        if (statusFilter !== 'all') {
            result = result.filter(user => user.status === statusFilter);
        }
        setFilteredUsers(result);
    }, [users, searchTerm, roleFilter, statusFilter]);


    const handleAddUser = () => {
        setEditingUser(null);
        setIsFormOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsFormOpen(true);
    };

    const handleFormSubmit = (submittedUser: User) => {
        let message = "";
        if (editingUser) {
            setUsers(users.map(u => u.id === submittedUser.id ? submittedUser : u));
            message = `User ${submittedUser.username} has been updated.`;
        } else {
            setUsers([...users, submittedUser]);
            message = `New user ${submittedUser.username} has been added.`;
        }
        toast.success(editingUser ? "User Updated" : "User Created", { description: message });
        setIsFormOpen(false);
        setEditingUser(null);
    };

    const handleDeactivateUser = (userId: string) => {
        let message = "";
        setUsers(users.map(u => {
            if (u.id === userId) {
                const newStatus = u.status === 'active' ? 'inactive' : 'active';
                message = `User ${u.username} status changed to ${newStatus}.`;
                return { ...u, status: newStatus };
            }
            return u;
        }));
        toast.info(message);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Dashboard", href: APP_ROUTES.ADMIN_DASHBOARD },
        { label: "User Management" },
    ];

    return (
        <PageWrapper
            title="User Accounts Management"
            breadcrumbs={breadcrumbs}
            actions={
                <Button onClick={handleAddUser}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New User
                </Button>
            }
        >
            <div className="mb-6 p-4 border rounded-lg bg-card dark:bg-gray-850">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        placeholder="Search users (username, name, email)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="md:col-span-1"
                    />
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <UserTable
                users={filteredUsers}
                onEditUser={handleEditUser}
                onDeactivateUser={handleDeactivateUser}
            />

            {isFormOpen && (
                <UserForm
                    isOpen={isFormOpen}
                    onClose={() => {
                        setIsFormOpen(false);
                        setEditingUser(null);
                    }}
                    onSubmit={handleFormSubmit}
                    initialData={editingUser}
                />
            )}
        </PageWrapper>
    );
} 