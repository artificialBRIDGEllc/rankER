import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/nonprofit")({ component: NonprofitLayout });

function NonprofitLayout() {
  return <Outlet />;
}
