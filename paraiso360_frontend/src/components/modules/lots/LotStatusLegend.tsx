import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
// Removed PLOT_STATUSES import as it's no longer directly used for iteration
// import { PLOT_STATUSES } from '@/lib/constants';

interface LegendItemProps {
    colorClass: string;
    label: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ colorClass, label }) => (
    <div className="flex items-center gap-2">
        <span className={`h-4 w-4 rounded-sm ${colorClass} border border-slate-300 dark:border-slate-700`}></span>
        <span className="text-xs text-muted-foreground">{label}</span>
    </div>
);

// Define the legend items
const lotTypeLegendItems = [
    { label: "Sold", colorClass: 'bg-red-400 dark:bg-red-600' },
    { label: "Diamond", colorClass: 'bg-cyan-400 dark:bg-cyan-600' },
    { label: "Platinum", colorClass: 'bg-purple-400 dark:bg-purple-600' },
    { label: "Gold", colorClass: 'bg-amber-400 dark:bg-amber-600' },
];

export function LotTypeLegend() {
    // Optional: control default open state if needed
    // const [isOpen, setIsOpen] = React.useState(true);

    return (
        <Collapsible
            // open={isOpen} // Control state if needed
            // onOpenChange={setIsOpen} // Control state if needed
            className="w-full md:w-48 space-y-1" // Set a width and space
        >
            <CollapsibleTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium shadow-sm data-[state=open]:bg-muted"
                >
                    Lot Type Legend
                    <ChevronsUpDown className="h-4 w-4 ml-2 opacity-60" />
                    <span className="sr-only">Toggle Legend</span>
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
                {/* Card now only contains the content, wrapped in CollapsibleContent */}
                <Card className="w-full shadow-sm border border-border">
                    <CardContent className="p-3 grid grid-cols-2 sm:grid-cols-1 gap-2">
                        {lotTypeLegendItems.map((item) => (
                            <LegendItem key={item.label} colorClass={item.colorClass} label={item.label} />
                        ))}
                    </CardContent>
                </Card>
            </CollapsibleContent>
        </Collapsible>
    );
} 