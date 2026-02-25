import React from "react";
import { BarChart3, BookOpenCheck, ClipboardCheck, LayoutDashboard, UserRound } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/practice", label: "Practice", icon: BookOpenCheck },
  { to: "/app/assessments", label: "Assessments", icon: ClipboardCheck },
  { to: "/app/resources", label: "Resources", icon: BarChart3 },
  { to: "/app/profile", label: "Profile", icon: UserRound }
];

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="border-r border-slate-200 bg-white p-6">
          <p className="mb-8 text-lg font-semibold text-primary">Placement Prep</p>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <div className="min-h-screen">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
            <h1 className="text-xl font-semibold">Placement Prep</h1>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              U
            </div>
          </header>
          <main className="p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
