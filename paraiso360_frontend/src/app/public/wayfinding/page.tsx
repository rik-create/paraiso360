"use client";

import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Keep commented if not present
import { Separator } from '@/components/ui/separator';

import { Search, MapPin, HelpCircle, RotateCcw, Info, ArrowLeft } from 'lucide-react';
import { mockPlots } from '@/lib/mockData';
import type { Plot } from '@/types/paraiso';
import { APP_ROUTES } from '@/lib/constants';

interface SearchResult extends Plot {
    matchReason?: string;
}

export default function WayfindingPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState<'name' | 'lot'>('name');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searched, setSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPlot, setSelectedPlot] = useState<SearchResult | null>(null);
    const [isShowingSampleResults, setIsShowingSampleResults] = useState(false);

    const mapSectionRef = useRef<HTMLDivElement>(null);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResults([]);
            setSearched(true);
            setSelectedPlot(null);
            setIsShowingSampleResults(false);
            return;
        }
        setIsLoading(true);
        setSearched(true);
        setSelectedPlot(null);
        setIsShowingSampleResults(false);

        setTimeout(() => {
            let results: SearchResult[] = [];
            const term = searchTerm.toLowerCase();
            if (searchType === 'name') {
                results = mockPlots
                    .filter(plot =>
                        plot.interredPersons?.some(person =>
                            person.name.toLowerCase().includes(term)
                        )
                    )
                    .map(plot => ({ ...plot, matchReason: "Matched by Deceased Name" }));
            } else if (searchType === 'lot') {
                results = mockPlots
                    .filter(plot =>
                        `${plot.section.toLowerCase()} ${plot.blockNumber.toLowerCase()} ${plot.lotNumber.toLowerCase()}`.includes(term) ||
                        `${plot.section.charAt(0)}${plot.blockNumber}-${plot.lotNumber}`.toLowerCase().includes(term.replace(/[\\s,]+/g, ''))
                    )
                    .map(plot => ({ ...plot, matchReason: "Matched by Lot Details" }));
            }

            if (results.length === 0 && searchTerm.trim() !== '') {
                setIsShowingSampleResults(true);
                results = mockPlots.slice(0, 2).map(plot => ({
                    ...plot,
                    matchReason: "Sample Plot (original search found no matches)"
                }));
            }

            setSearchResults(results);
            setIsLoading(false);
        }, 1000);
    };

    const handleReset = () => {
        setSearchTerm('');
        setSearchResults([]);
        setSearched(false);
        setSelectedPlot(null);
        setIsShowingSampleResults(false);
    };

    const handleViewOnMap = (plot: SearchResult) => {
        setSelectedPlot(plot);
    };

    useEffect(() => {
        if (selectedPlot && mapSectionRef.current) {
            mapSectionRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [selectedPlot]);

    const handleGoBack = () => {
        router.push('/');
    };

    const FallbackSeparator = () => <hr className="my-6 border-gray-200" />;

    return (
        <div className="flex flex-col items-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 md:p-8">
            <Card className="w-full max-w-3xl shadow-xl">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center mb-4">
                        <MapPin size={32} />
                    </div>
                    <CardTitle className="text-3xl font-bold text-primary">Paraiso Memorial Park</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                        Find a Loved One or Locate a Plot
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                    <Button
                        variant="outline"
                        onClick={handleGoBack}
                        className="absolute top-4 left-4 sm:left-6 text-sm py-2 px-3"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>

                    <form onSubmit={handleSearch} className="space-y-6 pt-16 sm:pt-12">
                        <div className="flex space-x-2 mb-4 border p-1 rounded-md bg-slate-100 dark:bg-slate-800">
                            <Button
                                type="button"
                                variant={searchType === 'name' ? 'default' : 'ghost'}
                                onClick={() => setSearchType('name')}
                                className="flex-1"
                            >
                                Search by Name
                            </Button>
                            <Button
                                type="button"
                                variant={searchType === 'lot' ? 'default' : 'ghost'}
                                onClick={() => setSearchType('lot')}
                                className="flex-1"
                            >
                                Search by Lot
                            </Button>
                        </div>

                        <div>
                            <Label htmlFor="searchTerm" className="sr-only">
                                {searchType === 'name' ? 'Deceased Name' : 'Lot Number (e.g., Section A, Block 01, Lot 001)'}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="searchTerm"
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={
                                        searchType === 'name'
                                            ? 'Enter Deceased Name'
                                            : 'Enter Section, Block, Lot (e.g., A 01 001)'
                                    }
                                    className="text-lg p-6 pl-10"
                                    required
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button type="submit" className="w-full sm:w-auto text-lg py-6 flex-grow" disabled={isLoading}>
                                {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : <Search className="mr-2 h-5 w-5" />}
                                Search
                            </Button>
                            <Button type="button" variant="outline" className="w-full sm:w-auto text-lg py-6" onClick={handleReset} disabled={isLoading}>
                                <RotateCcw className="mr-2 h-5 w-5" />
                                Reset
                            </Button>
                        </div>
                    </form>

                    {searched && (
                        <div className="mt-8">
                            <Separator />
                            {isLoading ? (
                                <div className="py-10 text-center">
                                    <svg className="animate-spin mx-auto h-8 w-8 text-primary mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <p className="text-lg text-muted-foreground">Searching for "<strong>{searchTerm}</strong>"...</p>
                                </div>
                            ) : (
                                <>
                                    {isShowingSampleResults && searchTerm.trim() !== '' && (
                                        <div className="p-3 my-4 rounded-md bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 text-sm text-center">
                                            <Info className="h-5 w-5 mr-2 inline-block align-middle" />
                                            Your search for "<strong>{searchTerm}</strong>" didn't find a direct match. Showing sample plots instead.
                                        </div>
                                    )}
                                    {searchResults.length > 0 ? (
                                        <div>
                                            {!(isShowingSampleResults && searchTerm.trim() !== '') && (
                                                <h3 className="text-xl font-semibold mb-4 text-center">
                                                    Search Results ({searchResults.length} found)
                                                </h3>
                                            )}
                                            <div className="space-y-4">
                                                {searchResults.map((plot) => (
                                                    <Card key={plot.id} className="hover:shadow-md transition-shadow">
                                                        <CardHeader>
                                                            <CardTitle className="text-lg">
                                                                {plot.interredPersons && plot.interredPersons.length > 0
                                                                    ? plot.interredPersons.map(p => p.name).join(', ')
                                                                    : 'Plot Information'}
                                                            </CardTitle>
                                                            <CardDescription>
                                                                Lot: {plot.section} - {plot.blockNumber} - {plot.lotNumber} ({plot.type})
                                                                {plot.matchReason && !isShowingSampleResults && <span className="block text-xs text-green-600 dark:text-green-400">({plot.matchReason})</span>}
                                                                {isShowingSampleResults && <span className="block text-xs text-blue-600 dark:text-blue-400">(Sample Plot)</span>}
                                                            </CardDescription>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <p className="text-sm text-muted-foreground">Status: {plot.status}</p>
                                                            {plot.notes && <p className="text-sm text-muted-foreground mt-1">Notes: {plot.notes}</p>}
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                className="mt-3 w-full sm:w-auto"
                                                                onClick={() => handleViewOnMap(plot)}
                                                            >
                                                                <MapPin className="mr-2 h-4 w-4" />
                                                                View on Map (Details)
                                                            </Button>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-md bg-amber-50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700">
                                            <HelpCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 inline-block" />
                                            <h4 className="font-medium mb-1">No Results Found</h4>
                                            <div className="text-sm">
                                                We couldn't find any records matching your search term "<strong>{searchTerm}</strong>". Please check the spelling or try different information.
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {selectedPlot && (
                        <div ref={mapSectionRef} className="mt-8 p-4 border-2 border-dashed border-primary rounded-lg bg-primary/5">
                            <h3 className="text-2xl font-bold mb-4 text-center text-primary">
                                Map Location for: Lot {selectedPlot.section}-{selectedPlot.blockNumber}-{selectedPlot.lotNumber}
                            </h3>
                            <div className="w-full h-96 bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center mb-4 overflow-hidden">
                                <img
                                    src="/cemetery-map-base.jpeg"
                                    alt={`Map showing location of Lot ${selectedPlot.section}-${selectedPlot.blockNumber}-${selectedPlot.lotNumber}`}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <Card className="bg-background">
                                <CardHeader>
                                    <CardTitle>
                                        {selectedPlot.interredPersons && selectedPlot.interredPersons.length > 0
                                            ? selectedPlot.interredPersons.map(p => p.name).join(', ')
                                            : 'Plot Details'}
                                    </CardTitle>
                                    <CardDescription>
                                        Lot: {selectedPlot.section} - {selectedPlot.blockNumber} - {selectedPlot.lotNumber} ({selectedPlot.type})
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm space-y-1">
                                    <p><strong>Status:</strong> {selectedPlot.status}</p>
                                    {selectedPlot.capacity && <p><strong>Capacity:</strong> {selectedPlot.capacity}</p>}
                                    {selectedPlot.dimensions && <p><strong>Dimensions:</strong> {selectedPlot.dimensions}</p>}
                                    {selectedPlot.notes && <p><strong>Notes:</strong> {selectedPlot.notes}</p>}
                                    {selectedPlot.interredPersons && selectedPlot.interredPersons.length > 0 && (
                                        <div className="pt-2">
                                            <h4 className="font-semibold">Interred:</h4>
                                            <ul className="list-disc list-inside pl-2">
                                                {selectedPlot.interredPersons.map(p => <li key={p.name}>{p.name}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                            <Button variant="outline" className="mt-4 w-full" onClick={() => setSelectedPlot(null)}>
                                Close Map View
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            <footer className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
                Powered by Paraiso360 | © {new Date().getFullYear()} Paraiso Memorial Park
            </footer>
        </div>
    );
}