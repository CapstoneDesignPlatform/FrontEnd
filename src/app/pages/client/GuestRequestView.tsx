import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { CheckCircle2, Circle, CreditCard, Edit } from "lucide-react";
import { ExpertBidModal } from "../../components/modals/ExpertBidModal";

export function GuestRequestView() {
  const location = useLocation();
  const requestCode = location.state?.requestCode || "REQ-20260406-ABCD";

  // 현재 진행중인 의뢰 데모 데이터
  const [projectData, setProjectData] = useState({
    id: 1,
    registrationDate: "2026-04-01",
    industry: "건설업",
    businessType: "법인 사업자",
    category: "필요 면허",
    requiredLicense: "일반건설업(토목공사업)",
    currentIndustry: "비건설업",
    assetScale: "50억원",
    currentStep: 3,
    bids: [
      { id: 1, expertName: "김전문", companyName: "건설면허 컨설팅", phone: "010-1234-5678", email: "kim@pro.com", expertIntro: "건설 면허 10년 경력자입니다.", proposedAmount: 2500000, confirmedAmount: 0, isSelected: false },
      { id: 2, expertName: "이상담", companyName: "면허취득 도우미", phone: "010-2345-6789", email: "lee@help.com", expertIntro: "신속한 처리를 약속드립니다.", proposedAmount: 2300000, confirmedAmount: 0, isSelected: false },
      { id: 3, expertName: "박컨설팅", companyName: "건설업 전문가", phone: "010-3456-7890", email: "park@biz.com", expertIntro: "최상의 컨설팅을 제공합니다.", proposedAmount: 2800000, confirmedAmount: 0, isSelected: false },
    ],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<any | null>(null);

  // 기업 정보 데모 데이터
  const companyInfo = {
    companyName: "(주)테스트건설",
    businessNumber: "123-45-67890",
    representative: "홍길동",
    address: "서울특별시 강남구 테헤란로 123",
    phoneNumber: "02-1234-5678",
    email: "test@example.com",
    establishDate: "2020-01-15",
    capital: "100,000,000원",
  };

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

  const handleEditCompanyInfo = () => {
    // 기업 정보 수정 로직 (추후 구현)
    alert("기업 정보 수정 기능은 추후 구현됩니다.");
  };

  const handleConfirmExpert = (bidId: number, amount: number) => {
    setProjectData((prev) => ({
      ...prev,
      bids: prev.bids.map((bid) => 
        bid.id === bidId 
          ? { ...bid, isSelected: true, confirmedAmount: amount }
          : { ...bid, isSelected: false, confirmedAmount: 0 }
      )
    }));
  };

  const handleCancelExpert = (bidId: number) => {
    setProjectData((prev) => ({
      ...prev,
      bids: prev.bids.map((bid) => 
        bid.id === bidId ? { ...bid, isSelected: false, confirmedAmount: 0 } : bid
      )
    }));
  };

  const handleBidClick = (bid: any) => {
    setSelectedBid(bid);
    setIsModalOpen(true);
  };

  const selectedExpert = projectData.bids.find(b => b.isSelected);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">비회원 의뢰 조회</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">의뢰 코드</p>
          <p className="text-lg font-mono font-semibold text-blue-600">{requestCode}</p>
        </div>
      </div>

      {/* 현재 진행중인 의뢰 */}
      {projectData && (
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
                  className="absolute top-5 left-0 h-0.5 bg-blue-600 transition-all duration-500" 
                  style={{ 
                    width: `calc(${((projectData.currentStep - 1) / (steps.length - 1)) * 100}% - 40px + ${((projectData.currentStep - 1) / (steps.length - 1)) * 40}px)`,
                    left: '20px'
                  }} 
                />

                {/* 단계 */}
                <div className="relative flex justify-between">
                  {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center" style={{ width: '140px' }}>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 z-10 transition-all duration-300 ${
                          step.id < projectData.currentStep
                            ? "bg-blue-600 text-white"
                            : step.id === projectData.currentStep
                            ? "bg-blue-600 text-white ring-4 ring-blue-200"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {step.id <projectData.currentStep ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <Circle className="w-6 h-6" fill={step.id === projectData.currentStep ? "white" : "none"} />
                        )}
                      </div>
                      <span
                        className={`text-sm text-center font-medium ${
                          step.id <= projectData.currentStep ? "text-blue-600" : "text-gray-500"
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
                      <td className="px-4 py-3 text-sm">{projectData.registrationDate}</td>
                      <td className="px-4 py-3 text-sm">{projectData.industry}</td>
                      <td className="px-4 py-3 text-sm">{projectData.businessType}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline">{projectData.category}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">{projectData.requiredLicense}</td>
                      <td className="px-4 py-3 text-sm">{projectData.currentIndustry}</td>
                      <td className="px-4 py-3 text-sm">{projectData.assetScale}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 전문가 견적서 테이블 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>전문가 견적서</CardTitle>
              {selectedExpert && <Badge className="bg-blue-100 text-blue-700 border-none">전문가 확정 완료</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-500 text-sm">
                    <th className="px-4 py-3 text-left font-semibold">전문가</th>
                    <th className="px-4 py-3 text-left font-semibold">상호명</th>
                    <th className="px-4 py-3 text-left font-semibold">전화번호</th>
                    <th className="px-4 py-3 text-left font-semibold">이메일</th>
                    <th className="px-4 py-3 text-left font-semibold text-right">전문가 제시액</th>
                    <th className="px-4 py-3 text-left font-semibold text-right">최종 확정금액</th>
                    <th className="px-4 py-3 text-center font-semibold">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {projectData.bids.map((bid) => (
                    <tr 
                      key={bid.id} 
                      onClick={() => handleBidClick(bid)}
                      className={`border-b cursor-pointer hover:bg-blue-50/50 transition-colors ${bid.isSelected ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-3 text-sm font-medium">{bid.expertName}</td>
                      <td className="px-4 py-3 text-sm">{bid.companyName}</td>
                      <td className="px-4 py-3 text-sm">{bid.phone}</td>
                      <td className="px-4 py-3 text-sm">{bid.email}</td>
                      <td className="px-4 py-3 text-sm text-right">{formatCurrency(bid.proposedAmount)}</td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-blue-600">
                        {bid.isSelected ? formatCurrency(bid.confirmedAmount) : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {bid.isSelected ? <Badge className="bg-blue-600">선택됨</Badge> : <Button variant="outline" size="sm" className="h-7 text-xs border-blue-200 text-blue-600">상세보기</Button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 결제 섹션 (Blue 테마) */}
            {projectData.currentStep === 3 && selectedExpert && (
              <div className="pt-6 border-t">
                <div className="flex items-center justify-between bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                  <div>
                    <p className="text-sm text-blue-800 font-medium mb-1">최종 확정 전문가: {selectedExpert.expertName}</p>
                    <p className="text-3xl font-bold text-blue-600">{formatCurrency(selectedExpert.confirmedAmount)}</p>
                  </div>
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-14 px-8 rounded-xl shadow-lg shadow-blue-200 gap-2">
                    <CreditCard className="w-5 h-5" /> 결제하기
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      )}

      {/* 3. 기업 정보 */}
      <div className="space-y-6">
        <h2 className="text-2xl">기업 정보</h2>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>등록된 기업 정보</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleEditCompanyInfo}
              >
                <Edit className="w-4 h-4" />
                수정
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">기업명</p>
                  <p className="font-semibold">{companyInfo.companyName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">사업자등록번호</p>
                  <p className="font-semibold">{companyInfo.businessNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">대표자명</p>
                  <p className="font-semibold">{companyInfo.representative}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">주소</p>
                  <p className="font-semibold">{companyInfo.address}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">이메일</p>
                  <p className="font-semibold">{companyInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">전화번호</p>
                  <p className="font-semibold">{companyInfo.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">설립일</p>
                  <p className="font-semibold">{companyInfo.establishDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">자본금</p>
                  <p className="font-semibold">{companyInfo.capital}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">💡 안내사항:</span> 기업 정보에 변동사항이 있거나 오입력하신 내용이 있다면 
                  우측 상단의 "수정" 버튼을 눌러 정보를 업데이트하실 수 있습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <ExpertBidModal
        bid={selectedBid} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmExpert}
        onCancel={handleCancelExpert}
      />
    </div>
  );
}