import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  Calendar,
  DollarSign,
  MapPin,
  FileText,
  Users,
  Building2,
  Phone,
  Mail,
  CheckCircle2,
  ArrowLeft,
  Clock,
  User,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useState } from "react";

type ProjectStatus =
  | "bidding"
  | "closed"
  | "paid"
  | "in_progress"
  | "association"
  | "sent"
  | "completed";

interface Project {
  id: string;
  code: string;
  title: string;
  type: string;
  industry: string;
  description: string;
  budget: string;
  deadline: string;
  location: string;
  requirements: string;
  createdAt: string;
  updatedAt: string;
  initialStatus: ProjectStatus;
  client: { name: string; email: string; phone: string; isGuest: boolean };
  company: {
    name: string;
    businessType: string;
    businessNumber: string;
    representative: string;
    address: string;
    phone: string;
    establishedDate: string;
    capital: string;
    employees: number;
  };
  selectedExpert?: {
    id: number;
    name: string;
    company: string;
    phone: string;
    email: string;
    price: string;
    selectedAt: string;
  };
  bids: {
    id: number;
    expertName: string;
    company: string;
    phone: string;
    email: string;
    price: string;
    estimatedDays: number;
    message: string;
    verified: boolean;
    bidAt: string;
    isSelected: boolean;
  }[];
}

