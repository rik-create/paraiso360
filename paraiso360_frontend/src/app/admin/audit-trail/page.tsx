import { PageWrapper } from '@/components/layout/PageWrapper';
import { AuditLogTable } from '@/components/modules/admin/AuditLogTable';
import React from 'react';
import type { Metadata } from 'next'; // Import Metadata type
import type { BreadcrumbItem } from '@/types/paraiso'; // Import type
import { APP_ROUTES } from '@/lib/constants'; // Import routes

export const metadata: Metadata = {
    title: 'Audit Trail - Paraiso360 Admin',
    description: 'View system activity and audit logs.',
};

export default function AuditTrailPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Dashboard", href: APP_ROUTES.ADMIN_DASHBOARD },
        { label: "Audit Trail" }, // Current page
    ];

    return (
        <PageWrapper
            title="Audit Trail Log Viewer"
            breadcrumbs={breadcrumbs} // Add breadcrumbs prop
        // Optional: Add any page-level actions here if needed
        // actions={
        //   <Button variant="outline">Export Logs</Button>
        // }
        >
            <AuditLogTable />
        </PageWrapper>
    );
} 