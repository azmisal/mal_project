import { ShieldCheck, Zap, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { WaitlistForm } from "@/components/waitlist-form";

const FEATURES = [
  { icon: Zap, title: "Approved in minutes", description: "No paperwork queues. Apply from your phone, get a decision fast." },
  { icon: Wallet, title: "No hidden fees", description: "Clear rates upfront — the number you see is the number you pay." },
  { icon: ShieldCheck, title: "Built for Pakistan", description: "Designed around local ID verification, banks, and mobile wallets." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 sm:py-16">
        <header className="flex items-center justify-between">
          <span className="text-lg font-bold tracking-tight text-primary">Mal</span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Launching in Pakistan
          </span>
        </header>

        <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-5">
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Fast, fair personal loans — coming soon to Pakistan.
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              Mal is building instant, transparent lending for everyday Pakistanis. Join the waitlist for early access and launch-day rates.
            </p>
            <ul className="flex flex-col gap-4 pt-2">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Card className="p-6 sm:p-8">
            <h2 className="mb-1 text-xl font-semibold">Join the waitlist</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Takes 30 seconds. We&apos;ll notify you the moment Mal launches.
            </p>
            <WaitlistForm />
          </Card>
        </section>

        <footer className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Mal. All rights reserved.
        </footer>
      </div>
    </main>
  );
}