const allProjects: Project[] = [
  {
    id: "1",
    code: "REQ-L5X9K2M",
    title: "건설업 일반건설업(토목공사업) 면허 취득",
    type: "필요 면허",
    industry: "건설업",
    description:
      "토목공사업을 시작하기 위한 일반건설업 면허 취득이 필요합니다.",
    budget: "₩3,000,000",
    deadline: "2026-05-15",
    location: "서울특별시 강남구",
    requirements: "- 건설업 관련 면허 취득 경험 보유\n- 최소 3년 이상의 경력",
    createdAt: "2026-04-05",
    updatedAt: "2026-04-06",
    initialStatus: "bidding",
    client: {
      name: "김철수",
      email: "client@example.com",
      phone: "010-1111-2222",
      isGuest: false,
    },
    company: {
      name: "(주)대한건설",
      businessType: "법인사업자",
      businessNumber: "123-45-67890",
      representative: "김철수",
      address: "서울특별시 강남구 테헤란로 123",
      phone: "02-1234-5678",
      establishedDate: "2020-03-15",
      capital: "₩100,000,000",
      employees: 15,
    },
    selectedExpert: {
      id: 1,
      name: "김전문",
      company: "케이법무법인",
      phone: "010-1234-5678",
      email: "expert1@example.com",
      price: "₩2,500,000",
      selectedAt: "2026-04-06",
    },
    bids: [
      {
        id: 1,
        expertName: "김전문",
        company: "케이법무법인",
        phone: "010-1234-5678",
        email: "expert1@example.com",
        price: "₩2,500,000",
        estimatedDays: 30,
        message: "건설업 관련 면허 취득 경력 10년 이상입니다.",
        verified: true,
        bidAt: "2026-04-05 14:30",
        isSelected: true,
      },
      {
        id: 2,
        expertName: "이컨설턴트",
        company: "프로컨설팅",
        phone: "010-2345-6789",
        email: "expert2@example.com",
        price: "₩2,700,000",
        estimatedDays: 25,
        message: "최단 기간 내 면허 취득을 보장합니다.",
        verified: true,
        bidAt: "2026-04-05 15:20",
        isSelected: false,
      },
    ],
  },
  {
    id: "2",
    code: "REQ-M3P7N1K",
    title: "제조업 실태 조사",
    type: "실태 조사",
    industry: "실태 조사",
    description:
      "제조업 실태 조사가 필요합니다. 현장 방문 및 서류 검토 포함입니다.",
    budget: "₩2,000,000",
    deadline: "2026-05-20",
    location: "경기도 안산시",
    requirements: "- 실태 조사 경험 보유\n- 제조업 관련 지식",
    createdAt: "2026-04-04",
    updatedAt: "2026-04-04",
    initialStatus: "closed",
    client: {
      name: "이영희",
      email: "lee@example.com",
      phone: "010-2222-3333",
      isGuest: true,
    },
    company: {
      name: "한국제조(주)",
      businessType: "법인사업자",
      businessNumber: "234-56-78901",
      representative: "이영희",
      address: "경기도 안산시 단원구 산업로 456",
      phone: "031-234-5678",
      establishedDate: "2018-06-01",
      capital: "₩50,000,000",
      employees: 30,
    },
    bids: [
      {
        id: 1,
        expertName: "박행정사",
        company: "믿음행정사사무소",
        phone: "010-3456-7890",
        email: "expert3@example.com",
        price: "₩1,800,000",
        estimatedDays: 14,
        message: "실태 조사 전문가입니다.",
        verified: true,
        bidAt: "2026-04-04 10:00",
        isSelected: false,
      },
      {
        id: 2,
        expertName: "최법무사",
        company: "성공법무사사무소",
        phone: "010-4567-8901",
        email: "expert4@example.com",
        price: "₩2,000,000",
        estimatedDays: 10,
        message: "빠른 처리를 보장합니다.",
        verified: true,
        bidAt: "2026-04-04 11:00",
        isSelected: false,
      },
    ],
  },
  {
    id: "3",
    code: "REQ-K9L2M5P",
    title: "전기공사업 면허 신청 대행",
    type: "필요 면허",
    industry: "전기공사업",
    description: "전기공사업 면허 신청 대행이 필요합니다.",
    budget: "₩2,500,000",
    deadline: "2026-06-01",
    location: "서울특별시 서초구",
    requirements: "- 전기공사업 면허 취득 경험\n- 관련 법규 지식",
    createdAt: "2026-04-03",
    updatedAt: "2026-04-05",
    initialStatus: "paid",
    client: {
      name: "박민수",
      email: "park@example.com",
      phone: "010-3333-4444",
      isGuest: false,
    },
    company: {
      name: "전기산업(주)",
      businessType: "법인사업자",
      businessNumber: "345-67-89012",
      representative: "박민수",
      address: "서울특별시 서초구 서초대로 789",
      phone: "02-345-6789",
      establishedDate: "2019-01-15",
      capital: "₩80,000,000",
      employees: 20,
    },
    selectedExpert: {
      id: 2,
      name: "강전문",
      company: "프로컨설팅",
      phone: "010-2222-2222",
      email: "kang@example.com",
      price: "₩2,300,000",
      selectedAt: "2026-04-04",
    },
    bids: [
      {
        id: 1,
        expertName: "강전문",
        company: "프로컨설팅",
        phone: "010-2222-2222",
        email: "kang@example.com",
        price: "₩2,300,000",
        estimatedDays: 20,
        message: "전기공사업 전문가입니다.",
        verified: true,
        bidAt: "2026-04-03 09:00",
        isSelected: true,
      },
    ],
  },
  {
    id: "4",
    code: "REQ-N7M4K1L",
    title: "정보통신공사업 등록",
    type: "필요 면허",
    industry: "정보통신공사업",
    description: "정보통신공사업 등록이 필요합니다.",
    budget: "₩1,800,000",
    deadline: "2026-05-30",
    location: "서울특별시 마포구",
    requirements: "- 정보통신공사업 경험\n- IT 관련 지식",
    createdAt: "2026-04-02",
    updatedAt: "2026-04-02",
    initialStatus: "in_progress",
    client: {
      name: "정수현",
      email: "jung@example.com",
      phone: "010-4444-5555",
      isGuest: false,
    },
    company: {
      name: "(주)IT솔루션",
      businessType: "법인사업자",
      businessNumber: "456-78-90123",
      representative: "정수현",
      address: "서울특별시 마포구 홍익로 321",
      phone: "02-456-7890",
      establishedDate: "2021-03-01",
      capital: "₩30,000,000",
      employees: 8,
    },
    bids: [
      {
        id: 1,
        expertName: "신기술",
        company: "IT솔루션컨설팅",
        phone: "010-3333-3333",
        email: "shin@example.com",
        price: "₩1,700,000",
        estimatedDays: 15,
        message: "정보통신 전문가입니다.",
        verified: true,
        bidAt: "2026-04-02 14:00",
        isSelected: false,
      },
    ],
  },
  {
    id: "5",
    code: "REQ-P2K9M3L",
    title: "소방시설공사업 면허",
    type: "필요 면허",
    industry: "소방시설공사업",
    description: "소방시설공사업 면허 취득이 필요합니다.",
    budget: "₩2,200,000",
    deadline: "2026-06-15",
    location: "부산광역시 해운대구",
    requirements: "- 소방시설 관련 경험\n- 부산 지역 활동 가능자",
    createdAt: "2026-04-01",
    updatedAt: "2026-04-01",
    initialStatus: "association",
    client: {
      name: "최영수",
      email: "choi@example.com",
      phone: "010-5555-6666",
      isGuest: true,
    },
    company: {
      name: "안전소방(주)",
      businessType: "법인사업자",
      businessNumber: "567-89-01234",
      representative: "최영수",
      address: "부산광역시 해운대구 센텀로 100",
      phone: "051-567-8901",
      establishedDate: "2017-09-01",
      capital: "₩60,000,000",
      employees: 12,
    },
    bids: [
      {
        id: 1,
        expertName: "정면허",
        company: "안전소방컨설팅",
        phone: "010-5678-9012",
        email: "jung@example.com",
        price: "₩2,100,000",
        estimatedDays: 25,
        message: "소방시설 전문가입니다.",
        verified: true,
        bidAt: "2026-04-01 10:00",
        isSelected: false,
      },
    ],
  },
  {
    id: "6",
    code: "REQ-L1M8K5N",
    title: "의약품도매상 허가",
    type: "필요 면허",
    industry: "의약품도매상",
    description: "의약품도매상 허가 취득이 필요합니다.",
    budget: "₩3,500,000",
    deadline: "2026-07-01",
    location: "서울특별시 송파구",
    requirements: "- 의약품 관련 허가 경험\n- 관련 법규 지식",
    createdAt: "2026-03-31",
    updatedAt: "2026-03-31",
    initialStatus: "sent",
    client: {
      name: "강민지",
      email: "kang@example.com",
      phone: "010-6666-7777",
      isGuest: false,
    },
    company: {
      name: "헬스케어(주)",
      businessType: "법인사업자",
      businessNumber: "678-90-12345",
      representative: "강민지",
      address: "서울특별시 송파구 올림픽로 300",
      phone: "02-678-9012",
      establishedDate: "2022-01-01",
      capital: "₩120,000,000",
      employees: 25,
    },
    bids: [
      {
        id: 1,
        expertName: "정법무",
        company: "헬스케어법무법인",
        phone: "010-7777-7777",
        email: "jung@example.com",
        price: "₩3,200,000",
        estimatedDays: 40,
        message: "의약품 허가 전문가입니다.",
        verified: true,
        bidAt: "2026-03-31 11:00",
        isSelected: false,
      },
    ],
  },
  {
    id: "7",
    code: "REQ-K5M2L9P",
    title: "건설업 전문건설업(실내건축공사업) 면허",
    type: "필요 면허",
    industry: "건설업",
    description: "실내건축공사업 면허 취득이 필요합니다.",
    budget: "₩2,800,000",
    deadline: "2026-06-30",
    location: "서울특별시 강동구",
    requirements: "- 실내건축 관련 면허 취득 경험\n- 최소 5년 경력",
    createdAt: "2026-03-30",
    updatedAt: "2026-04-10",
    initialStatus: "completed",
    client: {
      name: "윤성호",
      email: "yoon@example.com",
      phone: "010-7777-8888",
      isGuest: false,
    },
    company: {
      name: "인테리어건설(주)",
      businessType: "법인사업자",
      businessNumber: "789-01-23456",
      representative: "윤성호",
      address: "서울특별시 강동구 천호대로 500",
      phone: "02-789-0123",
      establishedDate: "2016-05-01",
      capital: "₩90,000,000",
      employees: 18,
    },
    selectedExpert: {
      id: 3,
      name: "이컨설",
      company: "글로벌컨설팅",
      phone: "010-5555-5555",
      email: "lee@example.com",
      price: "₩2,600,000",
      selectedAt: "2026-04-01",
    },
    bids: [
      {
        id: 1,
        expertName: "이컨설",
        company: "글로벌컨설팅",
        phone: "010-5555-5555",
        email: "lee@example.com",
        price: "₩2,600,000",
        estimatedDays: 28,
        message: "실내건축 전문가입니다.",
        verified: true,
        bidAt: "2026-03-30 09:00",
        isSelected: true,
      },
    ],
  },
  {
    id: "8",
    code: "REQ-M9L3K7N",
    title: "기업 자본금 변동 진단",
    type: "기타",
    industry: "기타",
    description: "기업 자본금 변동에 따른 진단이 필요합니다.",
    budget: "₩1,500,000",
    deadline: "2026-05-10",
    location: "서울특별시 중구",
    requirements: "- 기업진단 경험\n- 회계 관련 지식",
    createdAt: "2026-03-29",
    updatedAt: "2026-03-29",
    initialStatus: "bidding",
    client: {
      name: "임지연",
      email: "lim@example.com",
      phone: "010-8888-9999",
      isGuest: true,
    },
    company: {
      name: "(주)글로벌무역",
      businessType: "법인사업자",
      businessNumber: "890-12-34567",
      representative: "임지연",
      address: "서울특별시 중구 을지로 100",
      phone: "02-890-1234",
      establishedDate: "2020-11-01",
      capital: "₩200,000,000",
      employees: 50,
    },
    bids: [
      {
        id: 1,
        expertName: "박행정사",
        company: "믿음행정사사무소",
        phone: "010-4444-4444",
        email: "park@example.com",
        price: "₩1,400,000",
        estimatedDays: 7,
        message: "기업진단 전문가입니다.",
        verified: true,
        bidAt: "2026-03-29 13:00",
        isSelected: false,
      },
    ],
  },
];

