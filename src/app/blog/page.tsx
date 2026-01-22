import Link from "next/link";
import { Navbar } from "@/components/site/Navbar";
import { BackgroundShell } from "@/components/site/BackgroundShell";
import { Footer } from "@/components/site/Footer";

export default function BlogPage() {
  return (
    <BackgroundShell>
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="text-center">
          {/* Coming Soon Badge */}
          <div className="inline-flex items-center rounded-full bg-secondary/20 border border-secondary/30 px-4 py-2 text-sm text-secondary mb-6">
            Coming Soon
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight">
            Blog
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            We&apos;re working on bringing you insightful articles about careers, education,
            and making informed decisions about your future. Check back soon!
          </p>

          {/* Placeholder illustration */}
          <div className="mt-12 mx-auto w-48 h-48 rounded-full bg-card flex items-center justify-center">
            <svg
              className="w-24 h-24 text-muted-foreground/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>

          {/* CTA */}
          <div className="mt-12">
            <Link
              href="/careers"
              className="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition"
            >
              Explore Careers While You Wait
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </BackgroundShell>
  );
}
