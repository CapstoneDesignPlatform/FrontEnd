import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { clearAuthTokens, getStoredAccessToken } from "../../api/authTokens";
import Cookies from 'js-cookie';
import { toast } from "sonner";


import {
  ClipboardList,
  FileText,
  LogOut,
  ChevronDown,
  UserRound,
} from "lucide-react";
import { useState, useEffect } from "react";
import type { AppUser, RootOutletContext } from "../types/rootContext";
import { userInstance } from "../../api/instance";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { clearDemoExpertApproval } from "../demoAccess";

type LayoutVariant = "contained" | "full";

const RELATED_ORGANIZATIONS = [
  {
    name: "국가법령정보센터",
    image: "/svg/국가법령정보센터.svg",
    href: "https://www.law.go.kr",
    imageClassName: "h-12",
  },
  {
    name: "국토교통부",
    image: "/svg/국토교통부.svg",
    href: "https://www.molit.go.kr",
    imageClassName: "h-12",
  },
  {
    name: "한국공인회계사회",
    image: "/svg/한국공인회계사회.svg",
    href: "https://www.kicpa.or.kr",
    imageClassName: "h-6",
    linkClassName: "ml-6 mr-2",
  },
  {
    name: "한국세무사회",
    image: "/svg/한국세무사회.svg",
    href: "https://www.kacpta.or.kr",
    imageClassName: "h-12",
  },
  {
    name: "한국경영기술지도사회",
    image: "/svg/한국경영기술지도사회.svg",
    href: "https://www.kmtca.or.kr/",
    imageClassName: "h-12",
  },
  {
    name: "대한건설협회",
    image: "/svg/대한건설협회.svg",
    href: "https://www.cak.or.kr",
    imageClassName: "h-12",
  },
  {
    name: "대한전문건설협회",
    image: "/svg/전문건설협회.svg",
    href: "https://www.kosca.or.kr/",
    imageClassName: "h-10",
  },
] satisfies Array<{
  name: string;
  image: string;
  href?: string;
  imageClassName: string;
  linkClassName?: string;
}>;

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

  if (href === "/expert/dashboard") {
    return (
      pathname.startsWith("/expert/dashboard") ||
      pathname.startsWith("/expert/profile")
    );
  }

  return pathname.startsWith(href);
}

