import { getContactSubmissions } from "@/lib/data/dashboard";
import { ContactsManager } from "@/components/sections/contacts-manager";

export default async function ContactsPage() {
  const contacts = await getContactSubmissions();

  return <ContactsManager contacts={contacts} />;
}
