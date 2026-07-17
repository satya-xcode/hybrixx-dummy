import { Suspense } from "react";
import { getContactSubmissions } from "@/lib/data/dashboard";
import { ContactsManager } from "@/components/sections/contacts-manager";
import { Card } from "@/components/ui/card";

export default function ContactsPage() {
  return (
    <Suspense fallback={<ContactsFallback />}>
      <ContactsContent />
    </Suspense>
  );
}

async function ContactsContent() {
  const contacts = await getContactSubmissions();
  return <ContactsManager contacts={contacts} />;
}

function ContactsFallback() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-4 w-96 bg-muted rounded" />
      </div>
      
      {/* Content Skeleton */}
      <Card className="p-6 animate-pulse h-96 bg-muted/10">
        <div className="space-y-4">
          <div className="h-10 w-full bg-muted/20 rounded" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 w-full bg-muted/10 rounded" />
          ))}
        </div>
      </Card>
    </div>
  );
}
