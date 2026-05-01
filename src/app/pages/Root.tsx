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
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";
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
    { href: "/expert/jobs", label: "공고", ariaLabel: "공고 목록", icon: FileText },
    { href: "/expert/bids", label: "입찰", ariaLabel: "내 입찰 목록", icon: ClipboardList },
    { href: "/expert/profile", label: "마이", ariaLabel: "마이페이지", icon: UserRound },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 shadow-[0_-10px_30px_-24px_rgba(15,23,42,0.6)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
        {navItems.map((item) => {
          const isActive = isExpertNavActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`group flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[22px] px-2 text-center transition-all ${
                isActive ? "bg-gradient-to-b from-teal-500 to-teal-700 text-white" : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-2xl ${isActive ? "bg-white/20" : "bg-slate-100"}`}>
                <Icon className="h-4 w-4" strokeWidth={2.3} />
              </span>
              <span className="text-[11px] font-semibold">{item.label}</span>
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
  
  const layoutVariant = getLayoutVariant({ isAdminRoute, isClientRoute, isExpertRoute, isPendingPage });
  const shouldShowExpertNavigation = user?.type === "expert" || isExpertRoute;
  const shouldShowMobileExpertBottomNav = shouldShowExpertNavigation && !isAdminRoute;
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
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-teal-600" />
                <span className="text-xl font-bold">ProToCall</span>
              </Link>

              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList className="gap-2">
                  {isAdminRoute ? (
                    <>
                      <NavigationMenuItem><Link to="/admin/projects" className="text-sm px-4 py-2 hover:text-teal-600 transition-colors">총 공고 목록</Link></NavigationMenuItem>
                      <NavigationMenuItem><Link to="/admin/experts" className="text-sm px-4 py-2 hover:text-teal-600 transition-colors">전문가 관리</Link></NavigationMenuItem>
                      <NavigationMenuItem><Link to="/admin/settings" className="text-sm px-4 py-2 hover:text-teal-600 transition-colors">플랫폼 설정</Link></NavigationMenuItem>
                      <NavigationMenuItem><Link to="/admin/community" className="text-sm px-4 py-2 hover:text-teal-600 transition-colors">커뮤니티</Link></NavigationMenuItem>
                    </>
                  ) : shouldShowExpertNavigation ? (
                    <>
                      <NavigationMenuItem><Link to="/expert/jobs" className="text-sm px-4 py-2 hover:text-teal-600 transition-colors">공고 목록</Link></NavigationMenuItem>
                      <NavigationMenuItem><Link to="/expert/bids" className="text-sm px-4 py-2 hover:text-teal-600 transition-colors">내 입찰 목록</Link></NavigationMenuItem>
                      <NavigationMenuItem><Link to="/" className="text-sm px-4 py-2 hover:text-teal-600 transition-colors">커뮤니티</Link></NavigationMenuItem>
                    </>
                  ) : (
                    <>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-sm hover:text-teal-600 bg-transparent">전문 bid</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="w-48 p-2">
                            <li><Link to="/bids/intro" className="block px-4 py-2 text-sm hover:bg-teal-50 rounded-md">전문 bid 소개</Link></li>
                            <li><Link to="/bids/notice" className="block px-4 py-2 text-sm hover:bg-teal-50 rounded-md">공지사항</Link></li>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-sm hover:text-teal-600 bg-transparent">견적 요청</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="w-48 p-2">
                            {INDUSTRIES.map((industry) => (
                              <li key={industry.value}>
                                <button onClick={() => navigate(`/client/create-project/${industry.value}`)} className="w-full text-left px-4 py-2 text-sm hover:bg-teal-50 rounded-md">
                                  {industry.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                      <NavigationMenuItem><Link to="/expert/projects" className="text-sm px-4 py-2 hover:text-teal-600 transition-colors">전문가 검색</Link></NavigationMenuItem>
                      <NavigationMenuItem><Link to="/" className="text-sm px-4 py-2 hover:text-teal-600 transition-colors">커뮤니티</Link></NavigationMenuItem>
                    </>
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div className="flex items-center gap-4">
              {isAdminRoute ? (
                <div className="px-4 py-2 bg-teal-100 text-teal-700 rounded-md text-xs font-bold shadow-sm">관리자 모드</div>
              ) : !user ? (
                <>
                 <Button asChild variant="ghost"><Link to="/login">로그인</Link></Button>
                 <Button asChild><Link to="/register">회원가입</Link></Button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 mr-2 hidden lg:inline">
                    <span className="font-bold text-gray-900">{user.name}</span>님
                  </span>
                  
                  <Button 
                    variant="ghost" 
                    asChild 
                    className={`text-sm ${user.type === "expert" ? "hidden md:inline-flex" : ""}`}
                  >
                    <Link to={user.type === "client" ? "/client/mypage" : "/expert/profile"}>
                      My Page
                    </Link>
                  </Button>
                  
                  <Button variant="ghost" asChild className="text-sm">
                    <Link to="/support">고객센터</Link>
                  </Button>

                  <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-500 hover:text-red-500">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {layoutVariant === "contained" ? <ContainedOutlet context={outletContext} /> : <FullWidthOutlet context={outletContext} />}

      <footer className="mt-12 bg-[#263238]">
        <div className="border-b border-gray-700">
          <div className="container mx-auto px-4 py-8">
            <h3 className="text-center text-sm text-gray-400 mb-6">관련 기관</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-300">
              <a href="https://www.law.go.kr" className="hover:text-teal-400">국가법령정보센터</a>
              <a href="https://www.molit.go.kr" className="hover:text-teal-400">국토교통부</a>
              <a href="https://www.kicpa.or.kr" className="hover:text-teal-400">한국공인회계사회</a>
              <a href="https://www.kacpta.or.kr" className="hover:text-teal-400">한국세무사회</a>
              <a href="https://www.kmtca.or.kr/" className="hover:text-teal-400">한국경영기술지도사회</a>
              <a href="https://www.cak.or.kr" className="hover:text-teal-400">대한건설협회</a>
              <a href="https://www.kosca.or.kr/" className="hover:text-teal-400">전문건설협회</a>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-400">© 2026 ProToCall. All rights reserved.</div>
      </footer>

      {shouldShowMobileExpertBottomNav && <BottomExpertNavigation pathname={location.pathname} />}
    </div>
  );
}