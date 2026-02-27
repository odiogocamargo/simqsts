import { LayoutDashboard, FileText, TrendingUp, BookOpen, List, Users, Download, CreditCard, Crown, Loader2, Receipt, ClipboardList } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

// Itens de navegação para admin (acesso total)
const adminNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Questões", url: "/questions", icon: FileText },
  { title: "Relatório de Taxonomia", url: "/subject-report", icon: List },
  { title: "Usuários", url: "/users", icon: Users },
  { title: "Assinaturas", url: "/subscriptions", icon: Receipt },
  { title: "Exportar Taxonomia", url: "/taxonomy-export", icon: Download },
];

// Itens de navegação para professor (apenas questões)
const professorNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Questões", url: "/questions", icon: FileText },
];

// Itens de navegação para aluno (apenas funcionalidades pedagógicas)
const studentNavItems = [
  { title: "Meu Desempenho", url: "/student", icon: TrendingUp },
  { title: "Questões", url: "/student/questions", icon: BookOpen },
  { title: "Simulados", url: "/student/simulations", icon: ClipboardList },
];

export function AppSidebar() {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const { role, isLoading } = useUserRole();
  const { subscription, subscriptionLoading, createCheckout, openCustomerPortal } = useAuth();

  const getNavItems = () => {
    if (isLoading) return [];
    if (role === "aluno") return studentNavItems;
    if (role === "professor") return professorNavItems;
    if (role === "admin") return adminNavItems;
    return [];
  };

  const navItems = getNavItems();

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible={isMobile ? "offcanvas" : "icon"} className="border-r border-border/50 bg-background">
      <SidebarContent className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border/50">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-base tracking-tight">BQ</span>
          </div>
          {!isCollapsed && (
            <div className="animate-slide-in">
              <h1 className="text-base font-bold text-foreground tracking-tight">Banco de Questões</h1>
              <p className="text-xs text-muted-foreground font-medium">Sistema de Estudos</p>
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
                        onClick={() => {
                          if (isMobile) setOpenMobile(false);
                        }}
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

        {/* Subscription Status */}
        {role === "aluno" && (
          <div className="p-4 border-t border-border/50">
            {subscriptionLoading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : subscription.subscribed ? (
              <div className="space-y-3">
                {!isCollapsed && (
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Assinante</span>
                    <Badge variant="secondary" className="text-xs">Ativo</Badge>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openCustomerPortal}
                  className="w-full gap-2"
                  disabled={subscriptionLoading}
                >
                  <CreditCard className="h-4 w-4" />
                  {!isCollapsed && "Gerenciar Assinatura"}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {!isCollapsed && (
                  <p className="text-xs text-muted-foreground">
                    Assine para ter acesso completo
                  </p>
                )}
                <Button
                  size="sm"
                  onClick={createCheckout}
                  className="w-full gap-2"
                  disabled={subscriptionLoading}
                >
                  <Crown className="h-4 w-4" />
                  {!isCollapsed && "Assinar Agora"}
                </Button>
              </div>
            )}
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
