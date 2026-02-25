import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { createAnalysisPayload, extractSkills } from "../lib/analysis";
import { getSelectedOrLatestEntry, saveHistoryEntry } from "../lib/storage";

function ReadinessRing({ score }) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative h-40 w-40">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 150 150" aria-label="Readiness score">
        <circle cx="75" cy="75" r={radius} stroke="rgb(226 232 240)" strokeWidth="12" fill="none" />
        <circle
          cx="75"
          cy="75"
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
        <p className="text-3xl font-bold text-slate-900">{score}</p>
        <p className="text-xs text-slate-500">Readiness Score</p>
      </div>
    </div>
  );
}

function SkillGroups({ extractedSkills }) {
  return (
    <div className="space-y-4">
      {Object.entries(extractedSkills).map(([category, skills]) => (
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
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const latest = useMemo(() => getSelectedOrLatestEntry(), []);
  const [company, setCompany] = useState(latest?.company === "Unknown Company" ? "" : latest?.company || "");
  const [role, setRole] = useState(latest?.role === "Unspecified Role" ? "" : latest?.role || "");
  const [jdText, setJdText] = useState(latest?.jdText || "");
  const [previewSkills, setPreviewSkills] = useState(latest?.extractedSkills || { General: ["General fresher stack"] });
  const [previewScore, setPreviewScore] = useState(latest?.readinessScore || 35);

  const canAnalyze = jdText.trim().length >= 40;

  function handleAnalyze() {
    if (!canAnalyze) {
      return;
    }

    const analysis = createAnalysisPayload({ company, role, jdText });
    saveHistoryEntry(analysis);
    setPreviewSkills(analysis.extractedSkills);
    setPreviewScore(analysis.readinessScore);
    navigate(`/results?id=${analysis.id}`);
  }

  function handleJdInput(value) {
    setJdText(value);
    const detected = extractSkills(value);
    setPreviewSkills(detected);
  }

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Analyze Job Description</CardTitle>
          <p className="text-sm text-slate-600">Paste JD text to extract skills, generate a prep strategy, and save to persistent history.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              <span>Company</span>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-primary"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="Example: Infosys"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span>Role</span>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-primary"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="Example: SDE Intern"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm text-slate-700">
            <span>Job Description</span>
            <textarea
              className="min-h-[260px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-primary"
              value={jdText}
              onChange={(event) => handleJdInput(event.target.value)}
              placeholder="Paste complete JD text here..."
            />
          </label>

          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className="inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Analyze and Save
          </button>
          {!canAnalyze ? <p className="text-xs text-slate-500">Add at least 40 characters of JD text to enable analysis.</p> : null}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Readiness</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ReadinessRing score={previewScore} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Skills Extracted</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillGroups extractedSkills={previewSkills} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
