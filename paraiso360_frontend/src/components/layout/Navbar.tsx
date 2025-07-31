"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search as SearchIcon, Bell, Sun, Moon, UserCircle } from 'lucide-react'; // Assuming these icons
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { StaffSidebar } from './StaffSidebar';
// import { AdminSidebar } from './AdminSidebar'; // Assuming AdminSidebar is a separate component if needed
import { APP_ROUTES } from '@/lib/constants';
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

// Mock user data - replace with actual auth context
const mockUser = {
    name: "Staff Member",
    email: "staff@example.com",
    role: "staff", // or "admin"
};

export function Navbar() {
    const pathname = usePathname();
    const adminBasePath = ('ADMIN_BASE_PATH' in APP_ROUTES) ? APP_ROUTES.ADMIN_BASE_PATH : '/admin';
    const isAdminPath = pathname.startsWith(adminBasePath as string); // Cast to string as TS might still see it as potentially undefined from APP_ROUTES type
    const { theme, setTheme } = useTheme();
    const [currentUser, setCurrentUser] = useState(mockUser); // Replace with actual user from context
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // In a real app, you'd fetch user data here or get it from a context
        // For now, we'll just use the mockUser and simulate role based on path for sidebar demo
        if (isAdminPath) {
            setCurrentUser(prev => ({ ...prev, role: 'admin' })); // Example: change role if on admin path
        } else {
            setCurrentUser(prev => ({ ...prev, role: 'staff' }));
        }
    }, [isAdminPath]);

    if (!isMounted) {
        return null; // Avoid hydration mismatch
    }

    // Choose which sidebar to render in the sheet
    // For this example, let's assume AdminSidebar is structurally similar or the same as StaffSidebar for now
    // If AdminSidebar is very different, you would import and use it here.
    const MobileSidebarComponent = isAdminPath ? StaffSidebar : StaffSidebar; // Replace second StaffSidebar with AdminSidebar if available

    const staffProfilePath = ('STAFF_PROFILE' in APP_ROUTES) ? APP_ROUTES.STAFF_PROFILE : '/';
    const settingsPath = ('SETTINGS' in APP_ROUTES) ? APP_ROUTES.SETTINGS : '/';
    const loginPath = ('LOGIN' in APP_ROUTES && typeof APP_ROUTES.LOGIN === 'string') ? APP_ROUTES.LOGIN : '/auth/login'; // Ensured string and default

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 dark:bg-gray-850/95 dark:supports-[backdrop-filter]:bg-gray-850/60">
            {(pathname.startsWith('/staff') || pathname.startsWith('/admin')) && (
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 flex flex-col w-64 sm:w-72">
                            <SheetHeader className="p-4 border-b flex-shrink-0">
                                <SheetTitle>Navigation Menu</SheetTitle>
                            </SheetHeader>
                            <MobileSidebarComponent isInSheet={true} />
                        </SheetContent>
                    </Sheet>
                </div>
            )}

            <div className="flex-1 flex items-center">
                {/* Dynamic Page Title (Example) */}
                <h1 className="text-lg font-semibold hidden md:block">
                    {isAdminPath ? 'Admin Portal' : 'Staff Portal'}
                </h1>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
                {/* Global Search (Optional) */}
                <form className="ml-auto flex-initial hidden sm:flex-initial">
                    <div className="relative">
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background"
                        />
                    </div>
                </form>

                {/* Theme Toggle */}
                <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                    <span className="sr-only">Toggle theme</span>
                </Button>

                {/* Notifications (Placeholder) */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Bell className="h-[1.2rem] w-[1.2rem]" />
                            <span className="sr-only">Notifications</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>No new notifications</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <UserCircle className="h-6 w-6" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {currentUser.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={staffProfilePath as string}>Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={settingsPath as string}>Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link
                                href={loginPath as string}
                                className="block w-full px-2 py-1.5 text-sm text-left hover:bg-accent focus:bg-accent focus:outline-none rounded-sm data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                            >
                                Logout
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
} 