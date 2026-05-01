import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Building2, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { AppUser, RootOutletContext } from "../types/rootContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../components/ui/navigation-menu";

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
  const outletContext: RootOutletContext = { user, setUser };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* 1. 로고 영역 */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-teal-600" />
                <span className="text-xl font-bold">ProToCall</span>
              </Link>

              {/* 2. 중앙 네비게이션 (NavigationMenu 디자인 적용) */}
              <NavigationMenu className="hidden md:flex">
                <NavigationMenuList className="gap-2">
                  {isAdminRoute ? (
                    // [관리자 모드]
                    <>
                      <NavigationMenuItem>
                        <Link to="/admin/projects" className="text-sm px-4 py-2 hover:text-teal-600 transition-colors">총 공고 목록</Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link to="/admin/experts" className="text-sm px-4 py-2 hover:text-teal-600 transition-colors">전문가 관리</Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link to="/admin/settings" className="text-sm px-4 py-2 hover:text-teal-600 transition-colors">플랫폼 설정</Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link to="/admin/community" className="text-sm px-4 py-2 hover:text-teal-600 transition-colors">커뮤니티</Link>
                      </NavigationMenuItem>
                    </>
                  ) : shouldShowExpertNavigation ? (
                    // [전문가 모드]
                    <>
                      <NavigationMenuItem>
                        <Link to="/expert/jobs" className="text-sm px-4 py-2 hover:text-teal-600 transition-colors">공고 목록</Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link to="/expert/bids" className="text-sm px-4 py-2 hover:text-teal-600 transition-colors">내 입찰 목록</Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link to="/" className="text-sm px-4 py-2 hover:text-teal-600 transition-colors">커뮤니티</Link>
                      </NavigationMenuItem>
                    </>
                  ) : (
                    // [의뢰인/일반 모드]
                    <>
                      {/* 전문 bid */}
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-sm hover:text-teal-600">
                          전문 bid
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="w-48 p-2">
                            <li>
                              <Link
                                to="/bids/intro"
                                className="block px-4 py-2 text-sm hover:bg-teal-50 hover:text-teal-600 rounded-md transition-colors"
                              >
                                전문 bid 소개
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/bids/notice"
                                className="block px-4 py-2 text-sm hover:bg-teal-50 hover:text-teal-600 rounded-md transition-colors"
                              >
                                공지사항
                              </Link>
                            </li>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-sm hover:text-teal-600 bg-transparent">
                          견적 요청
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="w-48 p-2">
                            {INDUSTRIES.map((industry) => (
                              <li key={industry.value}>
                                <button
                                  onClick={() => navigate(`/client/create-project/${industry.value}`)}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-teal-50 hover:text-teal-600 rounded-md transition-colors"
                                >
                                  {industry.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link to="/expert/projects" className="text-sm px-4 py-2 hover:text-teal-600 transition-colors">전문가 검색</Link>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <Link to="/" className="text-sm px-4 py-2 hover:text-teal-600 transition-colors">커뮤니티</Link>
                      </NavigationMenuItem>
                    </>
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* 3. 우측 유저 메뉴 영역 */}
            <div className="flex items-center gap-4">
              {isAdminRoute ? (
                // 관리자 뱃지 표시
                <div className="px-4 py-2 bg-teal-100 text-teal-700 rounded-md text-xs font-bold shadow-sm">
                  관리자 모드
                </div>
              ) : !user ? (
                // 로그인 전
                <>
                 <Button asChild variant="ghost">
                    <Link to="/login">로그인</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register">회원가입</Link>
                  </Button>
                </>
              ) : (
                // 로그인 후
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 mr-2 hidden lg:inline">
                    <span className="font-bold text-gray-900">{user.name}</span>님
                  </span>
                  
                  {/* My Page 이동 분기 */}
                  <Button variant="ghost" asChild className="text-sm">
                    <Link to={user.type === "client" ? "/client/mypage" : "/expert/profile"}>
                      My Page
                    </Link>
                  </Button>
                  
                  <Button variant="ghost" asChild className="text-sm">
                    <Link to="/support">고객센터</Link>
                  </Button>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLogout} 
                    className="text-gray-500 hover:text-red-500 transition-colors"
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

      {/* 푸터 */}
      <footer
        className="mt-12"
        style={{ backgroundColor: "#263238" }}
      >
        {/* 관련 기관 */}
        <div className="border-b border-gray-700">
          <div className="container mx-auto px-4 py-8">
            <h3 className="text-center text-sm text-gray-400 mb-6">
              관련 기관
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <a
                href="https://www.law.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-300 hover:text-teal-400 transition-colors"
              >
                국가법령정보센터
              </a>
              <a
                href="https://www.molit.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-300 hover:text-teal-400 transition-colors"
              >
                국토교통부
              </a>
              <a
                href="https://www.kicpa.or.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-300 hover:text-teal-400 transition-colors"
              >
                한국공인회계사회
              </a>
              <a
                href="https://www.kacpta.or.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-300 hover:text-teal-400 transition-colors"
              >
                한국세무사회
              </a>
              <a
                href="https://www.kmtca.or.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-300 hover:text-teal-400 transition-colors"
              >
                한국경영기술지도사회
              </a>
              <a
                href="https://www.cak.or.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-300 hover:text-teal-400 transition-colors"
              >
                대한건설협회
              </a>
              <a
                href="https://www.kosca.or.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-300 hover:text-teal-400 transition-colors"
              >
                전문건설협회
              </a>
            </div>
          </div>
        </div>

        {/* 저작권 */}
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-400">
          © 2026 ProToCall. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
