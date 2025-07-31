import { LoginForm } from '@/components/modules/auth/LoginForm';
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Login - Paraiso360 Portal',
    description: 'Access your Paraiso360 staff or administrator account.',
};

export default function LoginPage() {
    return (
        // Using a gradient for a slightly more polished background
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-stone-200 dark:from-gray-900 dark:via-slate-800 dark:to-neutral-900 p-4 relative">
            {/* Back button positioned in top left */}
            <div className="absolute top-4 left-4">
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="gap-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4" /> Back to Home
                    </Link>
                </Button>
            </div>

            {/* Optional: You could add a header/logo above the login form if not part of LoginForm itself */}
            {/* <div className="mb-8 text-center">
        <Image src="/paraiso-logo-large.png" alt="Paraiso Memorial Park" width={120} height={120} />
      </div> */}
            <LoginForm />
            <p className="mt-8 text-xs text-center text-muted-foreground">
                © {new Date().getFullYear()} Paraiso Memorial Park. All rights reserved.
            </p>
        </div>
    );
}