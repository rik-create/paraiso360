import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface DataCardField {
    label: string;
    value: React.ReactNode;
    className?: string;
}

interface DataCardAction {
    label: string;
    onClick: () => void;
    variant?: React.ComponentProps<typeof Button>['variant'];
    icon?: React.ReactNode;
}

interface DataCardProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    fields: DataCardField[];
    actions?: DataCardAction[];
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    footerClassName?: string;
    onCardClick?: () => void;
}

export function DataCard({
    title,
    description,
    icon,
    fields,
    actions,
    className,
    headerClassName,
    contentClassName,
    footerClassName,
    onCardClick,
}: DataCardProps) {
    const cardContent = (
        <>
            <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", headerClassName)}>
                <div className="flex flex-col">
                    <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </div>
                {icon && <div className="text-muted-foreground">{icon}</div>}
            </CardHeader>
            <CardContent className={cn("space-y-3 pt-4", contentClassName)}>
                {fields.map((field, index) => (
                    <div key={index} className={cn("flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm", field.className)}>
                        <span className="font-medium text-muted-foreground min-w-[120px] sm:min-w-0 mb-1 sm:mb-0">{field.label}:</span>
                        <span className="text-right sm:text-left break-words">{field.value}</span>
                    </div>
                ))}
            </CardContent>
            {actions && actions.length > 0 && (
                <>
                    <Separator className="my-2" />
                    <CardFooter className={cn("flex flex-wrap justify-end gap-2 pt-4 mt-auto", footerClassName)}>
                        {actions.map((action, index) => (
                            <Button key={index} variant={action.variant || "outline"} size="sm" onClick={action.onClick}>
                                {action.icon && <span className="mr-2">{action.icon}</span>}
                                {action.label}
                            </Button>
                        ))}
                    </CardFooter>
                </>
            )}
        </>
    );

    return onCardClick ? (
        <button
            onClick={onCardClick}
            className={cn("w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg", className)}
            aria-label={`View details for ${title}`}
        >
            <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
                {cardContent}
            </Card>
        </button>
    ) : (
        <Card className={cn("h-full flex flex-col", className)}>
            {cardContent}
        </Card>
    );
} 