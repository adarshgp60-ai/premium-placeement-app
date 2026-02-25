import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import { AppShell } from "./components/AppShell";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AssessmentsPage, PracticePage, ProfilePage, ResourcesPage } from "./pages/PlaceholderPages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/app",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "practice", element: <PracticePage /> },
      { path: "assessments", element: <AssessmentsPage /> },
      { path: "resources", element: <ResourcesPage /> },
      { path: "profile", element: <ProfilePage /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
