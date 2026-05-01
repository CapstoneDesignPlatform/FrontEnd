import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Building2,
  ClipboardList,
  FileText,
  LogOut,
  ChevronDown,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import type { AppUser, RootOutletContext } from "../types/rootContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { clearDemoExpertApproval } from "../demoAccess";

type LayoutVariant = "contained" | "full";

const INDUSTRIES = [
  { label: "건설업", value: "construction" },
  { label: "전기공사업", value: "electrical" },
  { label: "정보통신공사업", value: "information" },
  { label: "소방시설공사업", value: "fire" },
  { label: "의약품도매상", value: "pharmaceutical" },
  { label: "기타", value: "other" },
];

function getLayoutVariant({
  isAdminRoute,
  isClientRoute,
  isExpertRoute,
  isPendingPage,
}: {
  isAdminRoute: boolean;
  isClientRoute: boolean;
  isExpertRoute: boolean;
  isPendingPage: boolean;
}): LayoutVariant {
  if (isAdminRoute || isClientRoute || (isExpertRoute && !isPendingPage)) {
    return "contained";
  }

  return "full";
}

function ContainedOutlet({ context }: { context: RootOutletContext }) {
  return (
    <div className="container mx-auto px-4 py-4">
      <main className="max-w-7xl mx-auto">
        <Outlet context={context} />
      </main>
    </div>
  );
}

function FullWidthOutlet({ context }: { context: RootOutletContext }) {
  return (
    <main>
      <Outlet context={context} />
    </main>
  );
}

function isExpertNavActive(pathname: string, href: string) {
  if (href === "/expert/bids") {
    return (
      pathname.startsWith("/expert/bids") ||
      pathname.startsWith("/expert/my-bids")
    );
  }

  return pathname.startsWith(href);
}

function BottomExpertNavigation({ pathname }: { pathname: string }) {
  const navItems = [
    {
      href: "/expert/jobs",
      label: "공고",
      ariaLabel: "공고 목록",
      icon: FileText,
    },
    {
      href: "/expert/bids",
      label: "입찰",
      ariaLabel: "내 입찰 목록",
      icon: ClipboardList,
    },
    {
      href: "/expert/profile",
      label: "마이",
      ariaLabel: "마이페이지",
      icon: UserRound,
    },
  ];

  return (
    <nav
      aria-label="전문가 하단 메뉴"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-10px_30px_-24px_rgba(15,23,42,0.6)] backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
        {navItems.map((item) => {
          const isActive = isExpertNavActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              aria-label={item.ariaLabel}
              className={`group flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[22px] px-2 text-center transition-all ${
                isActive
                  ? "bg-gradient-to-b from-teal-500 to-teal-700 text-white shadow-[0_12px_28px_-16px_rgba(13,148,136,0.95)]"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-2xl transition-colors ${
                  isActive ? "bg-white/20" : "bg-slate-100 group-hover:bg-white"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2.3} />
              </span>
              <span className="text-[11px] font-semibold leading-none tracking-[-0.01em]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<AppUser | null>(null);

  const isClientRoute = location.pathname.startsWith("/client");
  const isExpertRoute = location.pathname.startsWith("/expert");
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isPendingPage = location.pathname === "/expert/pending";
  const layoutVariant = getLayoutVariant({
    isAdminRoute,
    isClientRoute,
    isExpertRoute,
    isPendingPage,
  });
  const shouldShowExpertNavigation = user?.type === "expert" || isExpertRoute;
  const shouldShowMobileExpertBottomNav =
    shouldShowExpertNavigation && !isAdminRoute;
  const outletContext: RootOutletContext = { user, setUser };

  const handleLogout = () => {
    clearDemoExpertApproval();
    setUser(null);
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 ${
        shouldShowMobileExpertBottomNav ? "pb-24 md:pb-0" : ""
      }`}
    >
      {/* 최상위 헤더 */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* 로고 */}
            <Link to="/" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-teal-600" />
              <span className="text-xl font-bold">ProToCall</span>
            </Link>

            {/* 중앙 네비게이션 */}
            <nav className="hidden md:flex items-center gap-6">
              {isAdminRoute ? (
                // 관리자용 네비게이션
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/admin/projects">총 공고 목록</Link>
                  </Button>

                  <Button variant="ghost" asChild>
                    <Link to="/admin/experts">전문가 관리</Link>
                  </Button>

                  <Button variant="ghost" asChild>
                    <Link to="/admin/settings">플랫폼 설정</Link>
                  </Button>

                  <Button variant="ghost" asChild>
                    <Link to="/admin/community">커뮤니티</Link>
                  </Button>
                </>
              ) : shouldShowExpertNavigation ? (
                // 전문가용 네비게이션
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/expert/jobs">공고 목록</Link>
                  </Button>

                  <Button variant="ghost" asChild>
                    <Link to="/expert/bids">내 입찰 목록</Link>
                  </Button>

                  <Button variant="ghost" asChild>
                    <Link to="/">커뮤니티</Link>
                  </Button>
                </>
              ) : (
                // 의뢰인용 네비게이션
                <>
                  {/* 견적 요청 드롭다운 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-1">
                        견적 요청
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {INDUSTRIES.map((industry) => (
                        <DropdownMenuItem
                          key={industry.value}
                          onClick={() =>
                            navigate(`/client/create-project/${industry.value}`)
                          }
                        >
                          {industry.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button variant="ghost" asChild>
                    <Link to="/expert/projects">전문가 검색</Link>
                  </Button>

                  <Button variant="ghost" asChild>
                    <Link to="/">커뮤니티</Link>
                  </Button>
                </>
              )}
            </nav>

            {/* 우측 네비게이션 */}
            <div className="flex items-center gap-4">
              {isAdminRoute ? (
                // 관리자 모드일 때
                <div className="px-4 py-2 bg-teal-100 text-teal-700 rounded-md font-semibold">
                  관리자 모드
                </div>
              ) : !user ? (
                <>
                  <Button asChild variant="ghost">
                    <Link to="/login">로그인</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register">회원가입</Link>
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-600 hidden md:inline">
                    {user.name}
                  </span>
                  {user.type === "client" ? (
                    <Button variant="ghost" asChild>
                      <Link to="/client/mypage">My Page</Link>
                    </Button>
                  ) : (
                    <Button variant="ghost" className="hidden md:inline-flex" asChild>
                      <Link to="/expert/profile">My Page</Link>
                    </Button>
                  )}
                  <Button variant="ghost" asChild>
                    <Link to="/">고객센터</Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {layoutVariant === "contained" ? (
        <ContainedOutlet context={outletContext} />
      ) : (
        <FullWidthOutlet context={outletContext} />
      )}

      {/* 푸터 */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          © 2026 ProToCall. All rights reserved.
        </div>
      </footer>

      {shouldShowMobileExpertBottomNav ? (
        <BottomExpertNavigation pathname={location.pathname} />
      ) : null}
    </div>
  );
}
