import { createBrowserRouter } from "react-router-dom";
import type { ComponentType, ReactNode } from "react";

import { Root } from "./pages/Root";

type RouteGuard = ComponentType<{ children: ReactNode }>;
type PagePicker<TModule> = (module: TModule) => ComponentType;
type GuardPicker<TModule> = (module: TModule) => RouteGuard;
type LazyGuard<TModule> = {
  load: () => Promise<TModule>;
  pickGuard: GuardPicker<TModule>;
};

function page<TModule>(
  load: () => Promise<TModule>,
  pickPage: PagePicker<TModule>,
) {
  return async () => {
    const module = await load();
    return { Component: pickPage(module) };
  };
}

function guard<TModule>(
  load: () => Promise<TModule>,
  pickGuard: GuardPicker<TModule>,
): LazyGuard<TModule> {
  return { load, pickGuard };
}

function guardedPage<TGuardModule, TPageModule>(
  routeGuard: LazyGuard<TGuardModule>,
  load: () => Promise<TPageModule>,
  pickPage: PagePicker<TPageModule>,
) {
  return async () => {
    const [guardModule, module] = await Promise.all([
      routeGuard.load(),
      load(),
    ]);
    const Guard = routeGuard.pickGuard(guardModule);
    const Page = pickPage(module);

    return {
      Component() {
        return (
          <Guard>
            <Page />
          </Guard>
        );
      },
    };
  };
}

const expertActivityGuard = guard(
  () => import("./components/expert/ExpertActivityGuard"),
  ({ ExpertActivityGuard }) => ExpertActivityGuard,
);
const expertVerificationApplyGuard = guard(
  () => import("./components/expert/ExpertVerificationApplyGuard"),
  ({ ExpertVerificationApplyGuard }) => ExpertVerificationApplyGuard,
);
const expertVerificationStatusGuard = guard(
  () => import("./components/expert/ExpertVerificationStatusGuard"),
  ({ ExpertVerificationStatusGuard }) => ExpertVerificationStatusGuard,
);

const homePage = page(
  () => import("./pages/Home"),
  ({ Home }) => Home,
);
const loginPage = page(
  () => import("./pages/Login"),
  ({ Login }) => Login,
);
const registerPage = page(
  () => import("./pages/Register"),
  ({ Register }) => Register,
);
const supportPage = page(
  () => import("./pages/Support"),
  ({ Support }) => Support,
);
const checkRequestPage = page(
  () => import("./pages/CheckRequest"),
  ({ CheckRequest }) => CheckRequest,
);
const paymentPage = page(
  () => import("./pages/Payment"),
  ({ Payment }) => Payment,
);
const notFoundPage = page(
  () => import("./pages/NotFound"),
  ({ NotFound }) => NotFound,
);

const clientStartPage = page(
  () => import("./pages/client/ClientStart"),
  ({ ClientStart }) => ClientStart,
);
const companyInfoPage = page(
  () => import("./pages/client/CompanyInfo"),
  ({ CompanyInfo }) => CompanyInfo,
);
const companyInfoViewPage = page(
  () => import("./pages/client/CompanyInfoView"),
  ({ CompanyInfoView }) => CompanyInfoView,
);
const createProjectPage = page(
  () => import("./pages/client/CreateProject"),
  ({ CreateProject }) => CreateProject,
);
const projectSuccessPage = page(
  () => import("./pages/client/ProjectSuccess"),
  ({ ProjectSuccess }) => ProjectSuccess,
);
const projectListPage = page(
  () => import("./pages/client/ProjectList"),
  ({ ProjectList }) => ProjectList,
);
const projectDetailPage = page(
  () => import("./pages/client/ProjectDetail"),
  ({ ProjectDetail }) => ProjectDetail,
);
const bidListPage = page(
  () => import("./pages/client/BidList"),
  ({ BidList }) => BidList,
);
const clientMyPage = page(
  () => import("./pages/client/ClientMyPage"),
  ({ ClientMyPage }) => ClientMyPage,
);
const myPageLayoutPage = page(
  () => import("./pages/client/MyPageLayout"),
  ({ MyPageLayout }) => MyPageLayout,
);
const clientOtherPage = page(
  () => import("./pages/client/ClientOtherPage"),
  ({ ClientOtherPage }) => ClientOtherPage,
);
const guestRequestViewPage = page(
  () => import("./pages/client/GuestRequestView"),
  ({ GuestRequestView }) => GuestRequestView,
);

