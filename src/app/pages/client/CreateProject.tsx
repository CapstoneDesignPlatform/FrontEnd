import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  getVisibleTabs,
  industryLabels,
  isSupportedDetailIndustry,
  projectTabLabels,
} from "./createProject/createProjectConfig";
import {
  BaseProjectForm,
  LicenseRequestForm,
  OtherRequestForm,
  PeriodicReportForm,
  SurveyRequestForm,
} from "./createProject/CreateProjectForms";
import { IndustrySelection } from "./createProject/IndustrySelection";
import { ProjectGuide } from "./createProject/ProjectGuide";
import { useCreateProjectState } from "./createProject/useCreateProjectState";
import type { ProjectTab } from "./createProject/types";
import { PurposeSelection } from "./createProject/ProjectPurpose";

export function CreateProject() {
  const navigate = useNavigate();
  const { industry, tab } = useParams<{ industry: string; tab: string }>();
  const {
    activeTab,
    constructionLicenseData,
    constructionOtherData,
    constructionSurveyData,
    electricalPeriodicData,
    formData,
    setActiveTab,
    setConstructionLicenseData,
    setConstructionOtherData,
    setConstructionSurveyData,
    setElectricalPeriodicData,
    setFormData,
  } = useCreateProjectState();

  useEffect(() => {
    if (tab) {
      setActiveTab(tab as ProjectTab);
    }
  }, [tab, setActiveTab]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const projectCode = `REQ-${Date.now().toString(36).toUpperCase()}`;

    toast.success("공고가 등록되었습니다!");
    navigate(`/client/project-success/${projectCode}`);
  };

  const handleCancel = () => {
    navigate("/client/dashboard");
  };

  if (!industry) {
    return (
      <IndustrySelection
        onSelectIndustry={(selectedIndustry) =>
          navigate(`/client/create-project/${selectedIndustry}`)
        }
      />
    );
  }

  if (!tab) {
    return (
      <PurposeSelection
        onSelectPurpose={(selectedPurpose) => {
          navigate(`/client/create-project/${industry}/${selectedPurpose}`);
        }}
      />
    );
  }

  const selectedIndustry = industry;
  const visibleTabs = getVisibleTabs(selectedIndustry);

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            의뢰 공고 작성 - {industryLabels[selectedIndustry] ?? selectedIndustry}
          </CardTitle>
          <CardDescription>
            전문가에게 의뢰할 프로젝트 정보를 상세히 작성해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(tab) => setActiveTab(tab as ProjectTab)}
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
  );

  function renderProjectForm(tab: ProjectTab) {
    if (isSupportedDetailIndustry(selectedIndustry)) {
      switch (tab) {
        case "license":
          return (
            <LicenseRequestForm
              data={constructionLicenseData}
              onChange={setConstructionLicenseData}
              onSubmit={handleSubmit}
            />
          );
        case "periodic":
          if (selectedIndustry === "electrical") {
            return (
              <PeriodicReportForm
                data={electricalPeriodicData}
                onChange={setElectricalPeriodicData}
                onSubmit={handleSubmit}
              />
            );
          }
          break;
        case "survey":
          return (
            <SurveyRequestForm
              data={constructionSurveyData}
              onChange={setConstructionSurveyData}
              onSubmit={handleSubmit}
            />
          );
        case "other":
          return (
            <OtherRequestForm
              data={constructionOtherData}
              industry={selectedIndustry}
              onChange={setConstructionOtherData}
              onSubmit={handleSubmit}
            />
          );
      }
    }

    return (
      <BaseProjectForm
        activeTab={tab}
        data={formData}
        industry={selectedIndustry}
        onCancel={handleCancel}
        onChange={setFormData}
        onSubmit={handleSubmit}
      />
    );
  }
}
