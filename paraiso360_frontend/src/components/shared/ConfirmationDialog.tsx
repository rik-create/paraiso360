'use client';

import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface ConfirmationDialogProps {
    triggerButton: React.ReactNode;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    isDestructive?: boolean;
    dialogOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function ConfirmationDialog({
    triggerButton,
    title = "Are you absolutely sure?",
    description = "This action cannot be undone. This will permanently affect your data.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    isDestructive = true,
    dialogOpen,
    onOpenChange,
}: ConfirmationDialogProps) {
    return (
        <AlertDialog open={dialogOpen} onOpenChange={onOpenChange}>
            <AlertDialogTrigger asChild>
                {triggerButton}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={cn(isDestructive && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

interface ConfirmationDialogTriggerButtonProps extends React.ComponentProps<typeof Button> {
    buttonText: string;
}

export const ConfirmationDialogTriggerButton: React.FC<ConfirmationDialogTriggerButtonProps> = ({ buttonText, ...props }) => {
    return <Button {...props}>{buttonText}</Button>;
}; 