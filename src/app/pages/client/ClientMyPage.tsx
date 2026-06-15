import { useState } from "react";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { CheckCircle2, Circle, CreditCard } from "lucide-react";
import { ExpertBidModal } from "../../components/modals/ExpertBidModal";

export function ClientMyPage() {
  const [selectedPastProject, setSelectedPastProject] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<any | null>(null);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  // 현재 진행중인 의뢰 데이터를 상태로 관리
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
    { 
      id: 1, 
      expertName: "김전문", 
      companyName: "건설면허 컨설팅", 
      phone: "010-1234-5678", 
      email: "kim@consulting.com",
      proposedAmount: 2500000, 
      confirmedAmount: 0, 
      isSelected: false,
      expertIntro: "건설 관련 면허 취득 경력 10년 이상입니다. 신속하고 정확하게 처리해드리겠습니다." 
    },
    { 
      id: 2, 
      expertName: "이상담", 
      companyName: "면허취득 도우미", 
      phone: "010-2345-6789", 
      email: "lee@consulting.com",
      proposedAmount: 2300000, 
      confirmedAmount: 0, 
      isSelected: false,
      expertIntro: "수많은 성공 케이스를 보유한 면허 전문 행정사입니다. 고객님의 상황에 맞는 맞춤형 컨설팅을 약속드립니다." 
    },
    { 
      id: 3, 
      expertName: "박컨설팅", 
      companyName: "건설업 전문가", 
      phone: "010-3456-7890", 
      email: "park@consulting.com",
      proposedAmount: 2800000, 
      confirmedAmount: 0, 
      isSelected: false,
      expertIntro: "정직과 신뢰를 바탕으로 최선을 다하겠습니다. 언제든 편하게 문의주세요."
    },
  ],
  });

  // 과거 의뢰 내역 데모 데이터
  const pastProjects = [
    { id: 101, registrationDate: "2026-02-15", industry: "전기공사업", businessType: "법인 사업자", category: "실태 조사", requiredLicense: "-", assetScale: "30억원", bids: [ { id: 1, expertName: "최전기", companyName: "전기공사 컨설팅", phone: "010-4567-8901", email:"choi@consulting.com", proposedAmount: 1800000, confirmedAmount: 1800000, isSelected: true }, { id: 2, expertName: "정전문", companyName: "실태조사 전문", phone: "010-5678-9012", email:"jeong@consulting.com", proposedAmount: 2000000, confirmedAmount: 2000000, isSelected: false } ] },
    { id: 102, registrationDate: "2026-01-20", industry: "정보통신공사업", businessType: "개인 사업자", category: "필요 면허", requiredLicense: "정보통신공사업", assetScale: "15억원", bids: [ { id: 1, expertName: "강정보", companyName: "정보통신 면허센터", phone: "010-6789-0123", email:"kang@consulting.com", proposedAmount: 3200000, confirmedAmount: 3200000, isSelected: true } ] },
  ];

  const steps = [
    { id: 1, name: "필요 정보 등록" }, { id: 2, name: "마감" }, { id: 3, name: "전문가 선택" },
    { id: 4, name: "진단시작" }, { id: 5, name: "협회 경유" }, { id: 6, name: "작성 완료 및 발송" }, { id: 7, name: "수령" },
  ];

  const formatCurrency = (amount: number) => `₩${amount.toLocaleString()}`;

  // 전문가 선택 및 가격 반영 로직
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

  // 전문가 선택 취소 로직
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

  // 현재 선택된 전문가 찾기
  const selectedExpert = projectData.bids.find(b => b.isSelected);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">현재 진행중인 의뢰</h2>

        {/* 진행 상황 플로우차트 */}
        <Card>
          <CardHeader><CardTitle>진행 상황</CardTitle></CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" style={{ width: 'calc(100% - 40px)', left: '20px' }} />
              <div className="absolute top-5 left-0 h-0.5 bg-blue-600 transition-all duration-500" 
                style={{ width: `calc(${((projectData.currentStep - 1) / (steps.length - 1)) * 100}% - 40px + ${((projectData.currentStep - 1) / (steps.length - 1)) * 40}px)`, left: '20px' }} 
              />
              <div className="relative flex justify-between">
                {steps.map((step) => (
                  <div key={step.id} className="flex flex-col items-center" style={{ width: '140px' }}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 z-10 transition-all duration-300 ${
                      step.id < projectData.currentStep ? "bg-blue-600 text-white" : step.id === projectData.currentStep ? "bg-blue-600 text-white ring-4 ring-blue-200" : "bg-gray-200 text-gray-500"
                    }`}>
                      {step.id < projectData.currentStep ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" fill={step.id === projectData.currentStep ? "white" : "none"} />}
                    </div>
                    <span className={`text-sm text-center font-medium ${step.id <= projectData.currentStep ? "text-blue-600" : "text-gray-500"}`}>{step.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 의뢰 정보 */}
        <Card>
          <CardHeader><CardTitle>의뢰 정보</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-sm font-semibold">
                    <th className="px-4 py-3 text-left">등록일자</th>
                    <th className="px-4 py-3 text-left">진단 업종</th>
                    <th className="px-4 py-3 text-left">구분</th>
                    <th className="px-4 py-3 text-left">필요 면허</th>
                    <th className="px-4 py-3 text-left">자산 규모</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b text-sm">
                    <td className="px-4 py-3">{projectData.registrationDate}</td>
                    <td className="px-4 py-3">{projectData.industry}</td>
                    <td className="px-4 py-3"><Badge variant="outline">{projectData.category}</Badge></td>
                    <td className="px-4 py-3">{projectData.requiredLicense}</td>
                    <td className="px-4 py-3">{projectData.assetScale}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 전문가 견적서 */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <CardTitle>전문가 견적서</CardTitle>
                {projectData.currentStep < 4 ? (
                  <Button
                    size="sm"
                    className="bg-[#34499C] hover:bg-[#2a3d84] text-white px-4"
                    onClick={() => setIsCloseModalOpen(true)}
                  >
                    마감
                  </Button>
                ) : (
                  <Badge className="bg-red-100 text-red-600 border-red-200 px-3 py-1 font-bold">마감됨</Badge>
                )}
              </div>
              {selectedExpert && <Badge className="bg-blue-100 text-blue-700 border-none px-3 py-1 font-bold">선택 완료 (결제 대기)</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 마감 후 결제 안내 배너 */}
            {projectData.currentStep >= 4 && (
              <div className={`flex items-start gap-3 rounded-xl px-4 py-3 border ${selectedExpert ? "bg-blue-50 border-blue-200" : "bg-amber-50 border-amber-200"}`}>
                <CreditCard className={`w-5 h-5 mt-0.5 shrink-0 ${selectedExpert ? "text-blue-500" : "text-amber-500"}`} />
                <div>
                  <p className={`text-sm font-semibold ${selectedExpert ? "text-blue-800" : "text-amber-800"}`}>
                    {selectedExpert ? "결제를 진행해주세요" : "전문가를 선택하고 결제를 진행해주세요"}
                  </p>
                  <p className={`text-xs mt-0.5 ${selectedExpert ? "text-blue-600" : "text-amber-600"}`}>
                    {selectedExpert
                      ? `${selectedExpert.expertName} 전문가가 선택되었습니다. 아래 결제하기 버튼을 눌러 결제를 완료해주세요.`
                      : "견적서 목록에서 전문가를 클릭하여 선택한 후 결제를 진행해주세요."}
                  </p>
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-500 text-sm">
                    <th className="px-4 py-3 text-left font-semibold">전문가</th>
                    <th className="px-4 py-3 text-left font-semibold">상호명</th>
                    {projectData.currentStep >= 4 && <th className="px-4 py-3 text-left font-semibold">연락처</th>}
                    {projectData.currentStep >= 4 && <th className="px-4 py-3 text-left font-semibold">이메일</th>}
                    <th className="px-4 py-3 text-left font-semibold">전문가 제시</th>
                    <th className="px-4 py-3 text-left font-semibold">최종 확정금액</th>
                    <th className="px-4 py-3 text-center font-semibold">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {projectData.bids.map((bid) => (
                    <tr key={bid.id} onClick={() => handleBidClick(bid)} className={`border-b cursor-pointer transition-colors hover:bg-blue-50/30 ${bid.isSelected ? 'bg-blue-50' : ''}`}>
                      <td className="px-4 py-3 text-sm font-medium">{bid.expertName}</td>
                      <td className="px-4 py-3 text-sm">{bid.companyName}</td>
                      {projectData.currentStep >= 4 && <td className="px-4 py-3 text-sm">{bid.phone}</td>}
                      {projectData.currentStep >= 4 && <td className="px-4 py-3 text-sm">{bid.email}</td>}
                      <td className="px-4 py-3 text-sm">{formatCurrency(bid.proposedAmount)}</td>
                      <td className="px-4 py-3 text-sm font-bold text-blue-600">{bid.isSelected ? formatCurrency(bid.confirmedAmount) : "-"}</td>
                      <td className="px-4 py-3 text-center">{bid.isSelected ? <Badge className="bg-blue-600">선택됨</Badge> : <Button variant="outline" size="sm" className="h-7 text-xs">상세보기</Button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 결제 섹션 */}
            {projectData.currentStep >= 3 && selectedExpert && (
              <div className="pt-6 border-t animate-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                  <div>
                    <p className="text-sm text-blue-800 font-medium mb-1">최종 확정 전문가: {selectedExpert.expertName}</p>
                    <p className="text-3xl font-bold text-blue-700">{formatCurrency(selectedExpert.confirmedAmount)}</p>
                  </div>
                  <Button size="lg" disabled className="bg-blue-600 hover:bg-blue-700 h-14 px-8 rounded-xl shadow-lg shadow-blue-200 gap-2"><CreditCard className="w-5 h-5" /> 결제하기</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 마감 확인 모달 */}
        {isCloseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900">마감 확인</h3>
                <p className="text-sm text-gray-600">정말 마감하시겠습니까?<br />마감 후에는 새로운 견적을 받을 수 없습니다.</p>
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setIsCloseModalOpen(false)}>취소</Button>
                <Button
                  className="bg-[#34499C] hover:bg-[#2a3d84] text-white"
                  onClick={() => {
                    setProjectData((prev) => ({ ...prev, currentStep: 4 }));
                    setIsCloseModalOpen(false);
                  }}
                >
                  마감
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. 과거 의뢰 내역 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">과거 의뢰 내역</h2>

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
                  {pastProjects.length > 0 ? (
                    pastProjects.map((project) => (
                      <React.Fragment key={project.id}>
                        {/* 기본 정보 행 */}
                        <tr 
                          className={`border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedPastProject === project.id ? 'bg-blue-50/50' : ''
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
                              className={selectedPastProject === project.id ? 'text-blue-600' : ''}
                            >
                              {selectedPastProject === project.id ? '접기' : '보기'}
                            </Button>
                          </td>
                        </tr>

                        {selectedPastProject === project.id && (
                          <tr className="bg-gray-50/50">
                            <td colSpan={7} className="px-6 py-4">
                              <div className="bg-white border border-blue-100 rounded-lg shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="bg-blue-50 px-4 py-2 border-b border-blue-100">
                                  <span className="text-sm font-bold text-blue-800">
                                    {project.registrationDate} 의뢰 - 전문가 견적서 상세
                                  </span>
                                </div>
                                <table className="w-full border-collapse">
                                  <thead>
                                    <tr className="bg-gray-50 border-b text-xs text-gray-500">
                                      <th className="px-4 py-2 text-left">전문가</th>
                                      <th className="px-4 py-2 text-left">상호명</th>
                                      <th className="px-4 py-2 text-left">연락처</th>
                                      <th className="px-4 py-2 text-left">이메일</th>
                                      <th className="px-4 py-2 text-left">제시금액</th>
                                      <th className="px-4 py-2 text-left text-blue-600">확정금액</th>
                                      <th className="px-4 py-2 text-left">결과</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {project.bids.filter((bid) => bid.isSelected).map((bid) => (
                                      <tr key={bid.id} className="border-b last:border-0 bg-blue-50/30">
                                        <td className="px-4 py-2 text-sm font-medium">{bid.expertName}</td>
                                        <td className="px-4 py-2 text-sm">{bid.companyName}</td>
                                        <td className="px-4 py-2 text-sm">{bid.phone}</td>
                                        <td className="px-4 py-2 text-sm text-gray-500">{bid.email}</td>
                                        <td className="px-4 py-2 text-sm font-semibold">{formatCurrency(bid.proposedAmount)}</td>
                                        <td className="px-4 py-2 text-sm font-bold text-blue-600">
                                          {formatCurrency(bid.confirmedAmount)}
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                          <Badge className="bg-blue-600">선정</Badge>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-600">
                        과거 의뢰 내역이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
        viewOnly={projectData.currentStep < 4}
      />
    </div>
  );
}