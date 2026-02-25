import React from "react";

function joinClasses(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Card({ className, ...props }) {
  return <div className={joinClasses("rounded-xl border border-slate-200 bg-white", className)} {...props} />;
}

export function CardHeader({ className, ...props }) {
  return <div className={joinClasses("p-6 pb-3", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={joinClasses("text-lg font-semibold text-slate-900", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={joinClasses("p-6 pt-3", className)} {...props} />;
}
