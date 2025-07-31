"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, FileText, CreditCard, MapPinned, BarChart3, LogOut, ShieldCheck, Settings, Building, UserCog, ActivitySquare, Map } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';
import { APP_ROUTES } from '@/lib/constants';
import { Button } from '@/components/ui/button';

const baseStaffMenuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home, exact: true },
    {
        label: 'Client Management',
        icon: Users,
        basePath: '/admin/clients',
        subItems: [
            { href: '/admin/clients', label: 'View Clients', icon: Users },
        ],
    },
    {
        label: 'Lot Management',
        icon: Building,
        basePath: '/admin/lots',
        subItems: [
            { href: '/admin/lots/inventory', label: 'Lot Inventory', icon: MapPinned },
            { href: '/admin/lots/map', label: 'Interactive Map', icon: MapPinned },
        ],
    },
    {
        label: 'Financials',
        icon: CreditCard,
        basePath: '/admin/payments',
        subItems: [
            { href: '/admin/payments', label: 'Payment Ledger', icon: CreditCard },
        ],
    },
    { href: '/admin/documents', label: 'Document Repository', icon: FileText, basePath: '/admin/documents' },
    { href: '/admin/reports', label: 'Reports', icon: BarChart3, basePath: '/admin/reports' },
];

const adminSpecificMenuItems = [
    {
        label: 'Administration',
        icon: ShieldCheck,
        basePath: '/admin',
        subItems: [
            { href: '/admin/users', label: 'User Management', icon: UserCog },
            { href: '/admin/audit-trail', label: 'Audit Trail', icon: ActivitySquare },
            { href: '/admin/settings', label: 'System Settings', icon: Settings },
        ],
    },
];

const adminMenuItems = [...baseStaffMenuItems, ...adminSpecificMenuItems];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex md:flex-col md:w-72 bg-background dark:bg-gray-900/80 border-r border-gray-200 dark:border-gray-700/80 p-4 space-y-6">
            <div className="mb-4">
                <Link
                    href={APP_ROUTES.ADMIN_DASHBOARD}
                    className="text-2xl font-bold text-center text-primary dark:text-primary-foreground py-2"
                >
                    Paraiso360 <span className="text-sm font-normal text-muted-foreground">(Admin)</span>
                </Link>
            </div>
            <nav className="flex-1 overflow-y-auto">
                <div className="p-4 text-muted-foreground">Sidebar menu coming soon (Accordion component missing)</div>
                <div className="mt-auto">
                    <Separator className="my-4" />
                    <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300" asChild>
                        <Link href={APP_ROUTES.LOGIN} >
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                        </Link>
                    </Button>
                </div>
            </nav>
        </aside>
    );
} 