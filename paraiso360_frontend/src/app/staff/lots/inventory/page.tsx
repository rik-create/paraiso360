"use client";

import React from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import { LotInventoryTable } from '@/components/modules/lots/LotInventoryTable';
import { mockPlots } from '@/lib/mockData';
import Link from 'next/link';
import { Map, PlusCircle } from 'lucide-react';
import { APP_ROUTES } from '@/lib/constants';
import type { BreadcrumbItem } from '@/types/paraiso';

const plotsData = mockPlots;

export default function LotInventoryPage() {
    const handleAddNewPlot = () => {
        console.log("Add new plot clicked");
        alert("Placeholder: Add New Plot. Implement form/modal.");
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Dashboard", href: APP_ROUTES.STAFF_DASHBOARD },
        { label: "Lot Management" },
    ];

    return (
        <PageWrapper
            title="Lot Inventory Management"
            breadcrumbs={breadcrumbs}
            actions={
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={APP_ROUTES.STAFF_LOT_MAP} >
                            <Map className="mr-2 h-4 w-4" />
                            Switch to Map View
                        </Link>
                    </Button>
                    <Button onClick={handleAddNewPlot}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Plot
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col h-[calc(100vh-12rem)]">
                <div className="flex-grow overflow-y-auto border rounded-md">
                    <LotInventoryTable plots={plotsData} />
                </div>
            </div>
        </PageWrapper>
    );
} 