"use client";

import React from "react";

// RootAppShell is the outermost shell for the app.
// In the future, wrap children with global providers (e.g., AuthProvider, ThemeProvider, QueryClientProvider) here.
// For now, it simply passes children through for UI prototyping.

export interface RootAppShellProps {
    children: React.ReactNode;
}

export function RootAppShell({ children }: RootAppShellProps) {
    // Example: Add context providers here as needed in the future.
    return <>{children}</>;
} 