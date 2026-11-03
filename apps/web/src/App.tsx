import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { VoiceProvider } from './context/VoiceContext';
import { LocationProvider } from './context/LocationContext';
import { apiClient } from './api/client';

import { TopNav } from './components/common/TopNav';
import { BottomNav } from './components/common/BottomNav';
import { Footer } from './components/common/Footer';

import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { EquipmentBrowsePage } from './pages/EquipmentBrowsePage';
import { EquipmentDetailPage } from './pages/EquipmentDetailPage';
import { BookEquipmentPage } from './pages/BookEquipmentPage';
import { ListEquipmentPage } from './pages/ListEquipmentPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { CropPricesPage } from './pages/CropPricesPage';
import { FarmSuppliesPage } from './pages/FarmSuppliesPage';
import { MessagesPage } from './pages/MessagesPage';
import { ProfilePage } from './pages/ProfilePage';

// Optimised QueryClient — 5 min staleTime avoids redundant re-fetches on navigation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 minutes
      gcTime: 10 * 60 * 1000,       // 10 minutes garbage-collect
      retry: 1,                      // single retry on failure
      refetchOnWindowFocus: false,   // don't re-fetch on tab switch
    },
  },
});

// Scroll to top on every route change for smooth UX
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

// Global 401 interceptor — auto-redirect to /auth when session expires
function GlobalInterceptor() {
  const navigate = useNavigate();
  useEffect(() => {
    const id = apiClient.interceptors.response.use(
      (r) => r,
      (error) => {
        if (error?.response?.status === 401) {
          const path = window.location.pathname;
          if (path !== '/auth') {
            navigate('/auth');
          }
        }
        return Promise.reject(error);
      }
    );
    return () => apiClient.interceptors.response.eject(id);
  }, [navigate]);
  return null;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <VoiceProvider>
          <LocationProvider>
            <BrowserRouter>
              <ScrollToTop />
              <GlobalInterceptor />
              <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
                <TopNav />

                {/* Main content: pt accounts for fixed TopNav (h-20 header) + subnav (hidden md:block ~36px)
                    Mobile: pt-20 (80px, no subnav) + BottomNav pb-20
                    Desktop: pt-[130px] (80px header + 50px subnav) */}
                <div className="flex-1 w-full pt-20 md:pt-[130px] pb-20 md:pb-0">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/equipment" element={<EquipmentBrowsePage />} />
                    <Route path="/equipment/:id" element={<EquipmentDetailPage />} />
                    <Route path="/book/:id" element={<BookEquipmentPage />} />
                    <Route path="/list-equipment" element={<ListEquipmentPage />} />
                    <Route path="/bookings" element={<MyBookingsPage />} />
                    <Route path="/prices" element={<CropPricesPage />} />
                    <Route path="/supplies" element={<FarmSuppliesPage />} />
                    <Route path="/messages" element={<MessagesPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Routes>
                </div>

                <Footer />
                <BottomNav />
              </div>
            </BrowserRouter>
          </LocationProvider>
        </VoiceProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
