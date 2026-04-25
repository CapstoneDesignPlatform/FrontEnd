import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Building2, UserCircle, LogOut, Menu, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ type: "client" | "expert" | null; name: string } | null>(null);

  const isClientRoute = location.pathname.startsWith("/client");
  const isExpertRoute = location.pathname.startsWith("/expert");
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isMyPage = location.pathname.startsWith("/client/mypage");
  const isPendingPage = location.pathname === "/expert/pending";
  const isGuestRequestView = location.pathname.includes("/client/guest-request-view");
  const isCompanyInfoView = location.pathname === "/client/company-info-view";

  const handleLogout = () => {
    setUser(null);
  };

  const industries = [
    { label: "건설업", value: "construction" },
    { label: "전기공사업", value: "electrical" },
    { label: "정보통신공사업", value: "information" },
    { label: "소방시설공사업", value: "fire" },
    { label: "의약품도매상", value: "pharmaceutical" },
    { label: "기타", value: "other" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
                    <Link to="/admin/community">커뮤니티</Link>
                  </Button>
                </>
              ) : user?.type === "expert" ? (
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
                      {industries.map((industry) => (
                        <DropdownMenuItem
                          key={industry.value}
                          onClick={() => navigate(`/client/create-project/${industry.value}`)}
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
                    <Button variant="ghost" asChild>
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

      {/* 전문가 페이지 레이아웃 (사이드바 없음) */}
      {isExpertRoute && !isPendingPage && (
        <div className="container mx-auto px-4 py-4">
          <main className="max-w-7xl mx-auto">
            <Outlet context={{ user, setUser }} />
          </main>
        </div>
      )}

      {/* 의뢰인 페이지 레이아웃 (사이드바 없음) */}
      {isClientRoute && !isMyPage && !isGuestRequestView && !isCompanyInfoView && (
        <div className="container mx-auto px-4 py-4">
          <main className="max-w-7xl mx-auto">
            <Outlet context={{ user, setUser }} />
          </main>
        </div>
      )}

      {/* 마이페이지 전용 레이아웃 (사이드바 없음) */}
      {isMyPage && (
        <div className="container mx-auto px-4 py-4">
          <main className="max-w-7xl mx-auto">
            <Outlet context={{ user, setUser }} />
          </main>
        </div>
      )}

      {/* 기업 정보 페이지 레이아웃 (사이드바 없음) */}
      {isCompanyInfoView && (
        <div className="container mx-auto px-4 py-4">
          <main className="max-w-7xl mx-auto">
            <Outlet context={{ user, setUser }} />
          </main>
        </div>
      )}

      {/* 승인 대기 페이지 레이아웃 (사이드바 없음, 전체 화면) */}
      {isPendingPage && (
        <main>
          <Outlet context={{ user, setUser }} />
        </main>
      )}

      {/* 비회원 의뢰 조회 페이지 레이아웃 (사이드바 없음) */}
      {isGuestRequestView && (
        <div className="container mx-auto px-4 py-4">
          <main className="max-w-7xl mx-auto">
            <Outlet context={{ user, setUser }} />
          </main>
        </div>
      )}

      {/* 관리자 페이지 레이아웃 */}
      {isAdminRoute && (
        <div className="container mx-auto px-4 py-4">
          <main className="max-w-7xl mx-auto">
            <Outlet context={{ user, setUser }} />
          </main>
        </div>
      )}

      {/* 일반 페이지 */}
      {!isClientRoute && !isExpertRoute && !isAdminRoute && (
        <main>
          <Outlet context={{ user, setUser }} />
        </main>
      )}

      {/* 푸터 */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          © 2026 ProToCall. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
