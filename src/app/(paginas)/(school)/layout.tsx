"use client";

import { SidebarProvider } from "@/components/ui/sidebar";

export default function SchoolLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <SidebarProvider>{children}</SidebarProvider>;
}
