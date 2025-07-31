"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, FileText, CreditCard, MapPinned, BarChart3, LogOut, Building, Map as MapIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { APP_ROUTES } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const staffMenuItems = [
    { href: APP_ROUTES.STAFF_DASHBOARD, label: 'Dashboard', icon: Home, exact: true },
    {
        label: 'Client Management',
        icon: Users,
        basePath: APP_ROUTES.STAFF_CLIENTS,
        subItems: [
            { href: APP_ROUTES.STAFF_CLIENTS, label: 'View All Clients', icon: Users },
        ],
    },
    {
        label: 'Lot Management',
        icon: Building,
        basePath: '/staff/lots',
        subItems: [
            { href: APP_ROUTES.STAFF_LOT_INVENTORY, label: 'Lot Inventory', icon: MapIcon },
            { href: APP_ROUTES.STAFF_LOT_MAP, label: 'Interactive Map', icon: MapPinned },
        ],
    },
    {
        label: 'Financials',
        icon: CreditCard,
        basePath: APP_ROUTES.STAFF_PAYMENTS,
        subItems: [
            { href: APP_ROUTES.STAFF_PAYMENTS, label: 'Payment Ledger', icon: CreditCard },
        ],
    },
    { href: APP_ROUTES.STAFF_DOCUMENTS, label: 'Document Repository', icon: FileText, basePath: APP_ROUTES.STAFF_DOCUMENTS },
    { href: APP_ROUTES.STAFF_REPORTS, label: 'Reports', icon: BarChart3, basePath: APP_ROUTES.STAFF_REPORTS },
];

export function StaffSidebar({ isInSheet = false }: { isInSheet?: boolean }) {
    const pathname = usePathname();

    const defaultOpenItems = staffMenuItems
        .filter(item => item.subItems && item.basePath && pathname.startsWith(item.basePath))
        .map(item => item.label);

    return (
        <div
            className={cn(
                "flex flex-col bg-background dark:bg-[oklch(var(--sidebar))] border-r border-border dark:border-[oklch(var(--sidebar-border))]",
                !isInSheet && "hidden md:flex md:w-64",
                isInSheet && "h-full"
            )}
        >
            <div className="flex items-center justify-center h-16 border-b border-border dark:border-[oklch(var(--sidebar-border))] px-4 shrink-0">
                <Link href={APP_ROUTES.STAFF_DASHBOARD} className="text-xl font-bold text-primary dark:text-[oklch(var(--sidebar-foreground))] flex items-center gap-2">
                    Paraiso360
                </Link>
            </div>
            <ScrollArea className="flex-1">
                <nav className="flex flex-col p-4 space-y-1">
                    <Accordion type="multiple" defaultValue={defaultOpenItems} className="w-full">
                        {staffMenuItems.map((item) =>
                            item.subItems && item.subItems.length > 0 ? (
                                <AccordionItem value={item.label} key={item.label} className="border-b-0">
                                    <AccordionTrigger
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-foreground w-full justify-start [&[data-state=open]>svg]:rotate-180",
                                            item.basePath && pathname.startsWith(item.basePath)
                                                ? "text-primary dark:text-primary-foreground"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5 flex-shrink-0" />
                                        <span>{item.label}</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pl-5 pt-1 pb-0 space-y-0.5">
                                        {item.subItems.map((subItem) => (
                                            <Link
                                                key={subItem.href}
                                                href={subItem.href}
                                                className={cn(
                                                    "flex items-center gap-3 pl-3 pr-2 py-2 rounded-md text-xs font-medium transition-colors",
                                                    pathname === subItem.href
                                                        ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground font-semibold"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                )}
                                            >
                                                <span>{subItem.label}</span>
                                            </Link>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            ) : (
                                <Link
                                    key={item.label}
                                    href={item.href!}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                        (item.exact && pathname === item.href) || (!item.exact && item.basePath && pathname.startsWith(item.basePath))
                                            ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground font-semibold"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="h-5 w-5 flex-shrink-0" />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        )}
                    </Accordion>
                </nav>
            </ScrollArea>
            <div className="mt-auto p-4 border-t border-border dark:border-[oklch(var(--sidebar-border))] shrink-0">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20 dark:hover:text-red-400"
                    asChild
                >
                    <Link href={APP_ROUTES.LOGIN}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Link>
                </Button>
            </div>
        </div>
    );
}
