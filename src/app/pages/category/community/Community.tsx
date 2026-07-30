import { useState } from "react";
import { Link } from "react-router";
import { Search, MessageCircle, Eye, ThumbsUp, User, Calendar } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";

const mockPosts = [
  {
    id: 1,
    category: "자유게시판",
    title: "건설 의뢰 진행 시 주의사항 공유합니다",
    author: "김철수",
    date: "2026-05-06",
    views: 234,
    comments: 12,
    likes: 45,
    content: "최근 의뢰를 진행하면서 겪은 경험을 공유합니다...",
  },
  {
    id: 2,
    category: "Q&A",
    title: "전기공사 견적 산정 방법 문의드립니다",
    author: "이영희",
    date: "2026-05-05",
    views: 189,
    comments: 8,
    likes: 23,
    content: "전기공사 견적을 처음 작성하는데 어떤 기준으로...",
  },
  {
    id: 3,
    category: "정보공유",
    title: "2026년 건설업 법규 개정 사항 정리",
    author: "박민수",
    date: "2026-05-04",
    views: 456,
    comments: 15,
    likes: 89,
    content: "올해 개정된 건설업 관련 법규를 정리해봤습니다...",
  },
  {
    id: 4,
    category: "자유게시판",
    title: "소방설비 점검 체크리스트 공유",
    author: "최지은",
    date: "2026-05-03",
    views: 167,
    comments: 6,
    likes: 34,
    content: "유용하게 사용하고 있는 체크리스트를 공유합니다...",
  },
  {
    id: 5,
    category: "Q&A",
    title: "입찰 참가자격 사전심사 절차 문의",
    author: "정우진",
    date: "2026-05-02",
    views: 203,
    comments: 10,
    likes: 28,
    content: "입찰 참가자격 사전심사 절차가 궁금합니다...",
  },
  {
    id: 6,
    category: "정보공유",
    title: "효율적인 의뢰 관리 도구 추천",
    author: "한수정",
    date: "2026-05-01",
    views: 312,
    comments: 18,
    likes: 67,
    content: "의뢰 관리에 유용한 도구들을 소개합니다...",
  },
];

const categories = ["전체", "자유게시판", "Q&A", "정보공유"];

export function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "전체" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryColors: Record<string, string> = {
    자유게시판: "bg-blue-100 text-blue-700",
    "Q&A": "bg-green-100 text-green-700",
    정보공유: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1>커뮤니티</h1>
            <Button asChild>
              <Link to="/community/write">글쓰기</Link>
            </Button>
          </div>
          <p className="text-gray-600">
            전문가와 의뢰인이 함께 소통하고 정보를 공유하는 공간입니다.
          </p>
        </div>

        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="게시글 검색..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Link key={post.id} to={`/community/${post.id}`}className="block mb-2 last:mb-0">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={categoryColors[post.category]}>
                        {post.category}
                      </Badge>
                      <h3 className="flex-1">{post.title}</h3>
                    </div>
                    <p className="text-gray-700 mb-3 line-clamp-1">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {post.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
