import React from "react";

function PageFrame({ title }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-8">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-3 text-slate-600">This is a placeholder page for the {title} route.</p>
    </section>
  );
}

export function PracticePage() {
  return <PageFrame title="Practice" />;
}

export function AssessmentsPage() {
  return <PageFrame title="Assessments" />;
}

export function ResourcesPage() {
  return <PageFrame title="Resources" />;
}

export function ProfilePage() {
  return <PageFrame title="Profile" />;
}
