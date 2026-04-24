import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom'

import { DashboardLayout } from '../components/layout/DashboardLayout'
import { PublicLayout } from '../components/layout/PublicLayout'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AdminExpertsPage } from '../pages/admin/AdminExpertsPage'
import { AdminRequestDetailPage } from '../pages/admin/AdminRequestDetailPage'
import { AdminRequestsPage } from '../pages/admin/AdminRequestsPage'
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage'
import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../pages/LoginPage'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { RegisterClientPage } from '../pages/RegisterClientPage'
import { RegisterExpertPage } from '../pages/RegisterExpertPage'
import { GuestLookupPage } from '../pages/guest/GuestLookupPage'
import { GuestRequestDetailPage } from '../pages/guest/GuestRequestDetailPage'
import { ClientCompanyInfoPage } from '../pages/client/ClientCompanyInfoPage'
import { ClientCompletePage } from '../pages/client/ClientCompletePage'
import { ClientDashboardPage } from '../pages/client/ClientDashboardPage'
import { ClientMyPage } from '../pages/client/ClientMyPage'
import { ClientPaymentPage } from '../pages/client/ClientPaymentPage'
import { ClientProgressPage } from '../pages/client/ClientProgressPage'
import { ClientRequestBidsPage } from '../pages/client/ClientRequestBidsPage'
import { ClientRequestDetailPage } from '../pages/client/ClientRequestDetailPage'
import { IndustryRequestPage } from '../pages/client/IndustryRequestPage'
import { ClientRequestsPage } from '../pages/client/ClientRequestsPage'
import { ClientRequestSelectPage } from '../pages/client/ClientRequestSelectPage'
import { ExpertBidPage } from '../pages/expert/ExpertBidPage'
import { ExpertBidsPage } from '../pages/expert/ExpertBidsPage'
import { ExpertDashboardPage } from '../pages/expert/ExpertDashboardPage'
import { ExpertJobDetailPage } from '../pages/expert/ExpertJobDetailPage'
import { ExpertRequestDetailPage } from '../pages/expert/ExpertRequestDetailPage'
import { ExpertRequestsPage } from '../pages/expert/ExpertRequestsPage'
import { ExpertVerifyPage } from '../pages/expert/ExpertVerifyPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'guest/start', element: <IndustryRequestPage mode="guest" /> },
      { path: 'guest/start/:industrySlug', element: <IndustryRequestPage mode="guest" /> },
      { path: 'guest/lookup', element: <GuestLookupPage /> },
      { path: 'guest/requests/:id', element: <GuestRequestDetailPage /> },
      {
        path: 'placeholder/expert-search',
        element: <PlaceholderPage title="전문가 검색" description="전문가 검색 기능은 추후 제공 예정입니다." />,
      },
      {
        path: 'placeholder/community',
        element: <PlaceholderPage title="커뮤니티" description="커뮤니티 기능은 MVP 이후 단계에서 확장됩니다." />,
      },
      {
        path: 'placeholder/support',
        element: <PlaceholderPage title="고객센터" description="고객센터 메뉴는 안내/문의 구조로 추후 제공됩니다." />,
      },
      { path: 'register/client', element: <RegisterClientPage /> },
      { path: 'register/expert', element: <RegisterExpertPage /> },
    ],
  },
  {
    path: '/client',
    element: <DashboardLayout role="client" />,
    children: [
      { index: true, element: <ClientDashboardPage /> },
      { path: 'company-info', element: <ClientCompanyInfoPage /> },
      { path: 'requests/new/:industrySlug', element: <IndustryRequestPage mode="client" /> },
      { path: 'requests', element: <ClientRequestsPage /> },
      { path: 'requests/:id', element: <ClientRequestDetailPage /> },
      { path: 'requests/:id/bids', element: <ClientRequestBidsPage /> },
      { path: 'requests/:id/select', element: <ClientRequestSelectPage /> },
      { path: 'requests/:id/payment', element: <ClientPaymentPage /> },
      { path: 'requests/:id/progress', element: <ClientProgressPage /> },
      { path: 'requests/:id/complete', element: <ClientCompletePage /> },
      { path: 'mypage', element: <ClientMyPage /> },
    ],
  },
  {
    path: '/expert',
    element: <DashboardLayout role="expert" />,
    children: [
      { index: true, element: <ExpertDashboardPage /> },
      { path: 'verify', element: <ExpertVerifyPage /> },
      { path: 'requests', element: <ExpertRequestsPage /> },
      { path: 'requests/:id', element: <ExpertRequestDetailPage /> },
      { path: 'requests/:id/bid', element: <ExpertBidPage /> },
      { path: 'bids', element: <ExpertBidsPage /> },
      { path: 'jobs/:id', element: <ExpertJobDetailPage /> },
    ],
  },
  {
    path: '/admin',
    element: <DashboardLayout role="admin" />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'requests', element: <AdminRequestsPage /> },
      { path: 'requests/:code', element: <AdminRequestDetailPage /> },
      { path: 'experts', element: <AdminExpertsPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate replace to="/" />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
