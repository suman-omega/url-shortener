import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, Globe, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              HTR Care <span className="text-indigo-600">Go</span>
            </span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
            >
              Features
            </a>
            <a
              href="#solutions"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
            >
              Solutions
            </a>
            <Link
              href="/utm-builder"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
            >
              UTM Builder
            </Link>
            <Link href="/">
              <Button variant="default" className="rounded-full px-6">
                Admin Dashboard
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 py-24 lg:py-32 bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          <div className="relative mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1 text-xs font-semibold text-indigo-700">
                Newly Launched: Branded Short Links
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
                Smart links for <span className="text-indigo-600">smarter</span>{" "}
                outreach.
              </h1>
              <p className="mt-8 text-xl leading-relaxed text-slate-600">
                Empower your healthcare campaigns with high-converting branded
                URLs. Track every click, optimize performance, and reach your
                community with precision.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/">
                  <Button
                    size="lg"
                    className="h-14 rounded-full bg-indigo-600 px-8 text-lg hover:bg-indigo-700"
                  >
                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-14 rounded-full px-8 text-lg text-slate-600 hover:text-indigo-600"
                >
                  View Case Studies
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="px-6 py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Everything you need to track your success
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Powerful tools tailored for community engagement and campaign
                optimization.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Branded Domains",
                  desc: "Build trust with custom slugs tailored for your specific outreach categories.",
                  icon: Globe,
                  color: "bg-blue-50 text-blue-600",
                },
                {
                  title: "Real-time Analytics",
                  desc: "Monitor engagement as it happens with detailed breakdowns by device, location, and source.",
                  icon: BarChart3,
                  color: "bg-emerald-50 text-emerald-600",
                },
                {
                  title: "Secure Redirects",
                  desc: "Robust redirect logic ensuring your users arrive safely at their destination every time.",
                  icon: Shield,
                  color: "bg-indigo-50 text-indigo-600",
                },
              ].map((feature) => (
                <Card
                  key={feature.title}
                  className="border-none shadow-sm transition-all hover:shadow-md"
                >
                  <CardHeader>
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Stats */}
        <section className="px-6 py-24 bg-white border-y border-slate-100">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="mb-12 text-sm font-semibold uppercase tracking-widest text-slate-500">
              Trusted by HTR Care outreach teams
            </h2>
            <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
              {/* Replace with actual logos or text-based logos */}
              <div className="text-2xl font-bold text-slate-400">NEXTDOOR</div>
              <div className="text-2xl font-bold text-slate-400">FACEBOOK</div>
              <div className="text-2xl font-bold text-slate-400">GOOGLE</div>
              <div className="text-2xl font-bold text-slate-400">WHATSAPP</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-indigo-600 fill-indigo-600" />
              <span className="text-lg font-bold tracking-tight text-slate-900">
                HTR Care Go
              </span>
            </div>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} HTR Care. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
