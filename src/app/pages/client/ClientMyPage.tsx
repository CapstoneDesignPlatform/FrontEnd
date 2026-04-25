import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { CheckCircle2, Circle, CreditCard } from "lucide-react";

export function ClientMyPage() {
  const [selectedPastProject, setSelectedPastProject] = useState<number | null>(null);

  // 현재 진행중인 의뢰 데모 데이터
  const currentProject = {
    id: 1,
    registrationDate: "2026-04-01",
    industry: "건설업",
    businessType: "법인 사업자",
    category: "필요 면허",
    requiredLicense: "일반건설업(토목공사업)",
    currentIndustry: "비건설업",
    assetScale: "50억원",
    currentStep: 3, // 1: 필요 정보 등록, 2: 마감, 3: 결재, 4: 진단시작, 5: 협회 경유, 6: 작성 완료 및 발송, 7: 수령
    bids: [
      {
        id: 1,
        expertName: "김전문",
        companyName: "건설면허 컨설팅",
        phone: "010-1234-5678",
        proposedAmount: 2500000,
        confirmedAmount: 2500000,
        isSelected: false,
      },
      {
        id: 2,
        expertName: "이상담",
        companyName: "면허취득 도우미",
        phone: "010-2345-6789",
        proposedAmount: 2300000,
        confirmedAmount: 2400000,
        isSelected: true,
      },
      {
        id: 3,
        expertName: "박컨설팅",
        companyName: "건설업 전문가",
        phone: "010-3456-7890",
        proposedAmount: 2800000,
        confirmedAmount: 2800000,
        isSelected: false,
      },
    ],
  };

  // 과거 의뢰 내역 데모 데이터
  const pastProjects = [
    {
      id: 101,
      registrationDate: "2026-02-15",
      industry: "전기공사업",
      businessType: "법인 사업자",
      category: "실태 조사",
      requiredLicense: "-",
      assetScale: "30억원",
      bids: [
        {
          id: 1,
          expertName: "최전기",
          companyName: "전기공사 컨설팅",
          phone: "010-4567-8901",
          proposedAmount: 1800000,
          confirmedAmount: 1800000,
          isSelected: true,
        },
        {
          id: 2,
          expertName: "정전문",
          companyName: "실태조사 전문",
          phone: "010-5678-9012",
          proposedAmount: 2000000,
          confirmedAmount: 2000000,
          isSelected: false,
        },
      ],
    },
    {
      id: 102,
      registrationDate: "2026-01-20",
      industry: "정보통신공사업",
      businessType: "개인 사업자",
      category: "필요 면허",
      requiredLicense: "정보통신공사업",
      assetScale: "15억원",
      bids: [
        {
          id: 1,
          expertName: "강정보",
          companyName: "정보통신 면허센터",
          phone: "010-6789-0123",
          proposedAmount: 3200000,
          confirmedAmount: 3200000,
          isSelected: true,
        },
      ],
    },
  ];

  const steps = [
    { id: 1, name: "필요 정보 등록" },
    { id: 2, name: "마감" },
    { id: 3, name: "결재" },
    { id: 4, name: "진단시작" },
    { id: 5, name: "협회 경유" },
    { id: 6, name: "작성 완료 및 발송" },
    { id: 7, name: "수령" },
  ];

  const formatCurrency = (amount: number) => {
    return `₩${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-8">
      {/* 현재 진행중인 의뢰 */}
      {currentProject && (
        <div className="space-y-6">
          <h2 className="text-2xl">현재 진행중인 의뢰</h2>

          {/* 진행 상황 플로우차트 */}
          <Card>
            <CardHeader>
              <CardTitle>진행 상황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* 진행 바 배경 */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" style={{ width: 'calc(100% - 40px)', left: '20px' }} />
                
                {/* 진행 바 (현재 단계까지) */}
                <div 
                  className="absolute top-5 left-0 h-0.5 bg-teal-600 transition-all duration-500" 
                  style={{ 
                    width: `calc(${((currentProject.currentStep - 1) / (steps.length - 1)) * 100}% - 40px + ${((currentProject.currentStep - 1) / (steps.length - 1)) * 40}px)`,
                    left: '20px'
                  }} 
                />

                {/* 단계 */}
                <div className="relative flex justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex flex-col items-center" style={{ width: '140px' }}>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 z-10 transition-all duration-300 ${
                          step.id < currentProject.currentStep
                            ? "bg-teal-600 text-white"
                            : step.id === currentProject.currentStep
                            ? "bg-teal-600 text-white ring-4 ring-teal-200"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {step.id < currentProject.currentStep ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <Circle className="w-6 h-6" fill={step.id === currentProject.currentStep ? "white" : "none"} />
                        )}
                      </div>
                      <span
                        className={`text-sm text-center font-medium ${
                          step.id <= currentProject.currentStep ? "text-teal-600" : "text-gray-500"
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 1. 필요 면허 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>의뢰 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold">등록일자</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">진단 업종</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">사업자 유형</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">구분</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">필요 면허</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">현재 업종</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">자산 규모</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-3 text-sm">{currentProject.registrationDate}</td>
                      <td className="px-4 py-3 text-sm">{currentProject.industry}</td>
                      <td className="px-4 py-3 text-sm">{currentProject.businessType}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline">{currentProject.category}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">{currentProject.requiredLicense}</td>
                      <td className="px-4 py-3 text-sm">{currentProject.currentIndustry}</td>
                      <td className="px-4 py-3 text-sm">{currentProject.assetScale}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 2. 마감 후 전문가 견적서 */}
          <Card>
            <CardHeader>
              <CardTitle>전문가 견적서</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold">전문가</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">상호명</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">연락처</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">전문가 제시</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">의뢰인 확정</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">최종 선택</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProject.bids.map((bid) => (
                      <tr key={bid.id} className={`border-b ${bid.isSelected ? 'bg-teal-50' : ''}`}>
                        <td className="px-4 py-3 text-sm">{bid.expertName}</td>
                        <td className="px-4 py-3 text-sm">{bid.companyName}</td>
                        <td className="px-4 py-3 text-sm">{bid.phone}</td>
                        <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(bid.proposedAmount)}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-teal-600">
                          {bid.isSelected ? formatCurrency(bid.confirmedAmount) : "-"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {bid.isSelected ? (
                            <Badge className="bg-teal-600">선택됨</Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 결재 버튼 */}
              {currentProject.currentStep === 3 && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">결제 예정 금액</p>
                      <p className="text-2xl font-bold text-teal-600">
                        {formatCurrency(currentProject.bids.find(b => b.isSelected)?.confirmedAmount || 0)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">구매안전서비스(PG사 연계) 에스크로 결제</p>
                    </div>
                    <Button size="lg" className="bg-teal-600 hover:bg-teal-700 gap-2">
                      <CreditCard className="w-5 h-5" />
                      결제하기
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 3. 과거 의뢰 내역 */}
      <div className="space-y-6">
        <h2 className="text-2xl">과거 의뢰 내역</h2>

        {/* 의뢰 내역 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>의뢰 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold">등록일자</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">진단 업종</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">사업자 유형</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">구분</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">필요 면허</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">자산규모</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">상세</th>
                  </tr>
                </thead>
                <tbody>
                  {pastProjects.map((project) => (
                    <tr 
                      key={project.id} 
                      className={`border-b cursor-pointer hover:bg-gray-50 ${
                        selectedPastProject === project.id ? 'bg-teal-50' : ''
                      }`}
                      onClick={() => setSelectedPastProject(selectedPastProject === project.id ? null : project.id)}
                    >
                      <td className="px-4 py-3 text-sm">{project.registrationDate}</td>
                      <td className="px-4 py-3 text-sm">{project.industry}</td>
                      <td className="px-4 py-3 text-sm">{project.businessType}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline">{project.category}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">{project.requiredLicense}</td>
                      <td className="px-4 py-3 text-sm">{project.assetScale}</td>
                      <td className="px-4 py-3 text-sm">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPastProject(selectedPastProject === project.id ? null : project.id);
                          }}
                        >
                          {selectedPastProject === project.id ? '접기' : '보기'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 선택된 과거 의뢰의 전문가 견적서 */}
        {selectedPastProject && (
          <Card className="border-teal-200 bg-teal-50/30">
            <CardHeader>
              <CardTitle className="text-teal-900">
                {pastProjects.find(p => p.id === selectedPastProject)?.registrationDate} 의뢰 - 전문가 견적서
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold">전문가</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">상호명</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">연락처</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">전문가 제시금액</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">의뢰인 확정금액</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">최종선택 여부</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pastProjects
                      .find(p => p.id === selectedPastProject)
                      ?.bids.map((bid) => (
                        <tr key={bid.id} className={`border-b ${bid.isSelected ? 'bg-teal-50' : ''}`}>
                          <td className="px-4 py-3 text-sm">{bid.expertName}</td>
                          <td className="px-4 py-3 text-sm">{bid.companyName}</td>
                          <td className="px-4 py-3 text-sm">{bid.phone}</td>
                          <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(bid.proposedAmount)}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-teal-600">
                            {bid.isSelected ? formatCurrency(bid.confirmedAmount) : "-"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {bid.isSelected ? (
                              <Badge className="bg-teal-600">선택됨</Badge>
                            ) : (
                              <span className="text-gray-400">미선택</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {pastProjects.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-gray-600">
              과거 의뢰 내역이 없습니다.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}