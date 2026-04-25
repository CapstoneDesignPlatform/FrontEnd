import { createBrowserRouter } from "react-router-dom";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { CheckRequest } from "./pages/CheckRequest";
import { ClientStart } from "./pages/client/ClientStart";
import { CompanyInfo } from "./pages/client/CompanyInfo";
import { CompanyInfoView } from "./pages/client/CompanyInfoView";
import { CreateProject } from "./pages/client/CreateProject";
import { ProjectSuccess } from "./pages/client/ProjectSuccess";
import { ProjectList } from "./pages/client/ProjectList";
import { ProjectDetail } from "./pages/client/ProjectDetail";
import { BidList } from "./pages/client/BidList";
import { ClientMyPage } from "./pages/client/ClientMyPage";
import { MyPageLayout } from "./pages/client/MyPageLayout";
import { ClientOtherPage } from "./pages/client/ClientOtherPage";
import { GuestRequestView } from "./pages/client/GuestRequestView";
import { ExpertDashboard } from "./pages/expert/ExpertDashboard";
import { ExpertSignup } from "./pages/expert/ExpertSignup";
import { ExpertVerification } from "./pages/expert/ExpertVerification";
import { ExpertVerificationStatus } from "./pages/expert/ExpertVerificationStatus";
import { ProjectListExpert } from "./pages/expert/ProjectListExpert";
import { ProjectDetailExpert } from "./pages/expert/ProjectDetailExpert";
import { MyBids } from "./pages/expert/MyBids";
import { ExpertProfile } from "./pages/expert/ExpertProfile";
import { ExpertActivityGuard } from "./components/expert/ExpertActivityGuard";
import { ExpertVerificationApplyGuard } from "./components/expert/ExpertVerificationApplyGuard";
import { ExpertVerificationStatusGuard } from "./components/expert/ExpertVerificationStatusGuard";
import { AdminProjectList } from "./pages/admin/AdminProjectList";
import { AdminExperts } from "./pages/admin/AdminExperts";
import { AdminCommunity } from "./pages/admin/AdminCommunity";
import { AdminProjectDetail } from "./pages/admin/AdminProjectDetail";
import { AdminExpertApproval } from "./pages/admin/AdminExpertApproval";
import { AdminExpertList } from "./pages/admin/AdminExpertList";
import { AdminExpertDetail } from "./pages/admin/AdminExpertDetail";
import { Payment } from "./pages/Payment";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "signup/expert", Component: ExpertSignup },
      { path: "check-request", Component: CheckRequest },
      
      // 의뢰인 라우트
      { path: "client/start", Component: ClientStart },
      { 
        path: "client/mypage", 
        Component: MyPageLayout,
        children: [
          { index: true, Component: ClientMyPage },
          { path: "company-info", Component: CompanyInfoView },
          { path: "other", Component: ClientOtherPage },
        ]
      },
      { path: "client/guest-request-view/:projectCode", Component: GuestRequestView },
      { path: "client/company-info", Component: CompanyInfo },
      { path: "client/create-project", Component: CreateProject },
      { path: "client/create-project/:industry", Component: CreateProject },
      { path: "client/project-success/:projectCode", Component: ProjectSuccess },
      { path: "client/projects", Component: ProjectList },
      { path: "client/projects/:id", Component: ProjectDetail },
      { path: "client/projects/:id/bids", Component: BidList },
      
      // 전문가 라우트
      {
        path: "expert/dashboard",
        element: (
          <ExpertActivityGuard>
            <ExpertDashboard />
          </ExpertActivityGuard>
        ),
      },
      {
        path: "expert/verification",
        element: (
          <ExpertVerificationApplyGuard>
            <ExpertVerification />
          </ExpertVerificationApplyGuard>
        ),
      },
      {
        path: "expert/verification/apply",
        element: (
          <ExpertVerificationApplyGuard>
            <ExpertVerification />
          </ExpertVerificationApplyGuard>
        ),
      },
      {
        path: "expert/verification/status",
        element: (
          <ExpertVerificationStatusGuard>
            <ExpertVerificationStatus />
          </ExpertVerificationStatusGuard>
        ),
      },
      {
        path: "expert/pending",
        element: (
          <ExpertVerificationStatusGuard>
            <ExpertVerificationStatus />
          </ExpertVerificationStatusGuard>
        ),
      },
      {
        path: "expert/projects",
        element: (
          <ExpertActivityGuard>
            <ProjectListExpert />
          </ExpertActivityGuard>
        ),
      },
      {
        path: "expert/jobs",
        element: (
          <ExpertActivityGuard>
            <ProjectListExpert />
          </ExpertActivityGuard>
        ),
      },
      {
        path: "expert/projects/:id",
        element: (
          <ExpertActivityGuard>
            <ProjectDetailExpert />
          </ExpertActivityGuard>
        ),
      },
      {
        path: "expert/projects/:id/bid",
        element: (
          <ExpertActivityGuard>
            <ProjectDetailExpert />
          </ExpertActivityGuard>
        ),
      },
      {
        path: "expert/jobs/:id",
        element: (
          <ExpertActivityGuard>
            <ProjectDetailExpert />
          </ExpertActivityGuard>
        ),
      },
      {
        path: "expert/jobs/:id/bid",
        element: (
          <ExpertActivityGuard>
            <ProjectDetailExpert />
          </ExpertActivityGuard>
        ),
      },
      {
        path: "expert/my-bids",
        element: (
          <ExpertActivityGuard>
            <MyBids />
          </ExpertActivityGuard>
        ),
      },
      {
        path: "expert/bids",
        element: (
          <ExpertActivityGuard>
            <MyBids />
          </ExpertActivityGuard>
        ),
      },
      {
        path: "expert/profile",
        element: (
          <ExpertActivityGuard>
            <ExpertProfile />
          </ExpertActivityGuard>
        ),
      },
      
      // 관리자 라우트
      { path: "admin", Component: AdminExperts },
      { path: "admin/projects", Component: AdminProjectList },
      { path: "admin/projects/:id", Component: AdminProjectDetail },
      { path: "admin/experts", Component: AdminExperts },
      { path: "admin/experts/list", Component: AdminExpertList },
      { path: "admin/experts/approval/:id", Component: AdminExpertApproval },
      { path: "admin/experts/detail/:id", Component: AdminExpertDetail },
      { path: "admin/community", Component: AdminCommunity },
      
      // 결제
      { path: "payment/:projectId", Component: Payment },
      
      { path: "*", Component: NotFound },
    ],
  },
]);
