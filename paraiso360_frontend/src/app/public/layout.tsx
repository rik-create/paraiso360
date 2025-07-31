import React from 'react';
import { Toaster } from "@/components/ui/sonner";


// You could add a simple public-facing header or footer here if needed
// For example, a header with just the Paraiso Memorial Park logo and name.

/*
const PublicHeader = () => (
  <header className="py-4 px-6 bg-green-700 text-white shadow-md">
    <div className="container mx-auto text-center">
      <h1 className="text-2xl font-bold">Paraiso Memorial Park</h1>
    </div>
  </header>
);

const PublicFooter = () => (
  <footer className="py-4 px-6 bg-gray-100 text-gray-600 text-center text-sm">
    © {new Date().getFullYear()} Paraiso Memorial Park. All rights reserved.
  </footer>
);
*/

export default function PublicPagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <> {/* Using fragment as RootLayout from src/app/layout.tsx will provide <html> and <body> */}
            {/* <PublicHeader /> */}
            <main className="flex-1"> {/* Ensure content can fill space if footer is present */}
                {children}
            </main>
            {/* <PublicFooter /> */}
            <Toaster />
        </>
    );
} 