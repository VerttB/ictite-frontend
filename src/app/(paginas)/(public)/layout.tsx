import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {Header} from "@/components/header";
export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
    return(
  <>
       <SidebarProvider>
        <AppSidebar/>

          <main className="w-full">
          <Header></Header>
            <SidebarTrigger/>
            {children}
          </main>
       </SidebarProvider>
       </>
    )
}