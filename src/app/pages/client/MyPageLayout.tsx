import { Outlet, Link, useLocation } from "react-router-dom";
import { FileText, Building2, MoreHorizontal } from "lucide-react";

export function MyPageLayout() {
  const location = useLocation();

  const tabs = [
    {
      label: "현재 진행중인 의뢰",
      path: "/client/mypage",
      icon: FileText,
    },
    {
      label: "기업 정보",
      path: "/client/mypage/company-info",
      icon: Building2,
    },
    {
      label: "기타페이지",
      path: "/client/mypage/other",
      icon: MoreHorizontal,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 페이지 타이틀 */}
      <div>
        <h1 className="text-3xl font-bold">마이페이지</h1>
        <p className="text-gray-600 mt-2">의뢰 관리 및 기업 정보를 확인하세요</p>
      </div>

      {/* 탭 네비게이션 배너 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <nav className="flex">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-6 py-4 
                  font-medium transition-colors relative
                  ${isActive 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }
                  ${index !== 0 ? "border-l" : ""}
                  ${index === 0 ? "rounded-l-lg" : ""}
                  ${index === tabs.length - 1 ? "rounded-r-lg" : ""}
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 페이지 콘텐츠 */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}