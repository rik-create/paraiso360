import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X, Edit, UserCircle, CalendarDays, Info, MapPin, CreditCard, LinkIcon } from 'lucide-react';
import { Plot, Client } from '@/types/paraiso';
import { mockPlots, mockClients } from '@/lib/mockData';
import { PLOT_STATUSES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

interface PlotDetailPanelProps {
    plotId: string | null;
    onClose: () => void;
    isMobileView?: boolean;
}

const getStatusBadgeVariant = (status: Plot['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case PLOT_STATUSES.AVAILABLE: return "default";
        case PLOT_STATUSES.RESERVED: return "secondary";
        case PLOT_STATUSES.OCCUPIED: return "destructive";
        case PLOT_STATUSES.MAINTENANCE: return "outline";
        default: return "outline";
    }
};

export function PlotDetailPanel({ plotId, onClose, isMobileView }: PlotDetailPanelProps) {
    const [plot, setPlot] = useState<Plot | null>(null);
    const [owner, setOwner] = useState<Client | null>(null);

    // Mock data for new fields - in a real app, this would come from plot object
    const [plotPaymentSummary, setPlotPaymentSummary] = useState<string | null>(null);
    const [plotCoordinates, setPlotCoordinates] = useState<{ lat: string; lon: string } | null>(null);

    useEffect(() => {
        if (plotId) {
            const foundPlot = mockPlots.find(p => p.id === plotId);
            setPlot(foundPlot || null);
            if (foundPlot?.ownerClientId) {
                const foundOwner = mockClients.find(c => c.id === foundPlot.ownerClientId);
                setOwner(foundOwner || null);
                // Mock payment summary based on owner and plot status
                if (foundPlot.status === PLOT_STATUSES.OCCUPIED && foundPlot.id.includes("S1")) {
                    setPlotPaymentSummary("Fully Paid");
                } else if (foundPlot.status === PLOT_STATUSES.RESERVED) {
                    setPlotPaymentSummary("Installment - ₱25,000 remaining");
                } else {
                    setPlotPaymentSummary("N/A");
                }
            } else {
                setOwner(null);
                setPlotPaymentSummary("N/A");
            }
            // Mock coordinates
            if (foundPlot?.id.includes("S1P01")) {
                setPlotCoordinates({ lat: "14.5505° N", lon: "121.0470° E" });
            } else if (foundPlot?.id.includes("S2P02")) {
                setPlotCoordinates({ lat: "14.5515° N", lon: "121.0480° E" });
            } else {
                setPlotCoordinates(null);
            }
        } else {
            setPlot(null);
            setOwner(null);
            setPlotPaymentSummary(null);
            setPlotCoordinates(null);
        }
    }, [plotId]);

    if (!plotId || !plot) {
        return null;
    }

    return (
        <Card className={`w-full flex flex-col shadow-lg ${isMobileView ? 'flex-1 min-h-0 border-none shadow-none rounded-none' : 'md:w-95 h-full'}`}>
            {!isMobileView && (
                <CardHeader className="flex flex-row items-center justify-between p-4 border-b flex-shrink-0">
                    <CardTitle className="text-lg break-words">Plot Details: {plot.id}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close panel">
                        <X className="h-5 w-5" />
                    </Button>
                </CardHeader>
            )}
            <CardContent className={`p-4 space-y-4 overflow-y-auto flex-1 min-h-0 ${isMobileView ? 'pb-4' : ''}`}>
                <div>
                    <h3 className="text-sm font-medium mb-1.5">Location</h3>
                    <p className="text-sm break-words">Section: {plot.section}, Block: {plot.blockNumber}, Lot: {plot.lotNumber}</p>
                </div>
                <Separator />
                <div>
                    <h3 className="text-sm font-medium mb-1.5">Status & Type</h3>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getStatusBadgeVariant(plot.status)}>{plot.status}</Badge>
                        <span className="text-sm text-muted-foreground">|</span>
                        <p className="text-sm">{plot.type}</p>
                    </div>
                    {plot.dimensions && <p className="text-sm text-muted-foreground break-words">Dimensions: {plot.dimensions}</p>}
                    {plot.capacity && <p className="text-sm text-muted-foreground">Capacity: {plot.capacity} interment(s)</p>}
                </div>

                <Separator />

                {owner && (
                    <div>
                        <h3 className="text-sm font-medium mb-1.5">Owner Information</h3>
                        <div className="flex items-center gap-2 mb-1">
                            <UserCircle className="h-5 w-5 text-primary" />
                            {/* Making owner name look like a link */}
                            <button
                                className="text-sm font-semibold text-primary hover:underline p-0 h-auto"
                                onClick={() => alert(`Navigate to profile of ${owner.firstName} ${owner.lastName}`)}
                                aria-label={`View profile of ${owner.firstName} ${owner.lastName}`}
                            >
                                {owner.firstName} {owner.lastName}
                            </button>
                        </div>
                        <p className="text-sm text-muted-foreground pl-7 break-words mt-1">{owner.contactNumber}</p>
                        {plot.purchaseDate && <p className="text-sm text-muted-foreground pl-7 break-words mt-1">Purchased: {formatDate(plot.purchaseDate)}</p>}
                        {plot.reservationDate && plot.status === PLOT_STATUSES.RESERVED && <p className="text-sm text-muted-foreground pl-7 break-words mt-1">Reserved: {formatDate(plot.reservationDate)}</p>}

                        {/* Payment Summary for this plot */}
                        <div className="mt-2 pl-7">
                            <p className="text-xs font-medium text-muted-foreground">Payment Summary (Plot):</p>
                            <p className="text-sm">{plotPaymentSummary || "N/A"}</p>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 ml-7"
                            onClick={() => alert(`Viewing full payment history for plot ${plot.id} / client ${owner.id}`)}
                        >
                            <CreditCard className="mr-2 h-4 w-4" /> View Full Payment History
                        </Button>
                    </div>
                )}
                {!owner && plot.status !== PLOT_STATUSES.AVAILABLE && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Info className="h-4 w-4" /> Owner information not available.
                    </div>
                )}
                {!owner && plot.status === PLOT_STATUSES.AVAILABLE && (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <Info className="h-4 w-4" /> This plot is currently available.
                    </div>
                )}

                {plotCoordinates && (
                    <>
                        <Separator />
                        <div>
                            <h3 className="text-sm font-medium mb-1.5">GIS/Map Information</h3>
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                Coordinates: {plotCoordinates.lat}, {plotCoordinates.lon}
                            </div>
                        </div>
                    </>
                )}

                {plot.interredPersons && plot.interredPersons.length > 0 && (
                    <>
                        <Separator />
                        <div>
                            <h3 className="text-sm font-medium mb-2">Interred Person(s)</h3>
                            {plot.interredPersons.map((person, index) => (
                                <div key={index} className="mb-2 p-2 border rounded-md bg-secondary/50 dark:bg-secondary/30">
                                    <p className="font-semibold text-sm break-words">{person.name}</p>
                                    <div className="text-sm text-muted-foreground break-words">
                                        {person.dateOfBirth && <span>Born: {formatDate(person.dateOfBirth)} | </span>}
                                        Died: {formatDate(person.dateOfDeath)}
                                    </div>
                                    <p className="text-sm text-muted-foreground break-words">Interred: {formatDate(person.dateOfInterment)}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {plot.notes && (
                    <>
                        <Separator />
                        <div>
                            <h3 className="text-sm font-medium mb-1.5">Notes</h3>
                            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{plot.notes}</p>
                        </div>
                    </>
                )}
                {isMobileView && (
                    <div className="pt-4 mt-4 border-t">
                        <Button className="w-full" onClick={() => alert(`Editing plot: ${plot.id}`)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Plot Details
                        </Button>
                    </div>
                )}
            </CardContent>
            {!isMobileView && (
                <div className="p-4 border-t mt-auto flex-shrink-0">
                    <Button className="w-full" onClick={() => alert(`Editing plot: ${plot.id}`)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Plot Details
                    </Button>
                </div>
            )}
        </Card>
    );
}