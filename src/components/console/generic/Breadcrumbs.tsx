import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Route } from "next";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
    return (
        <nav className={cn("mb-4 flex", className)} aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
                <li>
                    <Link
                        href={"/console/v2" as Route}
                        className="text-muted-foreground hover:text-foreground flex items-center transition-colors">
                        <Home size={16} className="mr-1" />
                        <span className="sr-only">Console</span>
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <ChevronRight size={16} className="text-muted-foreground mx-1" />
                        {item.href ? (
                            <Link
                                href={item.href as Route}
                                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-foreground text-sm font-medium">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};
