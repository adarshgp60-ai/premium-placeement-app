import React from "react";
import { BarChart3, Code2, Video } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Practice Problems",
    description: "Solve role-focused challenges and improve coding confidence.",
    icon: Code2
  },
  {
    title: "Mock Interviews",
    description: "Run realistic interview drills and sharpen communication.",
    icon: Video
  },
  {
    title: "Track Progress",
    description: "Monitor readiness with measurable learning milestones.",
    icon: BarChart3
  }
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Ace Your Placement</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            Practice, assess, and prepare for your dream job
          </p>
          <Link
            to="/app/dashboard"
            className="mt-8 inline-flex rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Get Started
          </Link>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                  <Icon size={20} />
                </div>
                <h2 className="text-lg font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
              </article>
            );
          })}
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        Copyright {new Date().getFullYear()} Placement Readiness Platform. All rights reserved.
      </footer>
    </div>
  );
}
