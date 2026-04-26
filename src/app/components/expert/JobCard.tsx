import { Link } from "react-router-dom";
import { Bell, Building2, FileText, TrendingUp, type LucideIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { ExpertJobListItemVM } from "../../../types/expert";

interface JobCardProps {
  project: ExpertJobListItemVM;
}

export function JobCard({ project }: JobCardProps) {
  const getProjectDetails = () => {
    const details: Array<{ icon: LucideIcon; label: string }> = [];

    details.push({
      icon: Building2,
      label: project.businessType ?? "사업자 유형 미공개",
    });

    if (project.type === "필요 면허") {
      if (project.classification) {
        details.push({
          icon: FileText,
          label: `구분: ${project.classification}`,
        });
      }
      if (project.requiredLicense) {
        details.push({
          icon: FileText,
          label: `필요 면허: ${project.requiredLicense}`,
        });
      }
      if (project.currentIndustry) {
        details.push({
          icon: TrendingUp,
          label: `현재 업종: ${project.currentIndustry}`,
        });
      }
    }

    if (project.type === "실태 조사" && project.currentLicense) {
      details.push({
        icon: FileText,
        label: `보유 면허: ${project.currentLicense}`,
      });
    }

    if (project.type === "기타" && project.reason) {
      details.push({
        icon: FileText,
        label: `사유: ${project.reason}`,
      });
    }

    if (project.assetScale && project.assetScale !== "-") {
      details.push({
        icon: TrendingUp,
        label: `자산 규모: ${project.assetScale}`,
      });
    }

    return details;
  };

  const details = getProjectDetails();

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                {project.industry}
              </Badge>
              <Badge variant="outline">{project.type}</Badge>
              {project.isNew && (
                <Badge className="bg-red-100 text-red-700">NEW</Badge>
              )}
              <span className="text-sm text-gray-500">
                {project.postedDate} 등록
              </span>
            </div>
            <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* 의뢰인이 입력한 정보만 표시 */}
        <div className="grid md:grid-cols-2 gap-3 mb-4 bg-gray-50 p-4 rounded-lg">
          {details.map((detail, index) => (
            <div key={`${detail.label}-${index}`} className="flex items-center gap-2 text-sm text-gray-700">
              <detail.icon className="h-4 w-4 text-teal-600" />
              <span>{detail.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Bell className="h-4 w-4 text-teal-600" />
            <span className="font-medium">현재 입찰: {project.bids}개</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/expert/jobs/${project.id}`}>상세보기</Link>
          </Button>
          <Button asChild size="sm" className="bg-teal-600 hover:bg-teal-700">
            <Link to={`/expert/jobs/${project.id}/bid`}>입찰하기</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
