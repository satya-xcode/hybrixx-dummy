import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/sections/dashboard-sidebar";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s — Nomad Dashboard",
  },
  description: "Nomad Storefront Admin Dashboard",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col md:pl-[var(--sidebar-width,260px)] min-w-0">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
