import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Award, Search, Star, Building2 } from "lucide-react";
import { ExpertBidModal } from "../../components/modals/ExpertBidModal";

type SearchCategory = "all" | "company" | "name" | "region";
type ExpertGrade = "premium" | "business" | "special";

interface Expert {
  id: number;
  companyName: string;
  ceoName: string;
  phone: string;
  address: string;
  region: string;
  grade: ExpertGrade;
}

export function SearchExperts() {
  const [searchCategory, setSearchCategory] = useState<SearchCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpert, setSelectedExpert] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDetailClick = (expert: Expert) => {
    setSelectedExpert({
      id: expert.id,
      expertName: expert.ceoName,
      companyName: expert.companyName,
      phone: expert.phone,
      email: "",
      expertIntro: "",
      proposedAmount: 0,
      confirmedAmount: 0,
      isSelected: false,
    });
    setIsModalOpen(true);
  };

  // 전문가 샘플 데이터
  const allExperts: Expert[] = [
    {
      id: 2,
      companyName: "한국행정사무소",
      ceoName: "김철수",
      phone: "031-9876-5432",
      address: "경기도 성남시 분당구 정자동 456",
      region: "경기",
      grade: "business"
    },
    {
      id: 3,
      companyName: "글로벌컨설팅",
      ceoName: "이영희",
      phone: "02-5555-6666",
      address: "서울특별시 서초구 서초대로 789",
      region: "서울",
      grade: "premium"
    },
    {
      id: 4,
      companyName: "부산경영컨설팅",
      ceoName: "박민수",
      phone: "051-7777-8888",
      address: "부산광역시 해운대구 센텀중앙로 321",
      region: "부산",
      grade: "business"
    },
    {
      id: 5,
      companyName: "대전행정사",
      ceoName: "정수진",
      phone: "042-3333-4444",
      address: "대전광역시 유성구 대학로 654",
      region: "대전",
      grade: "special"
    },
    {
      id: 6,
      companyName: "인천종합컨설팅",
      ceoName: "최동욱",
      phone: "032-2222-3333",
      address: "인천광역시 연수구 송도과학로 987",
      region: "인천",
      grade: "business"
    }
  ];

  // 검색 필터링
  const filteredExperts = allExperts.filter((expert) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();

    switch (searchCategory) {
      case "company":
        return expert.companyName.toLowerCase().includes(query);
      case "name":
        return expert.ceoName.toLowerCase().includes(query);
      case "region":
        return expert.region.toLowerCase().includes(query);
      case "all":
      default:
        return (
          expert.companyName.toLowerCase().includes(query) ||
          expert.ceoName.toLowerCase().includes(query) ||
          expert.region.toLowerCase().includes(query) ||
          expert.address.toLowerCase().includes(query)
        );
    }
  });

  const getGradeBadge = (grade: ExpertGrade) => {
    // 1. 프리미엄 등급
    if (grade === "premium") {
      return (
        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white border-0">
          <Star className="h-3 w-3 mr-1 fill-white" />
          프리미엄
        </Badge>
      );
    }

    // 2. 스페셜 등급 (새로 추가)
    if (grade === "special") {
      return (
        <Badge className="bg-purple-100 text-purple-700 border-purple-200">
          <Award className="h-3 w-3 mr-1" />
          스페셜
        </Badge>
      );
    }

    // 3. 기본 비즈니스 등급
    return (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
        <Building2 className="h-3 w-3 mr-1" />
        비즈니스
      </Badge>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-6">
      
      {/* 1. 타이틀 영역 */}
      <div className="mt-8">
        <h1 className="text-3xl font-bold mb-2">전문가 검색</h1>
        <p className="text-gray-600">신뢰할 수 있는 전문가를 찾아보세요.</p>
      </div>

      {/* 검색 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>검색 조건</CardTitle>
          <CardDescription>카테고리를 선택하고 검색어를 입력하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-[200px_1fr_auto] gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select value={searchCategory} onValueChange={(value) => setSearchCategory(value as SearchCategory)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="company">업체명</SelectItem>
                  <SelectItem value="name">대표자명</SelectItem>
                  <SelectItem value="region">지역</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">검색어</Label>
              <Input
                id="search"
                placeholder="검색어를 입력하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="invisible">검색</Label>
              <Button className="w-full md:w-auto">
                <Search className="h-4 w-4 mr-2" />
                검색
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 전문가 목록 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>전문가 목록</CardTitle>
              <CardDescription>총 {filteredExperts.length}개의 전문가를 찾았습니다.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>업체명</TableHead>
                  <TableHead>대표자명</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead>주소</TableHead>
                  <TableHead className="text-center">등급</TableHead>
                  <TableHead className="text-center">상세보기</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExperts.length > 0 ? (
                  filteredExperts.map((expert) => (
                    <TableRow key={expert.id}>
                      <TableCell className="font-medium">{expert.companyName}</TableCell>
                      <TableCell>{expert.ceoName}</TableCell>
                      <TableCell>{expert.phone}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{expert.address}</TableCell>
                      <TableCell className="text-center">{getGradeBadge(expert.grade)}</TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm" onClick={() => handleDetailClick(expert)}>
                          상세보기
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ExpertBidModal
        bid={selectedExpert}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        viewOnly
      />
    </div>
  );
}
