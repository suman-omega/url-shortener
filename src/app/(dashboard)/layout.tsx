import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header user={user} />
      <main className="flex-1 p-6 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-8">{children}</div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
