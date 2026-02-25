import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { buildDefaultSkillConfidenceMap, flattenExtractedSkills } from "../lib/analysis";
import { getSelectedOrLatestEntry, setSelectedAnalysisId, updateHistoryEntry } from "../lib/storage";

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

function clampScore(score) {
  return Math.max(0, Math.min(100, score));
}

function computeLiveScore(baseScore, confidenceMap, skills) {
  const delta = skills.reduce((acc, skill) => {
    const value = confidenceMap[skill] || "practice";
    return acc + (value === "know" ? 2 : -2);
  }, 0);
  return clampScore(baseScore + delta);
}

function normalizeEntry(entry) {
  const skills = flattenExtractedSkills(entry.extractedSkills || {});
  const defaultMap = buildDefaultSkillConfidenceMap(entry.extractedSkills || {});
  const skillConfidenceMap = { ...defaultMap, ...(entry.skillConfidenceMap || {}) };
  const baseReadinessScore = typeof entry.baseReadinessScore === "number" ? entry.baseReadinessScore : entry.readinessScore;
  const readinessScore = computeLiveScore(baseReadinessScore, skillConfidenceMap, skills);

  return {
    ...entry,
    baseReadinessScore,
    skillConfidenceMap,
    readinessScore
  };
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function buildPlanText(entry) {
  return entry.plan
    .map((day) => {
      const lines = day.tasks.map((task) => `- ${task}`).join("\n");
      return `${day.day}: ${day.focus}\n${lines}`;
    })
    .join("\n\n");
}

function buildChecklistText(entry) {
  return Object.entries(entry.checklist)
    .map(([round, items]) => `${round}\n${items.map((item) => `- ${item}`).join("\n")}`)
    .join("\n\n");
}

function buildQuestionsText(entry) {
  return entry.questions.map((question, index) => `${index + 1}. ${question}`).join("\n");
}

function buildExportText(entry) {
  const skillsText = Object.entries(entry.extractedSkills)
    .map(([category, skills]) => `${category}: ${skills.join(", ")}`)
    .join("\n");

  const confidenceText = flattenExtractedSkills(entry.extractedSkills)
    .map((skill) => `- ${skill}: ${entry.skillConfidenceMap[skill] === "know" ? "I know this" : "Need practice"}`)
    .join("\n");

  return [
    `${entry.company} - ${entry.role}`,
    `Readiness Score: ${entry.readinessScore}/100 (Base: ${entry.baseReadinessScore}/100)`,
    "",
    "Key Skills Extracted",
    skillsText,
    "",
    "Skill Confidence",
    confidenceText,
    "",
    "Round-wise Preparation Checklist",
    buildChecklistText(entry),
    "",
    "7-day Plan",
    buildPlanText(entry),
    "",
    "10 Likely Interview Questions",
    buildQuestionsText(entry)
  ].join("\n");
}

function downloadAsText(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function ResultsPage() {
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("id") || "";
  const [feedback, setFeedback] = useState("");
  const [entry, setEntry] = useState(() => {
    const raw = getSelectedOrLatestEntry(selectedId);
    return raw ? normalizeEntry(raw) : null;
  });

  useEffect(() => {
    const raw = getSelectedOrLatestEntry(selectedId);
    if (!raw) {
      setEntry(null);
      return;
    }

    const normalized = normalizeEntry(raw);
    setEntry(normalized);
    updateHistoryEntry(normalized.id, {
      baseReadinessScore: normalized.baseReadinessScore,
      skillConfidenceMap: normalized.skillConfidenceMap,
      readinessScore: normalized.readinessScore
    });
  }, [selectedId]);

  useEffect(() => {
    if (selectedId) {
      setSelectedAnalysisId(selectedId);
    }
  }, [selectedId]);

  const weakSkills = useMemo(() => {
    if (!entry) {
      return [];
    }

    return flattenExtractedSkills(entry.extractedSkills)
      .filter((skill) => (entry.skillConfidenceMap[skill] || "practice") === "practice")
      .slice(0, 3);
  }, [entry]);

  function updateSkill(skill, value) {
    if (!entry) {
      return;
    }

    const nextConfidenceMap = { ...entry.skillConfidenceMap, [skill]: value };
    const allSkills = flattenExtractedSkills(entry.extractedSkills);
    const nextScore = computeLiveScore(entry.baseReadinessScore, nextConfidenceMap, allSkills);

    const nextEntry = {
      ...entry,
      skillConfidenceMap: nextConfidenceMap,
      readinessScore: nextScore
    };

    setEntry(nextEntry);
    updateHistoryEntry(entry.id, {
      skillConfidenceMap: nextConfidenceMap,
      readinessScore: nextScore,
      baseReadinessScore: entry.baseReadinessScore
    });
  }

  async function handleCopy(kind) {
    if (!entry) {
      return;
    }

    let text = "";
    if (kind === "plan") {
      text = buildPlanText(entry);
    } else if (kind === "checklist") {
      text = buildChecklistText(entry);
    } else {
      text = buildQuestionsText(entry);
    }

    const ok = await copyText(text);
    setFeedback(ok ? "Copied to clipboard." : "Clipboard blocked. Copy manually from the page.");
  }

  function handleDownload() {
    if (!entry) {
      return;
    }

    const safeCompany = entry.company.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const safeRole = entry.role.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    downloadAsText(`${safeCompany}_${safeRole}_readiness.txt`, buildExportText(entry));
    setFeedback("TXT downloaded.");
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
                {skills.map((skill) => {
                  const state = entry.skillConfidenceMap[skill] || "practice";
                  return (
                    <div key={`${category}-${skill}`} className="rounded-full border border-primary/30 bg-primary/5 px-2 py-1 text-xs">
                      <span className="px-1 font-semibold text-primary">{skill}</span>
                      <button
                        onClick={() => updateSkill(skill, "know")}
                        className={`ml-1 rounded-full px-2 py-1 ${state === "know" ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"}`}
                      >
                        I know this
                      </button>
                      <button
                        onClick={() => updateSkill(skill, "practice")}
                        className={`ml-1 rounded-full px-2 py-1 ${state === "practice" ? "bg-amber-100 text-amber-900" : "text-slate-600 hover:bg-slate-100"}`}
                      >
                        Need practice
                      </button>
                    </div>
                  );
                })}
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

      <Card>
        <CardHeader>
          <CardTitle>Export Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleCopy("plan")} className="rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5">
              Copy 7-day plan
            </button>
            <button onClick={() => handleCopy("checklist")} className="rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5">
              Copy round checklist
            </button>
            <button onClick={() => handleCopy("questions")} className="rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5">
              Copy 10 questions
            </button>
            <button onClick={handleDownload} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90">
              Download as TXT
            </button>
          </div>
          {feedback ? <p className="text-sm text-slate-600">{feedback}</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Action Next</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-700">
            Top weak skills: {weakSkills.length > 0 ? weakSkills.join(", ") : "No weak skills marked"}.
          </p>
          <p className="mt-2 text-sm font-medium text-primary">Start Day 1 plan now.</p>
        </CardContent>
      </Card>
    </section>
  );
}
