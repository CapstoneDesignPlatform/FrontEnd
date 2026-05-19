import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";

import { IndustrySelection } from "./createProject/IndustrySelection";
import { PurposeSelection } from "./createProject/ProjectPurpose";
import {
  industryLabels,
  projectTabLabels,
} from "./createProject/createProjectConfig";
import {
  LicenseRequestForm,
  PeriodicReportForm,
  SurveyRequestForm,
  OtherRequestForm,
  BaseProjectForm,
} from "./createProject/CreateProjectForms";

import type {
  BaseProjectFormData,
  ConstructionLicenseData,
  ConstructionSurveyData,
  ConstructionOtherData,
  ElectricalPeriodicData,
  ProjectTab,
} from "./createProject/types";

// --- 초기 데이터 ---
const initialLicenseData: ConstructionLicenseData = {
  businessType: "corporation", classification: "new", requiredLicense: "",
  currentIndustryType: "none", currentIndustryDetail: "", assetScale: "",
};
const initialPeriodicData: ElectricalPeriodicData = { businessType: "corporation", assetScale: "" };
const initialSurveyData: ConstructionSurveyData = { businessType: "corporation", currentLicense: "", assetScale: "" };
const initialOtherData: ConstructionOtherData = { businessType: "corporation", reason: "capital", assetScale: "" };
const initialBaseData: BaseProjectFormData = { title: "", description: "", budget: "", deadline: "", requirements: "", location: "" };

type Step = "industry" | "purpose" | "detail" | "base";

export function CreateProject() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("industry");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [activeTab, setActiveTab] = useState<ProjectTab>("license");

  // 데이터 상태
  const [constructionLicenseData, setConstructionLicenseData] = useState(initialLicenseData);
  const [electricalPeriodicData, setElectricalPeriodicData] = useState(initialPeriodicData);
  const [constructionSurveyData, setConstructionSurveyData] = useState(initialSurveyData);
  const [constructionOtherData, setConstructionOtherData] = useState(initialOtherData);
  const [formData, setFormData] = useState(initialBaseData);

  // ✅ [수정] 산업군에 따른 탭 필터링 로직
  // 건설업(construction)일 때는 periodic(주기적 신고)을 제외합니다.
  const visibleTabs: ProjectTab[] = selectedIndustry === "construction" 
    ? ["license", "survey", "other"] 
    : ["license", "periodic", "survey", "other"];

  const handleDetailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep("base");
  };

  const handleBaseSubmit = (projectCode: string) => {
    navigate(`/client/project-success/${projectCode}`);
  };

  const handleCancel = () => {
    setStep("detail");
  };

  const isSupportedDetailIndustry = (industry: string) => {
    return industry === "construction" || industry === "electrical";
  };

  const getDetailData = () => {
    switch (activeTab) {
      case "license": return constructionLicenseData;
      case "periodic": return electricalPeriodicData;
      case "survey": return constructionSurveyData;
      case "other": return constructionOtherData;
      default: return constructionLicenseData;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {step === "industry" && (
        <IndustrySelection onSelectIndustry={(ind) => { setSelectedIndustry(ind); setStep("purpose"); }} />
      )}

      {step === "purpose" && (
        <PurposeSelection onSelectPurpose={(purp) => { 
          setActiveTab(purp as ProjectTab); 
          setStep("detail"); 
        }} />
      )}

      {(step === "detail" || step === "base") && (
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                의뢰 공고 작성 - {industryLabels[selectedIndustry] ?? selectedIndustry}
              </CardTitle>
              <CardDescription>
                전문가에게 의뢰할 프로젝트 정보를 상세히 작성해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={(tab) => {
                  setActiveTab(tab as ProjectTab);
                  setStep("detail");
                }}
                className="w-full"
              >
                <TabsList
                  className={`grid w-full mb-6 ${
                    visibleTabs.length === 4 ? "grid-cols-4" : "grid-cols-3"
                  }`}
                >
                  {visibleTabs.map((tab) => (
                    <TabsTrigger key={tab} value={tab}>
                      {projectTabLabels[tab]}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {visibleTabs.map((tab) => (
                  <TabsContent key={tab} value={tab}>
                    {renderProjectForm(tab)}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  function renderProjectForm(tab: ProjectTab) {
    if (step === "base") {
      return (
        <BaseProjectForm
          activeTab={tab}
          industry={selectedIndustry}
          detailData={getDetailData()}
          onCancel={handleCancel}
          onSubmit={handleBaseSubmit}
        />
      );
    }

    if (isSupportedDetailIndustry(selectedIndustry)) {
      switch (tab) {
        case "license":
          return <LicenseRequestForm data={constructionLicenseData} onChange={setConstructionLicenseData} onSubmit={handleDetailSubmit} />;
        case "periodic":
          // ✅ 건설업일 때는 주기적 신고 폼을 아예 렌더링하지 않음
          if (selectedIndustry === "electrical") {
            return <PeriodicReportForm data={electricalPeriodicData} onChange={setElectricalPeriodicData} onSubmit={handleDetailSubmit} />;
          }
          break;
        case "survey":
          return <SurveyRequestForm data={constructionSurveyData} onChange={setConstructionSurveyData} onSubmit={handleDetailSubmit} />;
        case "other":
          return <OtherRequestForm data={constructionOtherData} industry={selectedIndustry} onChange={setConstructionOtherData} onSubmit={handleDetailSubmit} />;
      }
    }

    return (
      <BaseProjectForm
        activeTab={tab}
        data={formData}
        industry={selectedIndustry}
        onCancel={handleCancel}
        onChange={setFormData}
        onSubmit={handleDetailSubmit}
      />
    );
  }
}