const expertSignupPage = page(
  () => import("./pages/expert/ExpertSignup"),
  ({ ExpertSignup }) => ExpertSignup,
);
const expertDashboardPage = guardedPage(
  expertActivityGuard,
  () => import("./pages/expert/ExpertDashboard"),
  ({ ExpertDashboard }) => ExpertDashboard,
);
const expertVerificationPage = guardedPage(
  expertVerificationApplyGuard,
  () => import("./pages/expert/ExpertVerification"),
  ({ ExpertVerification }) => ExpertVerification,
);
const expertVerificationStatusPage = guardedPage(
  expertVerificationStatusGuard,
  () => import("./pages/expert/ExpertVerificationStatus"),
  ({ ExpertVerificationStatus }) => ExpertVerificationStatus,
);
const projectListExpertPage = guardedPage(
  expertActivityGuard,
  () => import("./pages/expert/ProjectListExpert"),
  ({ ProjectListExpert }) => ProjectListExpert,
);
const projectDetailExpertPage = guardedPage(
  expertActivityGuard,
  () => import("./pages/expert/ProjectDetailExpert"),
  ({ ProjectDetailExpert }) => ProjectDetailExpert,
);
const myBidsPage = guardedPage(
  expertActivityGuard,
  () => import("./pages/expert/MyBids"),
  ({ MyBids }) => MyBids,
);
const expertProfilePage = guardedPage(
  expertActivityGuard,
  () => import("./pages/expert/ExpertProfile"),
  ({ ExpertProfile }) => ExpertProfile,
);

const adminExpertsPage = page(
  () => import("./pages/admin/AdminExperts"),
  ({ AdminExperts }) => AdminExperts,
);
const adminProjectListPage = page(
  () => import("./pages/admin/AdminProjectList"),
  ({ AdminProjectList }) => AdminProjectList,
);
const adminProjectDetailPage = page(
  () => import("./pages/admin/AdminProjectDetail"),
  ({ AdminProjectDetail }) => AdminProjectDetail,
);
const adminExpertApprovalPage = page(
  () => import("./pages/admin/AdminExpertApproval"),
  ({ AdminExpertApproval }) => AdminExpertApproval,
);
const adminExpertListPage = page(
  () => import("./pages/admin/AdminExpertList"),
  ({ AdminExpertList }) => AdminExpertList,
);
const adminExpertDetailPage = page(
  () => import("./pages/admin/AdminExpertDetail"),
  ({ AdminExpertDetail }) => AdminExpertDetail,
);
const adminCommunityPage = page(
  () => import("./pages/admin/AdminCommunity"),
  ({ AdminCommunity }) => AdminCommunity,
);

const adminSettingsPage = page(
  () => import("./pages/admin/AdminSettings"),
  ({ AdminSettings }) => AdminSettings,
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, lazy: homePage },
      { path: "login", lazy: loginPage },
      { path: "register", lazy: registerPage },
      { path: "signup/expert", lazy: expertSignupPage },
      { path: "check-request", lazy: checkRequestPage },
      { path: "support", lazy: supportPage },

      // 의뢰인 라우트
      { path: "client/start", lazy: clientStartPage },
      {
        path: "client/mypage",
        lazy: myPageLayoutPage,
        children: [
          { index: true, lazy: clientMyPage },
          { path: "company-info", lazy: companyInfoViewPage },
          { path: "other", lazy: clientOtherPage },
        ],
      },
      {
        path: "client/guest-request-view/:projectCode",
        lazy: guestRequestViewPage,
      },
      { path: "client/company-info", lazy: companyInfoPage },
      { path: "client/create-project", lazy: createProjectPage },
      { path: "client/create-project/:industry/:tab?", lazy: createProjectPage },
      { path: "client/project-success/:projectCode", lazy: projectSuccessPage },
      { path: "client/projects", lazy: projectListPage },
      { path: "client/projects/:id", lazy: projectDetailPage },
      { path: "client/projects/:id/bids", lazy: bidListPage },

      // 전문가 라우트
      { path: "expert/dashboard", lazy: expertDashboardPage },
      { path: "expert/verification", lazy: expertVerificationPage },
      { path: "expert/verification/apply", lazy: expertVerificationPage },
      {
        path: "expert/verification/status",
        lazy: expertVerificationStatusPage,
      },
      { path: "expert/pending", lazy: expertVerificationStatusPage },
      { path: "expert/projects", lazy: projectListExpertPage },
      { path: "expert/jobs", lazy: projectListExpertPage },
      { path: "expert/projects/:id", lazy: projectDetailExpertPage },
      { path: "expert/projects/:id/bid", lazy: projectDetailExpertPage },
      { path: "expert/jobs/:id", lazy: projectDetailExpertPage },
      { path: "expert/jobs/:id/bid", lazy: projectDetailExpertPage },
      { path: "expert/my-bids", lazy: myBidsPage },
      { path: "expert/bids", lazy: myBidsPage },
      { path: "expert/profile", lazy: expertProfilePage },

      // 관리자 라우트
      { path: "admin", lazy: adminExpertsPage },
      { path: "admin/projects", lazy: adminProjectListPage },
      { path: "admin/projects/:id", lazy: adminProjectDetailPage },
      { path: "admin/experts", lazy: adminExpertsPage },
      { path: "admin/experts/list", lazy: adminExpertListPage },
      { path: "admin/experts/approval/:id", lazy: adminExpertApprovalPage },
      { path: "admin/experts/detail/:id", lazy: adminExpertDetailPage },
      { path: "admin/community", lazy: adminCommunityPage },
      { path: "admin/settings", lazy: adminSettingsPage },

      // 결제
      { path: "payment/:projectId", lazy: paymentPage },

      { path: "*", lazy: notFoundPage },
    ],
  },
]);
