import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { toast } from "sonner";

export function CreateProject() {
  const navigate = useNavigate();
  const { industry } = useParams<{ industry: string }>();
  const [activeTab, setActiveTab] = useState("license");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    requirements: "",
    location: "",
  });

  // 건설업 - 필요 면허 전용 필드
  const [constructionLicenseData, setConstructionLicenseData] = useState({
    businessType: "corporation", // corporation, individual, startup
    classification: "new", // new, additional
    requiredLicense: "",
    currentIndustryType: "none", // construction, nonConstruction, none
    currentIndustryDetail: "",
    assetScale: "",
  });

  // 건설업 - 실태조사 전용 필드
  const [constructionSurveyData, setConstructionSurveyData] = useState({
    businessType: "corporation", // corporation, individual
    currentLicense: "",
    assetScale: "",
  });

  // 건설업 - 기타 전용 필드
  const [constructionOtherData, setConstructionOtherData] = useState({
    businessType: "corporation", // corporation, individual
    reason: "capital", // capital, transfer, merger
    assetScale: "",
  });

  // 전기공사업 - 주기적 신고 전용 필드
  const [electricalPeriodicData, setElectricalPeriodicData] = useState({
    businessType: "corporation", // corporation, individual
    assetScale: "",
  });

  const industryLabels: Record<string, string> = {
    construction: "건설업",
    electrical: "전기공사업",
    information: "정보통신공사업",
    fire: "소방시설공사업",
    pharmaceutical: "의약품도매상",
    other: "기타",
  };

  const industries = [
    { label: "건설업", value: "construction" },
    { label: "전기공사업", value: "electrical" },
    { label: "정보통신공사업", value: "information" },
    { label: "소방시설공사업", value: "fire" },
    { label: "의약품도매상", value: "pharmaceutical" },
    { label: "기타", value: "other" },
  ];

  // 창업 예정 선택시 자동으로 현재 업종을 "없음"으로 설정
  useEffect(() => {
    if (constructionLicenseData.businessType === "startup") {
      setConstructionLicenseData(prev => ({
        ...prev,
        currentIndustryType: "none",
        currentIndustryDetail: "",
        assetScale: "",
      }));
    }
  }, [constructionLicenseData.businessType]);

  // 업종이 선택되지 않은 경우 업종 선택 화면 표시
  if (!industry) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">업종 선택</CardTitle>
            <CardDescription>
              의뢰하실 업종을 먼저 선택해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {industries.map((ind) => (
                <Card
                  key={ind.value}
                  className="cursor-pointer hover:border-[#009689] hover:shadow-md transition-all"
                  onClick={() => navigate(`/client/create-project/${ind.value}`)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{ind.label}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 의뢰 코드 생성 (실제로는 서버에서 생성)
    const projectCode = `REQ-${Date.now().toString(36).toUpperCase()}`;
    
    toast.success("공고가 등록되었습니다!");
    navigate(`/client/project-success/${projectCode}`);
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case "license":
        return "필요 면허";
      case "survey":
        return "실태 조사";
      case "other":
        return "기타";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            의뢰 공고 작성 {industry && `- ${industryLabels[industry] || industry}`}
          </CardTitle>
          <CardDescription>
            전문가에게 의뢰할 프로젝트 정보를 상세히 작성해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {industry === "electrical" ? (
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="license">필요 면허</TabsTrigger>
                <TabsTrigger value="periodic">주기적 신고</TabsTrigger>
                <TabsTrigger value="survey">실태 조사</TabsTrigger>
                <TabsTrigger value="other">기타</TabsTrigger>
              </TabsList>
            ) : (
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="license">필요 면허</TabsTrigger>
                <TabsTrigger value="survey">실태 조사</TabsTrigger>
                <TabsTrigger value="other">기타</TabsTrigger>
              </TabsList>
            )}

            <TabsContent value="license">
              <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                <h3 className="font-semibold text-teal-900 mb-2">필요 면허 공고 가이드</h3>
                <ul className="text-sm text-teal-800 space-y-1">
                  <li>• 사업자 유형과 신규/추가 여부를 정확히 선택해주세요</li>
                  <li>• 필요한 면허의 정확한 명칭과 종류를 기재해주세요</li>
                  <li>• 현재 운영 중인 업종이 있다면 상세히 입력해주세요</li>
                  <li>• 자산 규모는 면허 심사에 중요한 요소이므로 정확히 입력해주세요</li>
                </ul>
              </div>
              {renderForm()}
            </TabsContent>

            {industry === "electrical" && (
              <TabsContent value="periodic">
                <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <h3 className="font-semibold text-teal-900 mb-2">주기적 신고 공고 가이드</h3>
                  <ul className="text-sm text-teal-800 space-y-1">
                    <li>• 사업자 유형을 정확히 선택해주세요</li>
                    <li>• 자산 규모를 정확히 입력해주세요</li>
                  </ul>
                </div>
                {renderForm()}
              </TabsContent>
            )}

            <TabsContent value="survey">
              <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                <h3 className="font-semibold text-teal-900 mb-2">실태 조사 공고 가이드</h3>
                <ul className="text-sm text-teal-800 space-y-1">
                  <li>• 사업자 유형을 정확히 선택해주세요</li>
                  <li>• 현재 보유하고 있는 면허를 정확히 입력해주세요</li>
                  <li>• 자산 규모는 실태 조사에 필요한 정보이므로 정확히 입력해주세요</li>
                </ul>
              </div>
              {renderForm()}
            </TabsContent>

            <TabsContent value="other">
              <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                <h3 className="font-semibold text-teal-900 mb-2">기타 서비스 공고 가이드</h3>
                <ul className="text-sm text-teal-800 space-y-1">
                  <li>• 사업자 유형을 정확히 선택해주세요</li>
                  <li>• 진단이 필요한 사유를 선택해주세요 (자본금 변동, 양도, 합병)</li>
                  <li>• 자산 규모를 정확히 입력해주세요</li>
                </ul>
              </div>
              {renderForm()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );

  function renderForm() {
    // 건설업, 전기공사업, 정보통신공사업, 소방시설공사업, 의약품도매상, 기타 - 필요 면허 전용 폼
    if ((industry === "construction" || industry === "electrical" || industry === "information" || industry === "fire" || industry === "pharmaceutical" || industry === "other") && activeTab === "license") {
      return (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. 사업자 유형 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              사업자 유형 <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant="outline"
                className={`h-auto py-4 ${
                  constructionLicenseData.businessType === "corporation"
                    ? "bg-[#009689] text-white border-[#009689] hover:bg-[#007d71]"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  setConstructionLicenseData({ ...constructionLicenseData, businessType: "corporation" })
                }
              >
                법인 사업자
              </Button>
              <Button
                type="button"
                variant="outline"
                className={`h-auto py-4 ${
                  constructionLicenseData.businessType === "individual"
                    ? "bg-[#009689] text-white border-[#009689] hover:bg-[#007d71]"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  setConstructionLicenseData({ ...constructionLicenseData, businessType: "individual" })
                }
              >
                개인 사업자
              </Button>
              <Button
                type="button"
                variant="outline"
                className={`h-auto py-4 ${
                  constructionLicenseData.businessType === "startup"
                    ? "bg-[#009689] text-white border-[#009689] hover:bg-[#007d71]"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  setConstructionLicenseData({ ...constructionLicenseData, businessType: "startup" })
                }
              >
                창업 예정
              </Button>
            </div>
          </div>

          {/* 2. 구분 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              구분 <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <Button
                type="button"
                variant="outline"
                className={`h-auto py-4 ${
                  constructionLicenseData.classification === "new"
                    ? "bg-[#009689] text-white border-[#009689] hover:bg-[#007d71]"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  setConstructionLicenseData({ ...constructionLicenseData, classification: "new" })
                }
              >
                신규
              </Button>
              <Button
                type="button"
                variant="outline"
                className={`h-auto py-4 ${
                  constructionLicenseData.classification === "additional"
                    ? "bg-[#009689] text-white border-[#009689] hover:bg-[#007d71]"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  setConstructionLicenseData({ ...constructionLicenseData, classification: "additional" })
                }
              >
                추가
              </Button>
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t pt-6"></div>

          {/* 3. 필요 면허 */}
          <div className="space-y-3">
            <Label htmlFor="requiredLicense" className="text-base font-semibold">
              필요 면허 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="requiredLicense"
              placeholder="필요한 면허를 입력합니다."
              value={constructionLicenseData.requiredLicense}
              onChange={(e) =>
                setConstructionLicenseData({
                  ...constructionLicenseData,
                  requiredLicense: e.target.value,
                })
              }
              className="text-base py-6"
              required
            />
            <p className="text-sm text-gray-500">
              예: 건설업 일반건설업(토목공사업), 전문건설업(실내건축공사업) 등
            </p>
          </div>

          {/* 구분선 */}
          <div className="border-t pt-6"></div>

          {/* 4. 현재 업종 */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">
                현재 업종 <span className="text-red-500">*</span>
              </Label>
              {constructionLicenseData.businessType === "startup" && (
                <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  <span>창업 예정 사업자는 자동으로 "없음"이 선택됩니다.</span>
                </p>
              )}
            </div>
            
            <div className="space-y-3">
              {/* 건설업 관련 */}
              <div className={`border-2 rounded-lg p-4 transition-all ${
                constructionLicenseData.currentIndustryType === "construction"
                  ? "border-[#009689] bg-teal-50"
                  : "border-gray-200 hover:border-gray-300"
              } ${constructionLicenseData.businessType === "startup" ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-3 mb-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={`${
                      constructionLicenseData.currentIndustryType === "construction"
                        ? "bg-[#009689] text-white border-[#009689] hover:bg-[#007d71]"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      constructionLicenseData.businessType !== "startup" &&
                      setConstructionLicenseData({
                        ...constructionLicenseData,
                        currentIndustryType: "construction",
                      })
                    }
                    disabled={constructionLicenseData.businessType === "startup"}
                  >
                    건설업 관련
                  </Button>
                </div>
                {constructionLicenseData.currentIndustryType === "construction" && (
                  <Input
                    placeholder="건설업 관련 업종을 상세히 입력해주세요 (예: 토목공사업)"
                    value={constructionLicenseData.currentIndustryDetail}
                    onChange={(e) =>
                      setConstructionLicenseData({
                        ...constructionLicenseData,
                        currentIndustryDetail: e.target.value,
                      })
                    }
                    className="mt-2"
                    required
                  />
                )}
              </div>

              {/* 비 건설업 관련 */}
              <div className={`border-2 rounded-lg p-4 transition-all ${
                constructionLicenseData.currentIndustryType === "nonConstruction"
                  ? "border-[#009689] bg-teal-50"
                  : "border-gray-200 hover:border-gray-300"
              } ${constructionLicenseData.businessType === "startup" ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-3 mb-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={`${
                      constructionLicenseData.currentIndustryType === "nonConstruction"
                        ? "bg-[#009689] text-white border-[#009689] hover:bg-[#007d71]"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      constructionLicenseData.businessType !== "startup" &&
                      setConstructionLicenseData({
                        ...constructionLicenseData,
                        currentIndustryType: "nonConstruction",
                      })
                    }
                    disabled={constructionLicenseData.businessType === "startup"}
                  >
                    비 건설업 관련
                  </Button>
                </div>
                {constructionLicenseData.currentIndustryType === "nonConstruction" && (
                  <Input
                    placeholder="비 건설업 관련 업종을 상세히 입력해주세요 (예: 제조업, 서비스업 등)"
                    value={constructionLicenseData.currentIndustryDetail}
                    onChange={(e) =>
                      setConstructionLicenseData({
                        ...constructionLicenseData,
                        currentIndustryDetail: e.target.value,
                      })
                    }
                    className="mt-2"
                    required
                  />
                )}
              </div>

              {/* 없음 */}
              <div className={`border-2 rounded-lg p-4 transition-all ${
                constructionLicenseData.currentIndustryType === "none"
                  ? "border-[#009689] bg-teal-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}>
                <div className="flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={`${
                      constructionLicenseData.currentIndustryType === "none"
                        ? "bg-[#009689] text-white border-[#009689] hover:bg-[#007d71]"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() =>
                      setConstructionLicenseData({
                        ...constructionLicenseData,
                        currentIndustryType: "none",
                        currentIndustryDetail: "",
                        assetScale: "",
                      })
                    }
                  >
                    없음
                  </Button>
                  <p className="text-sm text-gray-500">
                    창업 예정은 '없음'을 선택해주세요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t pt-6"></div>

          {/* 5. 자산 규모 */}
          <div className="space-y-3">
            <Label htmlFor="assetScale" className="text-base font-semibold">
              자산 규모 <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-3 max-w-md">
              <Input
                id="assetScale"
                type="number"
                placeholder="숫자만 입력"
                value={constructionLicenseData.assetScale}
                onChange={(e) =>
                  setConstructionLicenseData({
                    ...constructionLicenseData,
                    assetScale: e.target.value,
                  })
                }
                disabled={constructionLicenseData.currentIndustryType === "none"}
                required={constructionLicenseData.currentIndustryType !== "none"}
                className="text-base py-6"
              />
              <span className="text-lg font-semibold text-gray-700 whitespace-nowrap">억원</span>
            </div>
            {constructionLicenseData.currentIndustryType === "none" ? (
              <p className="text-sm text-amber-600 flex items-center gap-1">
                <span>⚠️</span>
                <span>현재 업종이 없는 경우 자산 규모를 입력할 수 없습니다.</span>
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                현재 보유하고 있는 자산 규모를 입력해주세요 (예: 10억원 → 10 입력)
              </p>
            )}
          </div>

          {/* 등록하기 버튼 */}
          <div className="pt-6 border-t">
            <Button type="submit" className="w-full h-14 text-lg bg-[#009689] hover:bg-[#007d71]" size="lg">
              등록하기
            </Button>
          </div>
        </form>
      );
    }

    // 건설업, 전기공사업 - 주기적 신고 전용 폼
    if (industry === "electrical" && activeTab === "periodic") {
      return (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. 사업자 유형 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              사업자 유형 <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <Button
                type="button"
                variant="outline"
                className={`h-auto py-4 ${
                  electricalPeriodicData.businessType === "corporation"
                    ? "bg-[#009689] text-white border-[#009689] hover:bg-[#007d71]"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  setElectricalPeriodicData({ ...electricalPeriodicData, businessType: "corporation" })
                }
              >
                법인 사업자
              </Button>
              <Button
                type="button"
                variant="outline"
                className={`h-auto py-4 ${
                  electricalPeriodicData.businessType === "individual"
                    ? "bg-[#009689] text-white border-[#009689] hover:bg-[#007d71]"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  setElectricalPeriodicData({ ...electricalPeriodicData, businessType: "individual" })
                }
              >
                개인 사업자
              </Button>
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t pt-6"></div>

          {/* 2. 자산 규모 */}
          <div className="space-y-3">
            <Label htmlFor="periodicAssetScale" className="text-base font-semibold">
              자산 규모 <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-3 max-w-md">
              <Input
                id="periodicAssetScale"
                type="number"
                placeholder="숫자만 입력"
                value={electricalPeriodicData.assetScale}
                onChange={(e) =>
                  setElectricalPeriodicData({
                    ...electricalPeriodicData,
                    assetScale: e.target.value,
                  })
                }
                className="text-base py-6"
                required
              />
              <span className="text-lg font-semibold text-gray-700 whitespace-nowrap">억원</span>
            </div>
            <p className="text-sm text-gray-500">
              현재 보유하고 있는 자산 규모를 입력해주세요 (예: 10억원 → 10 입력)
            </p>
          </div>

          {/* 등록하기 버튼 */}
          <div className="pt-6 border-t">
            <Button type="submit" className="w-full h-14 text-lg bg-[#009689] hover:bg-[#007d71]" size="lg">
              등록하기
            </Button>
          </div>
        </form>
      );
    }

    // 건설업, 전기공사업, 정보통신공사업, 소방시설공사업, 의약품도매상, 기타 - 실태조사 전용 폼
    if ((industry === "construction" || industry === "electrical" || industry === "information" || industry === "fire" || industry === "pharmaceutical" || industry === "other") && activeTab === "survey") {
      return (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. 사업자 유형 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              사업자 유형 <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <Button
                type="button"
                variant="outline"
                className={`h-auto py-4 ${
                  constructionSurveyData.businessType === "corporation"
                    ? "bg-[#009689] text-white border-[#009689] hover:bg-[#007d71]"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  setConstructionSurveyData({ ...constructionSurveyData, businessType: "corporation" })
                }
              >
                법인 사업자
              </Button>
              <Button
                type="button"
                variant="outline"
                className={`h-auto py-4 ${
                  constructionSurveyData.businessType === "individual"
                    ? "bg-[#009689] text-white border-[#009689] hover:bg-[#007d71]"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  setConstructionSurveyData({ ...constructionSurveyData, businessType: "individual" })
                }
              >
                개인 사업자
              </Button>
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t pt-6"></div>

          {/* 2. 보유 면허 */}
          <div className="space-y-3">
            <Label htmlFor="currentLicense" className="text-base font-semibold">
              보유 면허 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="currentLicense"
              placeholder="현재 보유하고 있는 면허를 입력해주세요"
              value={constructionSurveyData.currentLicense}
              onChange={(e) =>
                setConstructionSurveyData({
                  ...constructionSurveyData,
                  currentLicense: e.target.value,
                })
              }
              className="text-base py-6"
              required
            />
            <p className="text-sm text-gray-500">
              예: 건설업 일반건설업(토목공사업), 전문건설업(실내건축공사업) 등
            </p>
          </div>

          {/* 구분선 */}
          <div className="border-t pt-6"></div>

          {/* 3. 자산 규모 */}
          <div className="space-y-3">
            <Label htmlFor="surveyAssetScale" className="text-base font-semibold">
              자산 규모 <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-3 max-w-md">
              <Input
                id="surveyAssetScale"
                type="number"
                placeholder="숫자만 입력"
                value={constructionSurveyData.assetScale}
                onChange={(e) =>
                  setConstructionSurveyData({
                    ...constructionSurveyData,
                    assetScale: e.target.value,
                  })
                }
                className="text-base py-6"
                required
              />
              <span className="text-lg font-semibold text-gray-700 whitespace-nowrap">억원</span>
            </div>
            <p className="text-sm text-gray-500">
              현재 보유하고 있는 자산 규모를 입력해주세요 (예: 10억원 → 10 입력)
            </p>
          </div>

          {/* 등록하기 버튼 */}
          <div className="pt-6 border-t">
            <Button type="submit" className="w-full h-14 text-lg bg-[#009689] hover:bg-[#007d71]" size="lg">
              등록하기
            </Button>
          </div>
        </form>
      );
    }

    // 건설업, 전기공사업, 정보통신공사업, 소방시설공사업, 의약품도매상, 기타 - 기타 전용 폼
    if ((industry === "construction" || industry === "electrical" || industry === "information" || industry === "fire" || industry === "pharmaceutical" || industry === "other") && activeTab === "other") {
      return (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. 사업자 유형 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              사업자 유형 <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <Button
                type="button"
                variant="outline"
                className={`h-auto py-4 ${
                  constructionOtherData.businessType === "corporation"
                    ? "bg-[#009689] text-white border-[#009689] hover:bg-[#007d71]"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  setConstructionOtherData({ ...constructionOtherData, businessType: "corporation" })
                }
              >
                법인 사업자
              </Button>
              <Button
                type="button"
                variant="outline"
                className={`h-auto py-4 ${
                  constructionOtherData.businessType === "individual"
                    ? "bg-[#009689] text-white border-[#009689] hover:bg-[#007d71]"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  setConstructionOtherData({ ...constructionOtherData, businessType: "individual" })
                }
              >
                개인 사업자
              </Button>
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t pt-6"></div>

          {/* 2. 이유 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              진단 사유 <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant="outline"
                className={`h-auto py-4 ${
                  constructionOtherData.reason === "capital"
                    ? "bg-[#009689] text-white border-[#009689] hover:bg-[#007d71]"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  setConstructionOtherData({ ...constructionOtherData, reason: "capital" })
                }
              >
                자본금 변동
              </Button>
              <Button
                type="button"
                variant="outline"
                className={`h-auto py-4 ${
                  constructionOtherData.reason === "transfer"
                    ? "bg-[#009689] text-white border-[#009689] hover:bg-[#007d71]"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  setConstructionOtherData({ ...constructionOtherData, reason: "transfer" })
                }
              >
                양도
              </Button>
              <Button
                type="button"
                variant="outline"
                className={`h-auto py-4 ${
                  constructionOtherData.reason === "merger"
                    ? "bg-[#009689] text-white border-[#009689] hover:bg-[#007d71]"
                    : "hover:bg-gray-50"
                }`}
                onClick={() =>
                  setConstructionOtherData({ ...constructionOtherData, reason: "merger" })
                }
              >
                합병
              </Button>
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t pt-6"></div>

          {/* 3. 자산 규모 */}
          <div className="space-y-3">
            <Label htmlFor="otherAssetScale" className="text-base font-semibold">
              자산 규모 {(industry === "electrical" || industry === "information" || industry === "fire" || industry === "pharmaceutical" || industry === "other") && "(증자 이전)"} <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-3 max-w-md">
              <Input
                id="otherAssetScale"
                type="number"
                placeholder="숫자만 입력"
                value={constructionOtherData.assetScale}
                onChange={(e) =>
                  setConstructionOtherData({
                    ...constructionOtherData,
                    assetScale: e.target.value,
                  })
                }
                className="text-base py-6"
                required
              />
              <span className="text-lg font-semibold text-gray-700 whitespace-nowrap">억원</span>
            </div>
            <p className="text-sm text-gray-500">
              현재 보유하고 있는 자산 규모를 입력해주세요 (예: 10억원 → 10 입력)
            </p>
          </div>

          {/* 등록하기 버튼 */}
          <div className="pt-6 border-t">
            <Button type="submit" className="w-full h-14 text-lg bg-[#009689] hover:bg-[#007d71]" size="lg">
              등록하기
            </Button>
          </div>
        </form>
      );
    }

    // 기본 폼 (다른 업종 또는 다른 탭)
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 제목 */}
        <div className="space-y-2">
          <Label htmlFor="title">
            공고 제목 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            placeholder={`예) ${industry ? industryLabels[industry] : ''} ${getTabLabel(activeTab)} 의뢰`}
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* 상세 설명 */}
        <div className="space-y-2">
          <Label htmlFor="description">
            상세 설명 <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="프로젝트에 대한 상세한 설명을 입력해주세요."
            rows={6}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* 예산 및 기한 */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="budget">예상 예산</Label>
            <Input
              id="budget"
              name="budget"
              type="number"
              placeholder="원 (예: 3000000)"
              value={formData.budget}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-600">
              입찰 참고용입니다. 최종 가격은 협의를 통해 결정됩니다.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">
              완료 희망일 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* 지역 */}
        <div className="space-y-2">
          <Label htmlFor="location">지역</Label>
          <Input
            id="location"
            name="location"
            placeholder="예) 서울특별시 강남구"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        {/* 요구사항 */}
        <div className="space-y-2">
          <Label htmlFor="requirements">필수 요구사항</Label>
          <Textarea
            id="requirements"
            name="requirements"
            placeholder="전문가가 갖추어야 할 자격이나 요구사항을 입력해주세요."
            rows={4}
            value={formData.requirements}
            onChange={handleChange}
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            공고 게시하기
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/client/dashboard")}
          >
            취소
          </Button>
        </div>
      </form>
    );
  }
}