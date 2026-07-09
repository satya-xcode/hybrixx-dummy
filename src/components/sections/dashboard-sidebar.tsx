"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Mail,
  HelpCircle,
  Star,
  Settings,
  Store,
  Menu,
  X,
  Tags
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "Core",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Catalog & Content",
    items: [
      { label: "Products", href: "/dashboard/products", icon: Package },
      { label: "Categories", href: "/dashboard/categories", icon: Tags },
      { label: "FAQs", href: "/dashboard/faqs", icon: HelpCircle },
      { label: "Testimonials", href: "/dashboard/testimonials", icon: Star },
    ],
  },
  {
    title: "Customer Base",
    items: [
      { label: "Inquiries", href: "/dashboard/contacts", icon: MessageSquare },
      { label: "Newsletter", href: "/dashboard/newsletter", icon: Mail },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Site Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="flex h-16 items-center justify-between border-b border-border/60 bg-surface px-6 md:hidden sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-foreground">Nomad</span>
          <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-primary/20 text-primary">
            Admin
          </Badge>
        </Link>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          className="size-9 rounded-xl"
        >
          {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>
      </div>

      {/* Backdrop overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-md md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "fixed bottom-0 top-16 z-40 flex w-[var(--sidebar-width,260px)] flex-col border-r border-border bg-surface transition-transform duration-300 md:top-0 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="hidden h-16 items-center border-b border-border/60 px-6 md:flex justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-foreground text-lg">Nomad</span>
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-primary/30 text-primary bg-primary/5">
              Admin
            </Badge>
          </Link>
        </div>

        {/* Navigation Group Items */}
        <nav className="flex-1 space-y-6 p-4 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                {group.title}
              </span>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors group",
                        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {/* Smooth active sliding pill indicator */}
                      {active && (
                        <motion.div
                          layoutId="active-nav-indicator"
                          className="absolute inset-0 bg-primary/10 rounded-xl"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      
                      <item.icon className={cn(
                        "size-4 z-10 transition-transform group-hover:scale-105",
                        active ? "text-primary" : "text-muted-foreground/80 group-hover:text-foreground"
                      )} />
                      <span className="z-10">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Back link */}
        <div className="border-t border-border/60 p-4">
          <Button variant="outline" className="w-full justify-start gap-3 rounded-xl border-border/80 hover:bg-muted" asChild>
            <Link href="/">
              <Store className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Back to Store</span>
            </Link>
          </Button>
        </div>
      </aside>
    </>
  );
}
