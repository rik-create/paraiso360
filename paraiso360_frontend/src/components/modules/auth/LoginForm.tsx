"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (username.toLowerCase() === 'staff' && password === 'password') {
            router.push('/staff/dashboard');
        } else if (username.toLowerCase() === 'admin' && password === 'adminpass') {
            router.push('/admin/dashboard');
        } else {
            setError('Invalid username or password. Try "staff"/"password" or "admin"/"adminpass".');
        }
        setIsLoading(false);
    };

    return (
        <Card className="w-full max-w-sm shadow-xl">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center font-bold">Paraiso360 Login</CardTitle>
                <CardDescription className="text-center">
                    Enter your credentials to access the system.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username / Email</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="e.g., staff or admin"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link href="#" className="text-xs text-primary hover:underline">
                                Forgot Password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="e.g., password or adminpass"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                    {error && <p className="text-sm text-destructive text-center">{error}</p>}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
} 