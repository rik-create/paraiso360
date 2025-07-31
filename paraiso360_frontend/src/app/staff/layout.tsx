import React from 'react';
import { StaffSidebar } from '@/components/layout/StaffSidebar';
import { Navbar } from '@/components/layout/Navbar';
// The PageWrapper component is typically used *inside* the individual page.tsx files
// that are children of this layout, not directly in the layout itself for the <main> content.

export default function StaffLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // In a real application, you would add authentication checks here.
    // For this UI prototype, we'll assume authentication is handled or mocked elsewhere.

    return (
        <div className="flex min-h-screen w-full bg-muted/40 dark:bg-gray-950">
            {/* Desktop Sidebar: Pass isInSheet={false} or rely on default */}
            <StaffSidebar isInSheet={false} /> {/* Explicitly false for clarity */}

            <div className="flex flex-col flex-1 w-full sm:w-auto overflow-x-hidden"> {/* Prevent horizontal scroll */}
                {/* Navbar: Shared across staff and potentially admin sections */}
                <Navbar /> {/* The Navbar now handles its own sticky positioning and mobile menu trigger */}

                {/* Main Content Area for Staff Pages */}
                {/* The 'children' prop will be the actual page.tsx content (e.g., StaffDashboardPage) */}
                {/* This <main> tag is where the content rendered by PageWrapper (inside child pages) will appear. */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6"> {/* Allow vertical scroll and add padding */}
                    {/*
            Individual pages (e.g., dashboard/page.tsx, clients/page.tsx)
            will typically use the <PageWrapper> component to structure their specific content,
            including titles, breadcrumbs, and actions.
          */}
                    {children}
                </main>
            </div>
        </div>
    );
} 