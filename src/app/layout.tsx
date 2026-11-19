import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./global.css";
import UserProvider from "@/providers/UserContext";
import { ThemeProvider } from "@/core/providers/ThemeProvider";
import { getAssetPrefix } from "@/core/utils/api";

const icon = `${getAssetPrefix()}/logo_icon.png`;

export const metadata: Metadata = {
    title: "ICTITE - Plataforma Ciência Mais Bahia",
    description: "Plataforma do projeto da Ciência Mais Bahia - Rede ICTITE",
    icons: {
        icon: [{ url: icon }],
        shortcut: icon,
        apple: icon,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
                <GoogleAnalytics />
                <ThemeProvider>
                    <UserProvider>{children}</UserProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
