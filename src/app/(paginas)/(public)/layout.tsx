import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/core/providers/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <ThemeProvider>
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full flex flex-col bg-foreground pb-4 pr-4">
        <Header></Header>

        <main
          className="w-full h-full bg-background p-2"
          style={{
            boxShadow: "inset 0px 0px 5px rgba(0, 0, 0, .5)",
            borderRadius: "10px 10px 10px 10px"
          }}
        >
          <SidebarTrigger />
          <Toaster />
          {children}
        </main>
        <Footer />
      </div>
    </SidebarProvider>
</ThemeProvider>
  )
}