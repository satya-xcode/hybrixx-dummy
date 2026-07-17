import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  Package,
  ShoppingCart,
  MessageSquare,
  Mail,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { getDashboardStats, getRecentContacts } from "@/lib/data/dashboard";
import { StatCard } from "@/components/sections/stat-card";
import { DashboardHeader } from "@/components/sections/dashboard-header";
import { DataTable } from "@/components/sections/data-table";
import { Grid, Stack, Section, Container, Flex } from "@/components/layout/primitives";
import { Heading, Text } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/components/sections/product-card";

export const metadata: Metadata = {
  title: "Admin Overview",
};

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader
        title="Dashboard"
        description="Real-time performance and customer interaction summaries."
      />

      <Section spacing="sm">
        <Container size="full" className="px-4 md:px-8">
          {/* 
            Wrap dynamic database fetching inside a Suspense boundary.
            This allows Next.js to stream the page shell (sidebar, navigation, title) 
            immediately without waiting for the database queries to finish.
            This fixes the blocking route warning/error.
          */}
          <Suspense fallback={<DashboardLoadingFallback />}>
            <DashboardContent />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}

async function DashboardContent() {
  const [stats, recentContacts] = await Promise.all([
    getDashboardStats(),
    getRecentContacts(5),
  ]);

  return (
    <Stack gap="lg">
      {/* Stat Cards Grid */}
      <Grid cols={4} gap="md">
        <StatCard
          label="Total Products"
          value={stats.totalProducts}
          icon={Package}
          description="Active catalog items"
        />
        <StatCard
          label="Cart Sessions"
          value={stats.totalCarts}
          icon={ShoppingCart}
          description="Active shopper sessions"
        />
        <StatCard
          label="Potential Revenue"
          value={formatINR(stats.totalRevenue)}
          icon={TrendingUp}
          description="Total value of items in carts"
        />
        <StatCard
          label="Unread Messages"
          value={stats.unreadContacts}
          icon={MessageSquare}
          description="Pending customer inquiries"
        />
      </Grid>

      {/* Dashboard Sub-layouts */}
      <Grid cols={2} gap="lg" className="items-start">
        {/* Recent Inquiries */}
        <Card className="flex flex-col gap-4">
          <Flex justify="between" align="center" className="w-full">
            <Heading level="h3">Recent Inquiries</Heading>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/contacts">
                View all <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </Flex>

          {recentContacts.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No contact inquiries found.
            </div>
          ) : (
            <DataTable headers={["Customer", "Message", "Status"]}>
              {recentContacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="px-6 py-4">
                    <Stack gap="xs">
                      <span className="font-semibold text-foreground">
                        {contact.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {contact.email}
                      </span>
                    </Stack>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate">
                    {contact.message}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={contact.isRead ? "secondary" : "default"}>
                      {contact.isRead ? "Read" : "Unread"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </DataTable>
          )}
        </Card>

        {/* Newsletter Overview */}
        <Card className="flex flex-col gap-4">
          <Flex justify="between" align="center" className="w-full">
            <Heading level="h3">Audience Growths</Heading>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/newsletter">
                View Subscribers <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </Flex>

          <Stack gap="md" className="py-6 items-center text-center">
            <Mail className="size-12 text-primary opacity-80" />
            <div>
              <h4 className="text-4xl font-bold tracking-tight text-foreground">
                {stats.newsletterSubscribers}
              </h4>
              <Text variant="small" muted className="mt-1">
                Total newsletter subscribers
              </Text>
            </div>
            <Text variant="xs" muted className="max-w-xs">
              Customers receive automated onboarding discounts and product announcements.
            </Text>
          </Stack>
        </Card>
      </Grid>
    </Stack>
  );
}

function DashboardLoadingFallback() {
  return (
    <Stack gap="lg">
      <Grid cols={4} gap="md">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="flex flex-col gap-2 p-6 animate-pulse">
            <div className="h-4 w-24 bg-muted/60 rounded" />
            <div className="h-8 w-16 bg-muted/60 rounded mt-2" />
            <div className="h-3 w-32 bg-muted/60 rounded mt-2" />
          </Card>
        ))}
      </Grid>
      <Grid cols={2} gap="lg">
        <Card className="p-6 animate-pulse h-64 bg-muted/20" />
        <Card className="p-6 animate-pulse h-64 bg-muted/20" />
      </Grid>
    </Stack>
  );
}
