"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmButtonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function ConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    confirmButtonVariant = "destructive", // Default to destructive for confirmation dialogs
}: ConfirmationDialogProps) {
    if (!isOpen) return null;

    let confirmButtonClass = "";
    if (confirmButtonVariant === "destructive") {
        confirmButtonClass = "bg-destructive text-destructive-foreground hover:bg-destructive/90";
    } else if (confirmButtonVariant === "default") {
        confirmButtonClass = "bg-primary text-primary-foreground hover:bg-primary/90";
    } // Add other variants if needed, e.g., outline, secondary

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>{cancelButtonText}</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className={confirmButtonClass}>
                        {confirmButtonText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 