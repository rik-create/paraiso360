"use client";
import React from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { ClientTable } from '@/components/modules/clients/ClientTable';
import type { BreadcrumbItem } from '@/types/paraiso';
import { APP_ROUTES } from '@/lib/constants';

export default function ClientsPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Dashboard", href: APP_ROUTES.STAFF_DASHBOARD },
        { label: "Clients" },
    ];

    return (
        <PageWrapper
            title="Client Records Management"
            breadcrumbs={breadcrumbs}
        >
            <ClientTable />
        </PageWrapper>
    );
} 