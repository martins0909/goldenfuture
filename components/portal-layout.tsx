'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Logo } from '@/components/site-chrome';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { titleCase } from '@/lib/format';
import {
  LayoutDashboard, FileCheck, Users, LogOut, Menu, ChevronRight,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const adminNav: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/applications', label: 'Membership Applications', icon: FileCheck },
  { href: '/admin/members', label: 'Members', icon: Users },
];

export const memberNav: NavItem[] = [
  { href: '/member', label: 'My Dashboard', icon: LayoutDashboard },
];

interface PortalLayoutProps {
  children: ReactNode;
  nav: NavItem[];
  portal: 'admin' | 'member';
  title: string;
  subtitle?: string;
}

export function PortalLayout({ children, nav, portal, title, subtitle }: PortalLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, member, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName = profile?.full_name || member?.full_name || 'User';
  const roleLabel = portal === 'admin' ? (profile?.admin_role ? titleCase(profile.admin_role) : 'Administrator') : (member?.membership_number ? `Member • ${member.membership_number}` : 'Member');

  async function handleSignOut() {
    await signOut();
    router.push('/login');
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link href="/" onClick={() => setMobileOpen(false)}><Logo /></Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== `/${portal}` && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4.5 w-4.5" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-secondary/30">
      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-border bg-card lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <button className="fixed left-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card shadow-sm lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          {SidebarContent}
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="ml-12 lg:ml-0">
            <h1 className="font-display text-lg font-semibold tracking-tight text-foreground">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">
              View site
            </Link>
            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium leading-tight text-foreground">{displayName}</p>
                <p className="text-[10px] leading-tight text-muted-foreground">{roleLabel}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
