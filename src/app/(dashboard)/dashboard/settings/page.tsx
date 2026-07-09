import { getContactInfo, getAboutStats } from "@/lib/data/site-settings";
import { SettingsManager } from "@/components/sections/settings-manager";

export default async function SettingsPage() {
  const [contactInfo, aboutStats] = await Promise.all([
    getContactInfo(),
    getAboutStats(),
  ]);

  return (
    <SettingsManager
      initialContactInfo={contactInfo}
      initialAboutStats={aboutStats}
    />
  );
}
