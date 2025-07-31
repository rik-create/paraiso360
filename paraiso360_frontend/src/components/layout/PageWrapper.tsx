import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import type { BreadcrumbItem } from '@/types/paraiso';

interface PageWrapperProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    titleClassName?: string;
    description?: string;
    descriptionClassName?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: React.ReactNode;
    contentClassName?: string;
}

export function PageWrapper({
    children,
    className,
    title,
    titleClassName,
    description,
    descriptionClassName,
    breadcrumbs,
    actions,
    contentClassName,
}: PageWrapperProps) {
    return (
        <div className={cn("flex flex-col flex-1", className)}>
            <div className="px-4 sm:px-6 py-4 md:py-6 space-y-3 md:space-y-4">
                {/* Breadcrumbs Section */}
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav aria-label="Breadcrumb" className="mb-1 md:mb-2">
                        <ol className="flex items-center space-x-1 text-xs sm:text-sm text-muted-foreground">
                            {breadcrumbs.map((crumb, index) => (
                                <li key={index} className="flex items-center">
                                    {crumb.href ? (
                                        <Link
                                            href={crumb.href}
                                            className="hover:text-primary transition-colors"
                                        >
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span className="font-medium text-foreground">{crumb.label}</span>
                                    )}
                                    {index < breadcrumbs.length - 1 && (
                                        <ChevronRight className="h-4 w-4 mx-1" />
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}

                {/* Page Header: Title, Description, and Actions */}
                {(title || description || actions) && (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-0.5">
                            {title && (
                                <h1 className={cn("text-2xl font-bold tracking-tight sm:text-3xl", titleClassName)}>
                                    {title}
                                </h1>
                            )}
                            {description && (
                                <p className={cn("text-sm text-muted-foreground", descriptionClassName)}>
                                    {description}
                                </p>
                            )}
                        </div>
                        {actions && <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">{actions}</div>}
                    </div>
                )}
            </div>
            {/* Main Content Area */}
            <div className={cn("flex-1 px-4 sm:px-6 pb-4 md:pb-6", contentClassName)}>
                {children}
            </div>
        </div>
    );
} 