export function AdminProjectDetail() {
  const { id } = useParams();
  const project = allProjects.find((p) => p.id === id) ?? allProjects[0];
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>(
    project.initialStatus,
  );

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case "bidding":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-700">
            입찰 중
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700">
            마감
          </Badge>
        );
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700">
            결제
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
            진단시작
          </Badge>
        );
      case "association":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-700">
            협회경유
          </Badge>
        );
      case "sent":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-700">
            발송
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-teal-100 text-teal-700">
            완료
          </Badge>
        );
    }
  };

  const getStatusLabel = (status: ProjectStatus) => {
    const labels: Record<ProjectStatus, string> = {
      bidding: "입찰 중",
      closed: "마감",
      paid: "결제",
      in_progress: "진단시작",
      association: "협회경유",
      sent: "발송",
      completed: "완료",
    };
    return labels[status];
  };

  const handleStatusChange = (value: string) => {
    setProjectStatus(value as ProjectStatus);
    alert(
      `공고 상태를 "${getStatusLabel(value as ProjectStatus)}"로 변경했습니다.`,
    );
  };

  const sortedBids = [...project.bids].sort(
    (a, b) =>
      parseInt(a.price.replace(/[^0-9]/g, "")) -
      parseInt(b.price.replace(/[^0-9]/g, "")),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/projects">
                <ArrowLeft className="h-4 w-4 mr-1" />
                목록으로
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <Badge variant="outline">{project.type}</Badge>
            <Badge variant="outline">{project.industry}</Badge>
            {getStatusBadge(projectStatus)}
          </div>
          <h1 className="text-3xl mb-2">{project.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              의뢰 코드:{" "}
              <span className="font-mono font-semibold">{project.code}</span>
            </span>
            <span>•</span>
            <span>등록일: {project.createdAt}</span>
            <span>•</span>
            <span>최종 수정: {project.updatedAt}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-600">진행 상태 변경</label>
          <Select value={projectStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bidding">입찰 중</SelectItem>
              <SelectItem value="closed">마감</SelectItem>
              <SelectItem value="paid">결제</SelectItem>
              <SelectItem value="in_progress">진단시작</SelectItem>
              <SelectItem value="association">협회경유</SelectItem>
              <SelectItem value="sent">발송</SelectItem>
              <SelectItem value="completed">완료</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                의뢰 내용
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">설명</p>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">필수 요구사항</p>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {project.requirements}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                기업 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  ["기업명", project.company.name],
                  ["사업자 유형", project.company.businessType],
                  ["사업자등록번호", project.company.businessNumber],
                  ["대표자명", project.company.representative],
                  ["대표 전화", project.company.phone],
                  ["설립일", project.company.establishedDate],
                  ["자본금", project.company.capital],
                  ["직원 수", `${project.company.employees}명`],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">주소</p>
                  <p className="font-medium">{project.company.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                의뢰인 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">이름</p>
                  <p className="font-medium">{project.client.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">회원 유형</p>
                  <Badge variant="outline">
                    {project.client.isGuest ? "비회원" : "정회원"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">이메일</p>
                  <p className="font-medium">{project.client.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">연락처</p>
                  <p className="font-medium">{project.client.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {project.selectedExpert && (
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <CheckCircle2 className="h-5 w-5" />
                  선택된 전문가
                </CardTitle>
                <CardDescription>의뢰인이 선택한 전문가입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {project.selectedExpert.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          {project.selectedExpert.name}
                        </h3>
                        <Badge className="bg-blue-600">선택됨</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {project.selectedExpert.company}
                      </p>
                      <div className="grid md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          {project.selectedExpert.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          {project.selectedExpert.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold text-blue-700">
                            {project.selectedExpert.price}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          선택일: {project.selectedExpert.selectedAt}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                입찰 전문가 목록
              </CardTitle>
              <CardDescription>
                총 {project.bids.length}명의 전문가가 입찰했습니다. (최저가
                순으로 정렬)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedBids.map((bid, index) => (
                  <Card
                    key={bid.id}
                    className={
                      bid.isSelected
                        ? "border-blue-500 bg-blue-50/50"
                        : index < 3
                          ? "border-green-200 bg-green-50/30"
                          : ""
                    }
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback
                            className={
                              bid.isSelected ? "bg-blue-600 text-white" : ""
                            }
                          >
                            {bid.expertName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-semibold text-lg">
                              {bid.expertName}
                            </h3>
                            {bid.isSelected && (
                              <Badge className="bg-blue-600">선택됨</Badge>
                            )}
                            {index < 3 && !bid.isSelected && (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-700"
                              >
                                최저가 TOP {index + 1}
                              </Badge>
                            )}
                            {bid.verified && (
                              <Badge variant="outline" className="gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                인증
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {bid.company}
                          </p>
                          <div className="grid md:grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-gray-500" />
                              <span className="font-semibold text-[#009689]">
                                {bid.price}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              예상 기간: {bid.estimatedDays}일
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                              입찰일시: {bid.bidAt}
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-2 text-sm mb-3">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="h-4 w-4" />
                              {bid.phone}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="h-4 w-4" />
                              {bid.email}
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded p-3">
                            <p className="text-sm text-gray-700">
                              {bid.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>의뢰 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">예상 예산</p>
                  <p className="font-semibold text-lg">{project.budget}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">희망 완료일</p>
                  <p className="font-medium">{project.deadline}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">지역</p>
                  <p className="font-medium">{project.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">입찰 전문가</p>
                  <p className="font-semibold text-lg">
                    {project.bids.length}명
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>입찰 통계</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">최저 입찰가</span>
                <span className="font-semibold text-green-600">
                  {sortedBids[0]?.price}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">최고 입찰가</span>
                <span className="font-semibold text-gray-700">
                  {sortedBids[sortedBids.length - 1]?.price}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">평균 입찰가</span>
                <span className="font-semibold">
                  ₩
                  {Math.round(
                    sortedBids.reduce(
                      (sum, bid) =>
                        sum + parseInt(bid.price.replace(/[^0-9]/g, "")),
                      0,
                    ) / sortedBids.length,
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">인증 전문가</span>
                <span className="font-semibold">
                  {project.bids.filter((b) => b.verified).length}명 /{" "}
                  {project.bids.length}명
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>진행 타임라인</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  ["의뢰 등록", project.createdAt],
                  ["전문가 입찰 시작", `${project.createdAt} 14:30`],
                ].map(([label, date]) => (
                  <div key={label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-[#009689]" />
                      <div className="w-0.5 h-full bg-gray-200" />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-gray-500">{date}</p>
                    </div>
                  </div>
                ))}
                {project.selectedExpert && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-[#009689]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">전문가 선택</p>
                      <p className="text-xs text-gray-500">
                        {project.selectedExpert.selectedAt}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
