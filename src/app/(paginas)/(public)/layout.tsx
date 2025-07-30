import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/footer";
export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <SidebarProvider>
      <AppSidebar />
      <div className="w-full flex flex-col bg-cinza-light pb-4 pr-4">
        <Header></Header>

        <main
          className="w-full h-full bg-branco p-2"
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

  )
}