import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { initializeStore } from '@/store';
import { useStore } from '@/store';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Pages
import { SplashScreen } from '@/pages/SplashScreen';
import { LoginPage } from '@/pages/LoginPage';
import { SetupPage } from '@/pages/SetupPage';
import { HomePage } from '@/pages/HomePage';
import { PayPage } from '@/pages/PayPage';
import { RequestPage } from '@/pages/RequestPage';
import { QRPage } from '@/pages/QRPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { BeneficiariesPage } from '@/pages/BeneficiariesPage';
import { TransactionDetailPage } from '@/pages/TransactionDetailPage';
import { ProfilePage } from '@/pages/ProfilePage';

// Guards
import { AuthGuard } from '@/components/AuthGuard';
import { SetupGuard } from '@/components/SetupGuard';

function App() {
  const { user, isLoading } = useStore();

  useEffect(() => {
    initializeStore();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-silver-50 to-silver-100 dark:from-silver-900 dark:to-silver-800">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes that require authentication */}
            <Route element={<AuthGuard />}>
              <Route path="/setup" element={<SetupPage />} />
              
              {/* Routes that require setup completion */}
              <Route element={<SetupGuard />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/pay" element={<PayPage />} />
                <Route path="/request" element={<RequestPage />} />
                <Route path="/qr" element={<QRPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/beneficiaries" element={<BeneficiariesPage />} />
                <Route path="/transactions/:id" element={<TransactionDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
