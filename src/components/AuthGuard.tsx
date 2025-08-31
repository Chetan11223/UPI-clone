import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '@/store';

export function AuthGuard() {
  const { user } = useStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
