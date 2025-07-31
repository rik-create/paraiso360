"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Layers } from 'lucide-react';
import { InteractiveMap } from '@/components/modules/lots/InteractiveMap';
import { PlotDetailPanel } from '@/components/modules/lots/PlotDetailPanel';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import type { BreadcrumbItem } from '@/types/paraiso';
import { APP_ROUTES } from '@/lib/constants';
import { useToast } from "@/components/ui/sonner";

export default function InteractiveMapPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);
    const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
    const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(false);

    // State for plot type filters
    const [showSold, setShowSold] = useState(true);
    const [showDiamond, setShowDiamond] = useState(true);
    const [showPlatinum, setShowPlatinum] = useState(true);
    const [showGold, setShowGold] = useState(true);

    const toast = useToast();

    const handlePlotSelect = useCallback((plotId: string) => {
        setSelectedPlotId(plotId);
        if (window.innerWidth < 768) {
            setIsMobileSheetOpen(true);
        }
        console.log(`Plot selected: ${plotId}. Desktop panel should show if >md. Mobile sheet should open if <md.`);
    }, []);

    const handleCloseDetail = useCallback(() => {
        setSelectedPlotId(null);
        setIsMobileSheetOpen(false);
        console.log("Detail panel/sheet closed.");
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
        if (searchTerm.trim() !== '') {
            if (searchTerm.toLowerCase() === 'plot_s1p01_001') {
                handlePlotSelect('plot_S1P01_001');
            } else {
                toast.info("Search", {
                    description: `Search for "${searchTerm}" initiated. Pan/zoom to results if found.`
                });
            }
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Dashboard", href: APP_ROUTES.STAFF_DASHBOARD },
        { label: "Lot Management", href: APP_ROUTES.STAFF_LOT_INVENTORY },
        { label: "Interactive Map" },
    ];

    useEffect(() => {
        if (!selectedPlotId) {
            setIsMobileSheetOpen(false);
        }
    }, [selectedPlotId]);

    const MapControls = () => (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto justify-center md:justify-start">
                        <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                        checked={showSold}
                        onCheckedChange={setShowSold}
                    >
                        Sold
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={showDiamond}
                        onCheckedChange={setShowDiamond}
                    >
                        Diamond
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={showPlatinum}
                        onCheckedChange={setShowPlatinum}
                    >
                        Platinum
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={showGold}
                        onCheckedChange={setShowGold}
                    >
                        Gold
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" disabled className="w-full md:w-auto justify-center md:justify-start">
                <Layers className="mr-2 h-4 w-4" /> Layers
            </Button>
        </>
    );

    return (
        <PageWrapper
            title="Interactive Cemetery Map"
            className="p-0 md:p-0 sm:p-0 !max-w-full"
            breadcrumbs={breadcrumbs}
            contentClassName="p-0 flex-1 flex"
        >
            <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
                <div className="flex-1 relative p-2 md:p-4 flex flex-col">
                    <div className="mb-4 flex flex-col gap-2 flex-shrink-0">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-grow">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search by Plot ID, Owner..."
                                    className="pl-8 w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button type="submit">Search</Button>
                        </form>

                        <div className="md:hidden">
                            <Dialog open={isMobileControlsOpen} onOpenChange={setIsMobileControlsOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full justify-center">
                                        <Filter className="mr-2 h-4 w-4" /> Filters & Layers
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-xs">
                                    <DialogHeader>
                                        <DialogTitle>Map Controls</DialogTitle>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-4 py-4">
                                        <MapControls />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="hidden md:flex gap-2">
                            <MapControls />
                        </div>
                    </div>

                    <div className="flex-1 relative bg-muted rounded-md">
                        <InteractiveMap
                            selectedPlotId={selectedPlotId}
                            onPlotSelect={handlePlotSelect}
                            filters={{ showSold, showDiamond, showPlatinum, showGold }}
                        />
                    </div>
                </div>

                {selectedPlotId && (
                    <div className="hidden md:block w-80 lg:w-96 border-l bg-background dark:bg-gray-850/80 h-full overflow-y-auto shadow-lg flex-shrink-0">
                        <PlotDetailPanel plotId={selectedPlotId} onClose={handleCloseDetail} />
                    </div>
                )}
            </div>

            <Sheet open={isMobileSheetOpen} onOpenChange={(open) => {
                if (!open) {
                    handleCloseDetail();
                }
            }}>
                <SheetContent side="bottom" className="h-[70vh] flex flex-col p-0 md:hidden">
                    {selectedPlotId ? (
                        <>
                            <SheetHeader className="p-4 border-b flex-shrink-0">
                                <SheetTitle>Plot Details</SheetTitle>
                            </SheetHeader>
                            <PlotDetailPanel plotId={selectedPlotId} onClose={handleCloseDetail} isMobileView={true} />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">Select a plot on the map to see details.</p>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </PageWrapper>
    );
}