import { useState } from "react";
import { Search, Pin, Eye, Calendar } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

const mockNotices = [
  {
    id: 1,
    title: "진단매치 서비스 정식 오픈 안내",
    content: "진단매치 플랫폼이 정식으로 오픈되었습니다.",
    date: "2026-05-01",
    isPinned: true,
    category: "중요",
  },
  {
    id: 2,
    title: "전문가 인증 절차 간소화 안내",
    content: "전문가 인증 절차가 더욱 간편해졌습니다.",
    date: "2026-04-28",
    isPinned: true,
    category: "업데이트",
  },
  {
    id: 3,
    title: "5월 정기 시스템 점검 안내",
    content: "5월 15일 02:00 ~ 06:00 시스템 점검이 예정되어 있습니다.",
    date: "2026-04-25",
    isPinned: false,
    category: "점검",
  },
  {
    id: 4,
    title: "견적 요청 양식 개선 안내",
    content: "더욱 편리한 견적 요청을 위해 양식이 개선되었습니다.",
    date: "2026-04-20",
    isPinned: false,
    category: "업데이트",
  },
  {
    id: 5,
    title: "신규 업종 카테고리 추가 안내",
    content: "다양한 전문가를 만날 수 있도록 신규 업종이 추가되었습니다.",
    date: "2026-04-15",
    isPinned: false,
    category: "공지",
  },
];

export function Notice() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotice, setSelectedNotice] = useState<number | null>(null);

  const filteredNotices = mockNotices.filter(
    (notice) =>
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotices = filteredNotices.filter((n) => n.isPinned);
  const regularNotices = filteredNotices.filter((n) => !n.isPinned);

  const categoryColors: Record<string, string> = {
    중요: "bg-red-100 text-red-700",
    업데이트: "bg-blue-100 text-blue-700",
    점검: "bg-yellow-100 text-yellow-700",
    공지: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2">공지사항</h1>
          <p className="text-gray-600">
            진단매치의 최신 소식과 중요한 공지사항을 확인하세요.
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="공지사항 검색..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {pinnedNotices.length > 0 && (
            <div className="space-y-3">
              {pinnedNotices.map((notice) => (
                <Card
                  key={notice.id}
                  className="p-4 bg-yellow-50 border-yellow-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() =>
                    setSelectedNotice(
                      selectedNotice === notice.id ? null : notice.id
                    )
                  }
                >
                  <div className="flex items-start gap-3">
                    <Pin className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={categoryColors[notice.category]}>
                          {notice.category}
                        </Badge>
                        <h3 className="flex-1">{notice.title}</h3>
                      </div>
                      {selectedNotice === notice.id && (
                        <p className="text-gray-700 mb-3">{notice.content}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {notice.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {regularNotices.map((notice) => (
            <Card
              key={notice.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() =>
                setSelectedNotice(
                  selectedNotice === notice.id ? null : notice.id
                )
              }
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={categoryColors[notice.category]}>
                      {notice.category}
                    </Badge>
                    <h3 className="flex-1">{notice.title}</h3>
                  </div>
                  {selectedNotice === notice.id && (
                    <p className="text-gray-700 mb-3">{notice.content}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {notice.date}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredNotices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
