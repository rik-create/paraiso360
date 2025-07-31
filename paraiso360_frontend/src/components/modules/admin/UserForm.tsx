"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { User } from '@/types/paraiso';
import { USER_ROLES } from '@/lib/constants';
import { generateId } from '@/lib/utils';

interface UserFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (user: User) => void;
    initialData?: User | null;
}

export function UserForm({ isOpen, onClose, onSubmit, initialData }: UserFormProps) {
    const [formData, setFormData] = useState<Partial<User>>({
        username: '',
        fullName: '',
        email: '',
        role: USER_ROLES.STAFF as 'staff',
        status: 'active',
    });
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEditing = Boolean(initialData);

    useEffect(() => {
        if (isEditing && initialData) {
            setFormData({
                id: initialData.id,
                username: initialData.username,
                fullName: initialData.fullName,
                email: initialData.email,
                role: initialData.role,
                status: initialData.status,
            });
            setPassword('');
            setConfirmPassword('');
        } else {
            setFormData({
                username: '',
                fullName: '',
                email: '',
                role: USER_ROLES.STAFF as 'staff',
                status: 'active',
            });
            setPassword('');
            setConfirmPassword('');
        }
        setErrors({});
    }, [isOpen, initialData, isEditing]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSelectChange = (name: keyof User, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value as any }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.username?.trim()) newErrors.username = 'Username is required.';
        if (!formData.fullName?.trim()) newErrors.fullName = 'Full Name is required.';
        if (!formData.email?.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid.';
        }
        if (!isEditing || (isEditing && password)) {
            if (!password) newErrors.password = 'Password is required for new users.';
            else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
            if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
        }
        if (!formData.role) newErrors.role = 'Role is required.';
        if (!formData.status) newErrors.status = 'Status is required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const userToSubmit: User = {
            id: isEditing ? initialData!.id : generateId('user'),
            username: formData.username!,
            fullName: formData.fullName!,
            email: formData.email!,
            role: formData.role!,
            status: formData.status as 'active' | 'inactive',
        };
        if (!isEditing || (isEditing && password)) {
            console.log("Password would be set/updated (not stored in object):", password);
        }

        onSubmit(userToSubmit);
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit User' : 'Add New User'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update the details of the existing user.' : 'Fill in the details to create a new user account.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">Username</Label>
                            <div className="col-span-3">
                                <Input id="username" name="username" value={formData.username} onChange={handleChange} className={errors.username ? "border-red-500" : ""} />
                                {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="fullName" className="text-right">Full Name</Label>
                            <div className="col-span-3">
                                <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className={errors.fullName ? "border-red-500" : ""} />
                                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <div className="col-span-3">
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={errors.email ? "border-red-500" : ""} />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">Password</Label>
                            <div className="col-span-3">
                                <Input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isEditing ? "Leave blank to keep current" : ""} className={errors.password ? "border-red-500" : ""} />
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="confirmPassword" className="text-right">Confirm Password</Label>
                            <div className="col-span-3">
                                <Input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={isEditing ? "Leave blank to keep current" : ""} className={errors.confirmPassword ? "border-red-500" : ""} />
                                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">Role</Label>
                            <div className="col-span-3">
                                <Select name="role" value={formData.role} onValueChange={(value) => handleSelectChange('role', value)}>
                                    <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={USER_ROLES.STAFF}>Staff</SelectItem>
                                        <SelectItem value={USER_ROLES.ADMIN}>Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">Status</Label>
                            <div className="col-span-3">
                                <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                                    <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-xs text-red-500 mt-1">{errors.status}</p>}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        </DialogClose>
                        <Button type="submit">{isEditing ? 'Save Changes' : 'Create User'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 