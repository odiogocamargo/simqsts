import { LayoutDashboard, FileText, List, Users, Plug, Loader2 } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useUserRole } from "@/hooks/useUserRole";
import { cn } from "@/lib/utils";

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

const adminNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Questões", url: "/questions", icon: FileText },
  { title: "Taxonomia", url: "/taxonomy-migration", icon: List },
  { title: "Usuários", url: "/users", icon: Users },
  { title: "Integrações", url: "/integrations", icon: Plug },
];

const professorNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Questões", url: "/questions", icon: FileText },
];

export function AppSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const { role, isLoading } = useUserRole();

  const navItems = isLoading
    ? []
    : role === "admin"
    ? adminNavItems
    : role === "professor"
    ? professorNavItems
    : [];

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible={isMobile ? "offcanvas" : "icon"} className="border-r border-border/50 bg-background">
      <SidebarContent className="flex flex-col h-full">
        <div className={cn(
          "flex items-center border-b border-border/50 shrink-0",
          isCollapsed ? "justify-center p-2" : "gap-3 p-4"
        )}>
          <div className={cn(
            "rounded-xl bg-primary flex items-center justify-center shrink-0",
            isCollapsed ? "h-8 w-8" : "h-10 w-10"
          )}>
            <span className={cn("text-primary-foreground font-bold tracking-tight", isCollapsed ? "text-xs" : "text-base")}>SQ</span>
          </div>
          {!isCollapsed && (
            <div className="animate-slide-in">
              <h1 className="text-base font-bold text-foreground tracking-tight">Sim Questões</h1>
              <p className="text-xs text-muted-foreground font-medium">Banco de questões</p>
            </div>
          )}
        </div>

        <SidebarGroup className="mt-2 flex-1">
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider">Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            {isLoading ? (
              <div className="px-3 py-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {!isCollapsed && <span>Carregando menu...</span>}
                </div>
              </div>
            ) : (
              <SidebarMenu className="space-y-1">
                {navItems.map((item, index) => (
                  <SidebarMenuItem key={item.title} style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-in">
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className="flex items-center gap-3 rounded-xl transition-all duration-200 hover:bg-secondary"
                        activeClassName="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => { if (isMobile) setOpenMobile(false); }}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!isCollapsed && <span className="font-medium">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
