import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { LotTypeLegend } from './LotStatusLegend';

interface InteractiveMapProps {
    selectedPlotId?: string | null;
    onPlotSelect?: (plotId: string) => void;
    filters?: {
        showSold: boolean;
        showDiamond: boolean;
        showPlatinum: boolean;
        showGold: boolean;
    };
}

export function InteractiveMap({ selectedPlotId, onPlotSelect, filters }: InteractiveMapProps) {
    const handleMockPlotClick = (plotId: string) => {
        if (onPlotSelect) {
            onPlotSelect(plotId);
        }
    };

    return (
        <Card className="w-full flex flex-col min-h-[64vh]">
            <CardContent className="p-2 flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md relative overflow-hidden">
                {/* Image background */}
                <img
                    src="/cemetery-map-base.jpeg" // Assuming this image is in the public folder
                    alt="Cemetery Map"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />

                {/* Overlay content */}
                <div className="relative z-10 text-center text-gray-700 dark:text-gray-300 bg-white/70 dark:bg-black/70 p-4 rounded-md">
                    <AlertCircle className="mx-auto h-10 w-10 mb-1" />
                    <p className="text-md font-semibold">Interactive Map Area</p>
                    <p className="text-xs">
                        [ Map library will be integrated here. Image is a placeholder. ]
                    </p>
                    <div className="mt-3 flex flex-wrap justify-center gap-1">
                        <button
                            onClick={() => handleMockPlotClick('plot_S1P01_001')}
                            className="text-xs p-1 border rounded bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            Simulate Select Plot S1P01_001
                        </button>
                        <button
                            onClick={() => handleMockPlotClick('plot_S2P02_005')}
                            className="text-xs p-1 border rounded bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            Simulate Select Plot S2P02_005
                        </button>
                    </div>
                    {selectedPlotId && (
                        <p className="mt-1 text-xs bg-black/50 text-white p-1 rounded">Mock Selected Plot ID: {selectedPlotId}</p>
                    )}
                </div>

                <div className="absolute bottom-2 right-2 z-10">
                    <LotTypeLegend />
                </div>
            </CardContent>
        </Card>
    );
}