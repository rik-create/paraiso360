import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Navbar } from '@/components/layout/Navbar';
import React from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex min-h-screen w-full bg-muted/40 dark:bg-gray-950">
            <AdminSidebar />
            <div className="flex flex-col flex-1">
                <Navbar />
                <main className="flex-1 overflow-auto flex flex-col"> {/* Ensure flex-col for full height children like map */}
                    {children}
                </main>
            </div>
        </div>
    );
} 