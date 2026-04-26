import { useEffect, useState } from "react";

import {
  initialBaseProjectFormData,
  initialConstructionLicenseData,
  initialConstructionOtherData,
  initialConstructionSurveyData,
  initialElectricalPeriodicData,
} from "./createProjectConfig";
import type { ProjectTab } from "./types";

export function useCreateProjectState() {
  const [activeTab, setActiveTab] = useState<ProjectTab>("license");
  const [formData, setFormData] = useState(initialBaseProjectFormData);
  const [constructionLicenseData, setConstructionLicenseData] = useState(
    initialConstructionLicenseData,
  );
  const [constructionSurveyData, setConstructionSurveyData] = useState(
    initialConstructionSurveyData,
  );
  const [constructionOtherData, setConstructionOtherData] = useState(
    initialConstructionOtherData,
  );
  const [electricalPeriodicData, setElectricalPeriodicData] = useState(
    initialElectricalPeriodicData,
  );

  useEffect(() => {
    if (constructionLicenseData.businessType !== "startup") return;

    setConstructionLicenseData((current) => ({
      ...current,
      currentIndustryType: "none",
      currentIndustryDetail: "",
      assetScale: "",
    }));
  }, [constructionLicenseData.businessType]);

  return {
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
  };
}
