"use client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/components/cart-provider";
import { FavoritesProvider } from "@/components/favorites-provider";
export function Providers({ children }: { children: React.ReactNode }) { return <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light"><FavoritesProvider><CartProvider>{children}<Toaster position="bottom-center" richColors /></CartProvider></FavoritesProvider></ThemeProvider>; }
