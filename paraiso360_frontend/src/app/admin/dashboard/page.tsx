"use client";

import React from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCog, ActivitySquare, ShieldCheck, BarChartHorizontalBig, Settings, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { APP_ROUTES } from '@/lib/constants';
import type { BreadcrumbItem } from '@/types/paraiso';

const adminDashboardStats = [
    { title: 'Total Users', value: '25', icon: Users, href: APP_ROUTES.ADMIN_USERS, description: 'Staff & Admin accounts' },
    { title: 'Pending Approvals', value: '3', icon: ShieldCheck, href: '#', description: 'e.g., new registrations' },
    { title: 'System Health', value: 'Optimal', icon: Settings, href: APP_ROUTES.ADMIN_SETTINGS, description: 'No critical issues' },
    { title: 'Recent Audit Logs', value: '15 new', icon: ActivitySquare, href: APP_ROUTES.ADMIN_AUDIT_TRAIL, description: 'Last 24 hours' },
];

const quickActions = [
    { label: 'Manage Users', href: APP_ROUTES.ADMIN_USERS, icon: UserCog },
    { label: 'View Audit Trail', href: APP_ROUTES.ADMIN_AUDIT_TRAIL, icon: ActivitySquare },
    { label: 'System Settings', href: APP_ROUTES.ADMIN_SETTINGS, icon: Settings },
    { label: 'Generate System Report', href: '#', icon: BarChartHorizontalBig },
];

export default function AdminDashboardPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Dashboard" },
    ];

    return (
        <PageWrapper
            title="Administrator Dashboard"
            breadcrumbs={breadcrumbs}
        >
            <div className="mb-6">
                <p className="text-muted-foreground">
                    Oversee and manage critical aspects of the Paraiso360 system.
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                {adminDashboardStats.map((stat) => (
                    <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mb-1">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mb-2">{stat.description}</p>
                            <Link href={stat.href} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3">
                                View Details
                            </Link>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={stat.href}>View Details</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Access common administrative tasks directly.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {quickActions.map((action) => (
                            <Button key={action.label} variant="secondary" asChild className="w-full justify-start text-left h-auto py-3">
                                <Link href={action.href}>
                                    <action.icon className="mr-2 h-5 w-5" />
                                    <span className="flex flex-col">
                                        <span className="font-medium">{action.label}</span>
                                    </span>
                                </Link>
                            </Button>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-yellow-500 dark:border-yellow-400">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
                            System Alerts / Status
                        </CardTitle>
                        <CardDescription>Important notifications and system health.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                                <span className="text-green-500 mr-2">✔</span> Database backup successful (Last night).
                            </li>
                            <li className="flex items-start">
                                <span className="text-yellow-500 mr-2">⚠</span> New security patch available for review.
                            </li>
                            <li className="flex items-start">
                                <span className="text-muted-foreground mr-2">ℹ</span> Scheduled maintenance in 3 days.
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </PageWrapper>
    );
} 