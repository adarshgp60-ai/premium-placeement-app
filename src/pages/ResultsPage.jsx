import React from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { getSelectedOrLatestEntry, setSelectedAnalysisId } from "../lib/storage";

function ReadinessRing({ score }) {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative h-44 w-44">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160" aria-label="Readiness score chart">
        <circle cx="80" cy="80" r={radius} stroke="rgb(226 232 240)" strokeWidth="12" fill="none" />
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="hsl(245 58% 51%)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 650ms ease-in-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-3xl font-bold text-slate-900">{score}/100</p>
        <p className="text-xs text-slate-500">Readiness Score</p>
      </div>
    </div>
  );
}

export function ResultsPage() {
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("id") || "";
  const entry = getSelectedOrLatestEntry(selectedId);

  if (selectedId) {
    setSelectedAnalysisId(selectedId);
  }

  if (!entry) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">No analysis found. Go to Dashboard and run Analyze first.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{entry.company} - {entry.role}</CardTitle>
          <p className="text-sm text-slate-600">Latest or selected analysis snapshot</p>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ReadinessRing score={entry.readinessScore} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Skills Extracted</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(entry.extractedSkills).map(([category, skills]) => (
            <div key={category}>
              <p className="text-sm font-semibold text-slate-700">{category}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={`${category}-${skill}`} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Round-wise Preparation Checklist</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          {Object.entries(entry.checklist).map(([round, items]) => (
            <div key={round} className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">{round}</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {items.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7-day Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {entry.plan.map((day) => (
            <div key={day.day} className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-900">{day.day}: {day.focus}</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {day.tasks.map((task) => (
                  <li key={task}>- {task}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>10 Likely Interview Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm text-slate-700">
            {entry.questions.map((question, idx) => (
              <li key={question}>
                {idx + 1}. {question}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </section>
  );
}
