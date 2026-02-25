import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, RouterProvider, createBrowserRouter, useRouteError } from "react-router-dom";
import "./index.css";
import { AppShell } from "./components/AppShell";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AssessmentsPage, PracticePage, ProfilePage, ResourcesPage } from "./pages/PlaceholderPages";

function RouteErrorFallback() {
  const error = useRouteError();
  const message = error?.statusText || error?.message || "The requested page could not be loaded.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Page unavailable</h1>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <a
          href="/app/dashboard"
          className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <RouteErrorFallback />
  },
  {
    path: "/app",
    element: <AppShell />,
    errorElement: <RouteErrorFallback />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "practice", element: <PracticePage /> },
      { path: "assessments", element: <AssessmentsPage /> },
      { path: "resources", element: <ResourcesPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "*", element: <Navigate to="/app/dashboard" replace /> }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/app/dashboard" replace />,
    errorElement: <RouteErrorFallback />
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
