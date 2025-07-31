import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
// TODO: Run `npx shadcn-ui@latest add toaster` and uncomment the following import
// import { Toaster } from "@/components/ui/toaster";

// const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Paraiso360 - Memorial Park Management",
  description: "Modernizing cemetery operations for Paraiso Memorial Park.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          {/* <Toaster /> */}{/* TODO: Uncomment when Toaster is available */}
        </ThemeProvider>
      </body>
    </html>
  );
}
