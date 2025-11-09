import { LayoutDashboard, FileText, PlusCircle } from "lucide-react";
import { NavLink } from "@/components/NavLink";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Questões", url: "/questions", icon: FileText },
  { title: "Adicionar Questão", url: "/add-question", icon: PlusCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>
        {/* Logo/Header */}
        <div className="flex items-center gap-2 p-4 border-b">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-sm">BQ</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-sm font-bold text-foreground">Banco de Questões</h1>
              <p className="text-xs text-muted-foreground">Sistema de Gestão</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 hover:bg-secondary"
                      activeClassName="bg-primary text-primary-foreground hover:bg-primary"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