function BottomExpertNavigation({ pathname }: { pathname: string }) {
  const navItems = [
    {
      href: "/expert/jobs",
      label: "의뢰",
      ariaLabel: "의뢰 목록",
      icon: FileText,
    },
    {
      href: "/expert/bids",
      label: "입찰",
      ariaLabel: "내 입찰 목록",
      icon: ClipboardList,
    },
    {
      href: "/expert/dashboard",
      label: "마이",
      ariaLabel: "마이페이지",
      icon: UserRound,
    },
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
                isActive
                  ? "bg-gradient-to-b from-blue-500 to-blue-700 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-2xl ${isActive ? "bg-white/20" : "bg-slate-100"}`}
              >
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
  const [navValue, setNavValue] = useState("");

  // 새로고침 시 쿠키에 토큰이 있으면 유저 정보 복원
  useEffect(() => {
    const token = getStoredAccessToken();
    const role = Cookies.get("USER_ROLE");
    if (!token || !role) return;

    let active = true;
    userInstance.get("/users/myInfo")
      .then((res) => {
        if (active && getStoredAccessToken() === token && res.data?.success) {
          setUser({
            type: role.toLowerCase() as "client" | "expert",
            name: res.data.data.name,
          });
        }
      })
      .catch(() => {
        // Session expiration is handled only for the matching token by the interceptor.
        // Network errors and stale account responses must not erase a new login.
      });
    return () => { active = false; };
  }, []);

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
    clearAuthTokens();
    Cookies.remove("CLIENT_INFO_ID");
    setUser(null);
    navigate("/", { replace: true });
  };

  const handleAdminLogout = () => {
    clearAuthTokens();
    setUser(null);
    toast.success("관리자 모드에서 로그아웃했습니다.");
    navigate("/admin/login", { replace: true });
  };

  const handleMyRequestsNavigation = () => {
    setNavValue("");

    if (user?.type === "client") {
      navigate("/client/mypage");
      return;
    }

    navigate("/check-request");
  };

  return (
    <div
      className={`${["/register", "/signup/expert"].includes(location.pathname) ? "registration-theme" : ""} ${(["/", "/login", "/client/start", "/client/company-info", "/client/project-success", "/check-request"].includes(location.pathname) || location.pathname === "/client/create-project" || location.pathname.startsWith("/client/create-project/") || location.pathname.startsWith("/client/project-success/")) ? "desktop-public" : ""} min-h-screen bg-gray-50 ${
        shouldShowMobileExpertBottomNav ? "pb-24 md:pb-0" : ""
      }`}
    >
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="/images/logo.png"
                  alt="진단매치 로고"
                  className="h-8 w-auto"
                />
                
                <span className="text-xl font-bold">
                  <span style={{ color: '#34499C' }}>진단</span>
                  <span style={{ color: '#80ACEB' }}>매치</span>
                </span>
              </Link>

                <NavigationMenu viewport={false} className="hidden md:flex" value={navValue} onValueChange={setNavValue}>
                  <NavigationMenuList className="gap-2">
                    {isAdminRoute ? (
                      <>
                        {[
                          { to: "/admin/projects", label: "의뢰현황 조회" },
                          { to: "/admin/experts", label: "전문가 관리" },
                          { to: "/admin/clients", label: "의뢰인 관리" },
                          { to: "/admin/settings", label: "플랫폼 설정" },
                        ].map(({ to, label }) => (
                          <NavigationMenuItem key={to}>
                            <Link
                              to={to}
                              className={`text-sm px-4 py-2 rounded transition-colors ${location.pathname.startsWith(to) ? "bg-blue-50 text-blue-600 font-semibold" : "hover:bg-blue-50 hover:text-blue-600"}`}
                            >
                              {label}
                            </Link>
                          </NavigationMenuItem>
                        ))}

                        <NavigationMenuItem>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="text-sm px-4 py-2 hover:text-blue-600 transition-colors flex items-center gap-1 outline-none">
                              알림서비스 <ChevronDown className="h-3 w-3" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-40">
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate("/admin/notifications/stats")
                                }
                              >
                                집계표
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate("/admin/notifications/manage")
                                }
                              >
                                사용관리
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="text-sm px-4 py-2 hover:text-blue-600 transition-colors flex items-center gap-1 outline-none">
                              중개수수료 <ChevronDown className="h-3 w-3" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-44">
                              <DropdownMenuItem
                                onClick={() => navigate("/admin/fees/stats")}
                              >
                                중개수수료 현황
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate("/admin/membership/manage")
                                }
                              >
                                회원비 납입 관리
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate("/admin/membership/stats")
                                }
                              >
                                회원비 납입 현황
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                          <Link
                            to="/admin/community"
                            className="text-sm px-4 py-2 hover:text-blue-600 transition-colors"
                          >
                            커뮤니티
                          </Link>
                        </NavigationMenuItem>
                      </>
                    ) : shouldShowExpertNavigation ? (
                      <>
                        <NavigationMenuItem>
                          <Link
                            to="/expert/jobs"
                            className="text-sm px-4 py-2 hover:text-blue-600 transition-colors"
                          >
                            의뢰 목록
                          </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                          <Link
                            to="/expert/bids"
                            className="text-sm px-4 py-2 hover:text-blue-600 transition-colors"
                          >
                            내 입찰 목록
                          </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                          <Link
                            to="/community"
                            className="text-sm px-4 py-2 hover:text-blue-600 transition-colors"
                          >
                            커뮤니티
                          </Link>
                        </NavigationMenuItem>
                      </>
                    ) : (
                      <>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger className="text-sm px-3 py-1.5">
                            전문 bid
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="w-36 p-1">
                              <li>
                                <Link to="/bids/intro" className="block px-3 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors" onClick={() => setNavValue("")}>전문 bid 소개</Link>
                              </li>
                              <li>
                                <Link to="/bids/notice" className="block px-3 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors" onClick={() => setNavValue("")}>공지사항</Link>
                              </li>
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger className="text-sm px-3 py-1.5">
                            견적 요청
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="w-44 p-1">
                              <li>
                                <Link
                                  to="/client/start"
                                  className="block rounded-sm px-3 py-1.5 text-sm transition-colors hover:bg-accent"
                                  onClick={() => setNavValue("")}
                                >
                                  기업진단 의뢰하기
                                </Link>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  className="block w-full rounded-sm px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent"
                                  onClick={handleMyRequestsNavigation}
                                >
                                  내 의뢰 확인하기
                                </button>
                              </li>
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                          <Link
                            to="bids/search-experts"
                            className="text-sm px-4 py-2 hover:text-blue-600 transition-colors"
                          >
                            전문가 검색
                          </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger className="text-sm px-3 py-1.5">
                            고객 지원
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="w-36 p-1">
                              <li>
                                <Link to="/support/archive" className="block px-3 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors" onClick={() => setNavValue("")}>자료실</Link>
                              </li>
                              <li>
                                <Link to="/support/faq" className="block px-3 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors" onClick={() => setNavValue("")}>자주하는 질문</Link>
                              </li>
                              <li>
                                <Link to="/community" className="block px-3 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors" onClick={() => setNavValue("")}>Q&A</Link>
                              </li>
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </>
                    )}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              <div className="flex items-center gap-4">
                {isAdminRoute ? (
                  <div className="flex items-center gap-2">
                    <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md text-xs font-bold shadow-sm">
                      관리자 모드
                    </div>
                    {location.pathname !== "/admin/login" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAdminLogout}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <LogOut className="h-4 w-4" />
                        로그아웃
                      </Button>
                    )}
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 mr-2 hidden lg:inline">
                      <span className="font-bold text-gray-900">
                        {user.name}
                      </span>
                      님
                    </span>

                    <Button
                      variant="ghost"
                      asChild
                      className={`text-sm ${user.type === "expert" ? "hidden md:inline-flex" : ""}`}
                    >
                      <Link
                        to={
                          user.type === "client"
                            ? "/client/mypage"
                            : "/expert/dashboard"
                        }
                      >
                        My Page
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLogout}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </div>
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

      <footer className="mt-12 bg-[#ffffff] border-t border-gray-100">
        {/* 관련 기관 섹션 */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <h3 className="text-center text-xs font-medium text-gray-400 mb-4"> {/* mb-6에서 4로 줄임 */}
              관련 기관 바로 가기
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
              {RELATED_ORGANIZATIONS.map((organization) => {
                const image = (
                  <img
                    src={organization.image}
                    alt={organization.name}
                    className={`${organization.imageClassName} opacity-70 hover:opacity-100 transition-opacity`}
                  />
                );

                return organization.href ? (
                  <a
                    key={organization.name}
                    href={organization.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={organization.linkClassName}
                  >
                    {image}
                  </a>
                ) : (
                  <div key={organization.name} className={organization.linkClassName}>
                    {image}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 text-center text-sm text-gray-400">
          {/* <div className="flex flex-wrap justify-center gap-x-6 gap-y-8 mb-3">
            <span>(주)세움경영진단</span>
            <span>사업자등록번호 : 012-345-67890</span>
            <span>TEL : 1111-2222</span>
            <span>대표이사 : 장승희</span>
          </div> */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            © 2026 진단매치. All rights reserved.
          </div>
        </div>
      </footer>

      {shouldShowMobileExpertBottomNav && (
        <BottomExpertNavigation pathname={location.pathname} />
      )}
    </div>
  );
}
