import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '@/store';

export function SetupGuard() {
  const { user } = useStore();

  if (!user?.isSetupComplete) {
    return <Navigate to="/setup" replace />;
  }

  return <Outlet />;
}
