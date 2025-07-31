"use client";
import React from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MapPinned, CreditCard, FileText, PlusCircle, ListChecks, BarChartBig } from 'lucide-react';
import Link from 'next/link';
import { APP_ROUTES } from '@/lib/constants'; // For consistent routing
import type { BreadcrumbItem } from '@/types/paraiso'; // Import BreadcrumbItem type

// Mock Data for stats - In a real app, this would come from an API or state
const dashboardStats = [
    { title: 'Active Clients', value: '1,237', icon: Users, href: APP_ROUTES.STAFF_CLIENTS, description: '+20 since last month' },
    { title: 'Available Lots', value: '342', icon: MapPinned, href: APP_ROUTES.STAFF_LOT_INVENTORY, description: 'Check for new reservations' },
    { title: 'Payments This Week', value: '₱125,800', icon: CreditCard, href: APP_ROUTES.STAFF_PAYMENTS, description: '18 new transactions' },
    { title: 'Documents Pending', value: '5', icon: FileText, href: APP_ROUTES.STAFF_DOCUMENTS, description: 'Require review/filing' },
];

const quickActions = [
    { label: "Add New Client", href: `${APP_ROUTES.STAFF_CLIENTS}?action=new`, icon: Users }, //  Query param for modal trigger
    { label: "Record New Payment", href: `${APP_ROUTES.STAFF_PAYMENTS}?action=new`, icon: CreditCard },
    { label: "View Interactive Map", href: APP_ROUTES.STAFF_LOT_MAP, icon: MapPinned },
    { label: "Generate Daily Report", href: `${APP_ROUTES.STAFF_REPORTS}?type=daily`, icon: BarChartBig },
];

// Mock recent activity
const recentActivity = [
    { id: 1, message: "Client 'New Inquirer' was added.", time: "2 hours ago", user: "staff01" },
    { id: 2, message: "Payment OR12349 for ₱5,000 recorded.", time: "3 hours ago", user: "staff01" },
    { id: 3, message: "Plot S2P02-007 status updated to 'Reserved'.", time: "5 hours ago", user: "staff02" },
    { id: 4, message: "Document 'Contract_ClientB.pdf' uploaded.", time: "Yesterday", user: "staff01" },
];


export default function StaffDashboardPage() {
    // The StaffLayout (sidebar & navbar) is applied automatically by Next.js App Router

    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Dashboard" }, // Current page
    ];

    const pageActions = (
        <Button asChild>
            <Link href={`${APP_ROUTES.STAFF_LOT_INVENTORY}?filter=urgent`}> {/* Example action */}
                <ListChecks className="mr-2 h-4 w-4" /> View Urgent Tasks
            </Link>
        </Button>
    );

    return (
        <PageWrapper
            title="Staff Dashboard"
            description="Welcome! Here's an overview of current park operations."
            breadcrumbs={breadcrumbs}
        //   actions={pageActions} // Optional: Add page-level actions if different from quick actions below
        >
            {/* Stats Cards Section */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                {dashboardStats.map((stat) => (
                    <Card key={stat.title} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                            <Button variant="link" size="sm" asChild className="px-0 pt-2 text-xs">
                                <Link href={stat.href}>View Details →</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {/* Quick Actions & Recent Activity Section */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Quick Actions Card */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Access common tasks quickly.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {quickActions.map((action) => (
                            <Button key={action.label} variant="outline" asChild className="w-full justify-start text-left">
                                <Link href={action.href}>
                                    <span className="flex items-center">
                                        <action.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                                        {action.label}
                                    </span>
                                </Link>
                            </Button>
                        ))}
                    </CardContent>
                </Card>

                {/* Recent Activity Card */}
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest updates in the system.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentActivity.length > 0 ? (
                            <ul className="space-y-3">
                                {recentActivity.map((activity) => (
                                    <li key={activity.id} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">
                                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs">
                                                {activity.user.substring(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-foreground">{activity.message}</p>
                                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">No recent activity to display.</p>
                        )}
                        <Button variant="link" size="sm" asChild className="px-0 pt-4 text-xs">
                            <Link href="#">View All Activity →</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
            {/* You can add more sections here, e.g., charts, pending tasks, etc. */}
            {/* Example: Placeholder for a chart */}
            {/*
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Overview</CardTitle>
            <CardDescription>Visual representation of lot statuses.</CardDescription>
          </Header>
          <CardContent className="h-64 bg-muted flex items-center justify-center rounded-md">
            <p className="text-muted-foreground">[Chart Placeholder - e.g., Pie Chart for Lot Statuses]</p>
          </CardContent>
        </Card>
      </div>
      */}
        </PageWrapper>
    );
} 