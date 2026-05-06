import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Search, Users, ArrowRight } from "lucide-react";

interface Client {
  id: number;
  name: string;
  company: string;
  businessNumber: string;
  phone: string;
  email: string;
  address: string;
  status: "active" | "pending" | "suspended" | "withdrawn";
  registeredAt: string;
}

export function AdminClientList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "pending" | "suspended" | "withdrawn"
  >("all");

  const allClients: Client[] = [
    {
      id: 1,
      name: "김철수",
      company: "(주)대한건설",
      businessNumber: "123-45-67890",
      phone: "010-1111-2222",
      email: "client@example.com",
      address: "서울특별시 강남구 테헤란로 123",
      status: "active",
      registeredAt: "2026-03-01",
    },
    {
      id: 2,
      name: "이영희",
      company: "한국제조(주)",
      businessNumber: "234-56-78901",
      phone: "010-2222-3333",
      email: "lee@example.com",
      address: "서울특별시 서초구 서초대로 456",
      status: "active",
      registeredAt: "2026-03-05",
    },
    {
      id: 3,
      name: "박민수",
      company: "전기산업(주)",
      businessNumber: "345-67-89012",
      phone: "010-3333-4444",
      email: "park@example.com",
      address: "서울특별시 송파구 올림픽로 789",
      status: "pending",
      registeredAt: "2026-03-10",
    },
    {
      id: 4,
      name: "정수현",
      company: "(주)IT솔루션",
      businessNumber: "456-78-90123",
      phone: "010-4444-5555",
      email: "jung@example.com",
      address: "서울특별시 마포구 홍익로 321",
      status: "suspended",
      registeredAt: "2026-02-20",
    },
    {
      id: 5,
      name: "최영수",
      company: "안전소방(주)",
      businessNumber: "567-89-01234",
      phone: "010-5555-6666",
      email: "choi@example.com",
      address: "경기도 성남시 분당구 판교로 111",
      status: "withdrawn",
      registeredAt: "2026-02-15",
    },
  ];

  const filteredClients = allClients.filter((client) => {
    const matchesSearch =
      !searchQuery ||
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Client["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">정상</Badge>;
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            대기
          </Badge>
        );
      case "suspended":
        return <Badge className="bg-red-100 text-red-700">정지</Badge>;
      case "withdrawn":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700">
            탈퇴
          </Badge>
        );
    }
  };

  const counts = {
    all: allClients.length,
    active: allClients.filter((c) => c.status === "active").length,
    pending: allClients.filter((c) => c.status === "pending").length,
    suspended: allClients.filter((c) => c.status === "suspended").length,
    withdrawn: allClients.filter((c) => c.status === "withdrawn").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">의뢰인 회원현황 조회</h1>
        <p className="text-gray-600">
          등록된 모든 의뢰인을 확인하고 관리합니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid md:grid-cols-5 gap-4">
        {[
          { label: "전체", count: counts.all, color: "text-gray-900" },
          { label: "정상", count: counts.active, color: "text-green-600" },
          { label: "대기", count: counts.pending, color: "text-amber-600" },
          { label: "정지", count: counts.suspended, color: "text-red-600" },
          { label: "탈퇴", count: counts.withdrawn, color: "text-gray-600" },
        ].map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${item.color}`}>
                {item.count}명
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 상태 필터 */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { value: "all", label: "전체" },
            { value: "active", label: "정상" },
            { value: "pending", label: "대기" },
            { value: "suspended", label: "정지" },
            { value: "withdrawn", label: "탈퇴" },
          ] as const
        ).map((item) => (
          <Button
            key={item.value}
            variant={statusFilter === item.value ? "default" : "outline"}
            className={
              statusFilter === item.value
                ? "bg-[#009689] hover:bg-[#007d71]"
                : ""
            }
            onClick={() => setStatusFilter(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {/* 검색 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            검색
          </CardTitle>
          <CardDescription>이름 또는 업체명으로 검색하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="이름 또는 업체명 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            의뢰인 목록
          </CardTitle>
          <CardDescription>
            총 {filteredClients.length}명의 의뢰인이 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredClients.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>검색 결과가 없습니다.</p>
              </div>
            ) : (
              filteredClients.map((client) => (
                <Link
                  key={client.id}
                  to={`/admin/clients/${client.id}`}
                  className="block"
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <h3 className="font-semibold text-lg">
                              {client.name}
                            </h3>
                            {getStatusBadge(client.status)}
                          </div>
                          <div className="grid md:grid-cols-4 gap-x-4 gap-y-2 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">업체명:</span>{" "}
                              {client.company}
                            </div>
                            <div>
                              <span className="font-medium">사업자번호:</span>{" "}
                              {client.businessNumber}
                            </div>
                            <div>
                              <span className="font-medium">연락처:</span>{" "}
                              {client.phone}
                            </div>
                            <div>
                              <span className="font-medium">이메일:</span>{" "}
                              {client.email}
                            </div>
                            <div className="md:col-span-2">
                              <span className="font-medium">주소:</span>{" "}
                              {client.address}
                            </div>
                            <div>
                              <span className="font-medium">가입일:</span>{" "}
                              {client.registeredAt}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
