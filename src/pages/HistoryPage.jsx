import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { getHistory, setSelectedAnalysisId } from "../lib/storage";

function formatDate(isoString) {
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return isoString;
  }
}

export function HistoryPage() {
  const history = getHistory();

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">No analysis saved yet. Run analysis from Dashboard to start building history.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {history.map((entry) => (
            <Link
              key={entry.id}
              to={`/results?id=${entry.id}`}
              onClick={() => setSelectedAnalysisId(entry.id)}
              className="block rounded-lg border border-slate-200 p-4 transition hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">
                  {entry.company} - {entry.role}
                </p>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Score: {entry.readinessScore}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{formatDate(entry.createdAt)}</p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
