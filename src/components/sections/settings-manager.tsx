"use client";

import * as React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Container, Section, Flex, Stack, Grid } from "@/components/layout/primitives";
import { DashboardHeader } from "@/components/sections/dashboard-header";
import { Input, FormField } from "@/components/sections/dashboard-form";
import { updateSiteSettingAction } from "@/app/actions/dashboard";

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  hours: string;
}

interface AboutStat {
  label: string;
  value: string;
}

interface SettingsManagerProps {
  initialContactInfo: ContactInfo;
  initialAboutStats: AboutStat[];
}

export function SettingsManager({
  initialContactInfo,
  initialAboutStats,
}: SettingsManagerProps) {
  const [isPending, startTransition] = React.useTransition();
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Contact Info form state
  const [email, setEmail] = React.useState(initialContactInfo.email);
  const [phone, setPhone] = React.useState(initialContactInfo.phone);
  const [address, setAddress] = React.useState(initialContactInfo.address);
  const [hours, setHours] = React.useState(initialContactInfo.hours);

  // About Stats form state
  const [stats, setStats] = React.useState<AboutStat[]>(
    initialAboutStats.length > 0
      ? initialAboutStats
      : [
          { label: "", value: "" },
          { label: "", value: "" },
          { label: "", value: "" },
          { label: "", value: "" },
        ]
  );

  function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("type", "contactInfo");
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("hours", hours);

    startTransition(async () => {
      const res = await updateSiteSettingAction({ success: true }, formData);
      if (res.success) {
        setSuccessMsg("Contact information settings updated successfully!");
      } else {
        setErrorMsg(res.error || "Failed to update contact settings.");
      }
    });
  }

  function handleStatChange(index: number, field: keyof AboutStat, val: string) {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: val };
    setStats(updated);
  }

  function handleStatsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("type", "aboutStats");
    stats.forEach((stat) => {
      formData.append("label", stat.label);
      formData.append("value", stat.value);
    });

    startTransition(async () => {
      const res = await updateSiteSettingAction({ success: true }, formData);
      if (res.success) {
        setSuccessMsg("About statistics settings updated successfully!");
      } else {
        setErrorMsg(res.error || "Failed to update about statistics.");
      }
    });
  }

  return (
    <>
      <DashboardHeader
        title="Site Settings"
        description="Modify shop metadata, contacts information, and statistics."
      />

      <Section spacing="sm">
        <Container size="full" className="px-4 md:px-8">
        <Stack gap="md" className="max-w-4xl">
          {successMsg && (
            <div className="rounded-xl bg-success/10 p-4 text-sm font-semibold text-success border border-success/20">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="rounded-xl bg-destructive/10 p-4 text-sm font-semibold text-destructive border border-destructive/20">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Contact Info */}
          <Card>
            <Heading level="h3" className="mb-4">
              Contact Information
            </Heading>
            <form onSubmit={handleContactSubmit}>
              <Grid cols={2} gap="md" className="mb-6">
                <FormField label="Contact Email" required>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormField>

                <FormField label="Contact Phone" required>
                  <Input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </FormField>

                <FormField label="Shop Address" required className="col-span-2">
                  <Input
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </FormField>

                <FormField label="Working Hours" required className="col-span-2">
                  <Input
                    required
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                </FormField>
              </Grid>

              <Flex justify="end">
                <Button type="submit" disabled={isPending}>
                  <Save className="size-4 mr-2" />
                  {isPending ? "Saving..." : "Save Contact Info"}
                </Button>
              </Flex>
            </form>
          </Card>

          {/* Section 2: About Stats */}
          <Card>
            <Heading level="h3" className="mb-2">
              About Page Statistics
            </Heading>
            <Text variant="small" muted className="mb-4">
              Manage the key metric callouts displayed on the storefront about page.
            </Text>

            <form onSubmit={handleStatsSubmit}>
              <Grid cols={2} gap="md" className="mb-6">
                {stats.map((stat, idx) => (
                  <Card key={idx} className="bg-[var(--surface-alt)] p-4 flex flex-col gap-3">
                    <Text variant="small" className="font-semibold text-foreground">
                      Stat Callout #{idx + 1}
                    </Text>
                    <FormField label="Stat Label">
                      <Input
                        value={stat.label}
                        onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                        placeholder="e.g. Orders Shipped"
                      />
                    </FormField>
                    <FormField label="Stat Value">
                      <Input
                        value={stat.value}
                        onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                        placeholder="e.g. 5008+"
                      />
                    </FormField>
                  </Card>
                ))}
              </Grid>

              <Flex justify="end">
                <Button type="submit" disabled={isPending}>
                  <Save className="size-4 mr-2" />
                  {isPending ? "Saving..." : "Save Statistics"}
                </Button>
              </Flex>
            </form>
          </Card>
        </Stack>
      </Container>
    </Section>
    </>
  );
}
