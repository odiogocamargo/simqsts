import { LayoutDashboard, FileText, TrendingUp, BookOpen, List, Users, Download, CreditCard, Crown, Loader2 } from "lucide-react";
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

// Itens de navegação para admin
const adminNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Questões", url: "/questions", icon: FileText },
  { title: "Relatório de Taxonomia", url: "/subject-report", icon: List },
  { title: "Usuários", url: "/users", icon: Users },
  { title: "Exportar Taxonomia", url: "/taxonomy-export", icon: Download },
];

// Itens de navegação para aluno
const studentNavItems = [
  { title: "Meu Desempenho", url: "/student", icon: TrendingUp },
  { title: "Questões", url: "/student/questions", icon: BookOpen },
  { title: "Assinatura", url: "/student/subscription", icon: CreditCard },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { role, isLoading } = useUserRole();
  const { subscription, subscriptionLoading, createCheckout, openCustomerPortal } = useAuth();

  const navItems = role === "aluno" ? studentNavItems : adminNavItems;

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 glass-effect">
      <SidebarContent className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border/50">
          <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shrink-0 premium-glow">
            <span className="text-white font-bold text-base tracking-tight">BQ</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
          </div>
          {!isCollapsed && (
            <div className="animate-slide-in">
              <h1 className="text-base font-bold text-foreground tracking-tight">Banco de Questões</h1>
              <p className="text-xs text-muted-foreground font-medium">Sistema Premium</p>
            </div>
          )}
        </div>

        <SidebarGroup className="mt-2 flex-1">
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider">Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item, index) => (
                <SidebarMenuItem key={item.title} style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-in">
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 rounded-xl transition-all duration-300 hover:bg-secondary/50 hover:translate-x-1"
                      activeClassName="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-primary hover:to-secondary premium-shadow"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
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
