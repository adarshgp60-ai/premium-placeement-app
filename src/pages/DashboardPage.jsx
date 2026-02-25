import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const radarData = [
  { skill: "DSA", score: 75 },
  { skill: "System Design", score: 60 },
  { skill: "Communication", score: 80 },
  { skill: "Resume", score: 85 },
  { skill: "Aptitude", score: 70 }
];

const assessments = [
  { title: "DSA Mock Test", time: "Tomorrow, 10:00 AM" },
  { title: "System Design Review", time: "Wed, 2:00 PM" },
  { title: "HR Interview Prep", time: "Friday, 11:00 AM" }
];

const weekDays = [
  { day: "Mon", active: true },
  { day: "Tue", active: true },
  { day: "Wed", active: false },
  { day: "Thu", active: true },
  { day: "Fri", active: false },
  { day: "Sat", active: true },
  { day: "Sun", active: false }
];

function OverallReadiness() {
  const score = 72;
  const max = 100;
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (score / max) * circumference;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Readiness</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
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
              strokeDashoffset={progressOffset}
              style={{ transition: "stroke-dashoffset 700ms ease-in-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-slate-900">{score}/100</p>
            <p className="text-sm text-slate-500">Readiness Score</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SkillBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid stroke="#cbd5e1" />
            <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: "#334155" }} />
            <Radar dataKey="score" stroke="hsl(245 58% 51%)" fill="hsl(245 58% 51%)" fillOpacity={0.25} />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function ContinuePractice() {
  const completed = 3;
  const total = 10;
  const progress = (completed / total) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue Practice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-slate-500">Last topic</p>
          <p className="text-base font-semibold text-slate-900">Dynamic Programming</p>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
            <span>Progress</span>
            <span>
              {completed}/{total} completed
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-200">
            <div className="h-2 rounded-full bg-primary transition-all duration-500 ease-in-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <button className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
          Continue
        </button>
      </CardContent>
    </Card>
  );
}

function WeeklyGoals() {
  const solved = 12;
  const goal = 20;
  const progress = (solved / goal) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Problems Solved: 12/20 this week</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-200">
          <div className="h-2 rounded-full bg-primary transition-all duration-500 ease-in-out" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-2">
          {weekDays.map((entry) => (
            <div key={entry.day} className="flex flex-col items-center gap-1">
              <span
                className={`h-6 w-6 rounded-full border border-slate-300 ${entry.active ? "bg-primary border-primary" : "bg-white"}`}
                aria-label={`${entry.day} activity`}
              />
              <span className="text-xs text-slate-500">{entry.day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingAssessments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Assessments</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {assessments.map((item) => (
            <li key={item.title} className="rounded-lg border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="text-sm text-slate-600">{item.time}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <OverallReadiness />
      <SkillBreakdown />
      <ContinuePractice />
      <WeeklyGoals />
      <div className="lg:col-span-2">
        <UpcomingAssessments />
      </div>
    </section>
  );
}
