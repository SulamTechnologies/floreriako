import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { PageLoader } from "./PageLoader";

interface Props {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
