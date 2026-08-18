"use client";

import { RoleGuard } from "@/components/RoleGuard";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function SchoolLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
            <RoleGuard allowedRoles={["SCHOOL_ADMIN", "ADMIN"]}>
                <SidebarProvider>{children}</SidebarProvider>
            </RoleGuard>
            );
}
