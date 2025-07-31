"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, LogIn, Search, FileText, Users } from 'lucide-react';
import { APP_ROUTES } from '@/lib/constants';
import Image from 'next/image';

function LandingPageNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* <Image src="/paraiso-logo.png" alt="Paraiso Memorial Park Logo" width={40} height={40} /> */}
          <span className="text-xl font-bold text-primary">Paraiso360</span>
        </Link>
      </div>
    </nav>
  );
}

export default function LandingPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-green-50 via-sky-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
      <LandingPageNavbar />
      {/* Hero Section */}
      <main className="flex-1 overflow-y-auto">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 md:pt-28 md:pb-16 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Welcome to <span className="text-primary">Paraiso Memorial Park</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            A serene final resting place, managed with care and modern efficiency through our Paraiso360 system.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="lg" asChild className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow">
              <Link href={APP_ROUTES.PUBLIC_WAYFINDING}>
                <MapPin className="mr-2 h-5 w-5" /> Locate a Loved One
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow">
              <Link href={APP_ROUTES.LOGIN}>
                <LogIn className="mr-2 h-5 w-5" /> Staff & Admin Portal
              </Link>
            </Button>
          </div>
        </section>

        {/* About Paraiso360 Section */}
        <section id="about-system" className="py-12 md:py-16 bg-white dark:bg-gray-800/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Introducing <span className="text-primary">Paraiso360</span>
              </h2>
              <p className="mt-2 max-w-xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                Our dedicated digital platform designed to enhance the management and visitor experience at Paraiso Memorial Park.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              {/* Feature Card 1 */}
              <div className="p-4 bg-card dark:bg-card rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Search className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-1 text-card-foreground dark:text-card-foreground">Easy Grave Location</h3>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Our intuitive digital map helps visitors quickly find specific burial plots.
                </p>
              </div>
              {/* Feature Card 2 */}
              <div className="p-4 bg-card dark:bg-card rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <FileText className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-1 text-card-foreground dark:text-card-foreground">Efficient Record Keeping</h3>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Centralized digital records for clients, plots, and payments.
                </p>
              </div>
              {/* Feature Card 3 */}
              <div className="p-4 bg-card dark:bg-card rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-1 text-card-foreground dark:text-card-foreground">Streamlined Operations</h3>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Empowering staff with modern tools for better service and management.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="py-4 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Paraiso Memorial Park. All Rights Reserved.</p>
          <p className="mt-1">Powered by Paraiso360</p>
        </div>
      </footer>
    </div>
  );
}
