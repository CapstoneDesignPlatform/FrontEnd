import { Link } from "react-router-dom";

import type { ExpertJobListItemVM } from "../../../types/expert";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface JobTableProps {
  projects: ExpertJobListItemVM[];
}

const typeBadgeClass: Record<ExpertJobListItemVM["type"], string> = {
  "필요 면허": "border-teal-200 bg-teal-50 text-teal-700",
  "실태 조사": "border-blue-200 bg-blue-50 text-blue-700",
  "주기적 신고": "border-amber-200 bg-amber-50 text-amber-700",
  기타: "border-slate-200 bg-slate-50 text-slate-700",
};

function getRequirementText(project: ExpertJobListItemVM) {
  if (project.type === "필요 면허") {
    const parts = [
      project.classification,
      project.requiredLicense,
      project.currentIndustry ? `현재 ${project.currentIndustry}` : undefined,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(" · ") : "-";
  }

  if (project.type === "실태 조사") {
    return project.currentLicense ?? "보유 면허 확인 필요";
  }

  if (project.type === "주기적 신고") {
    return project.currentLicense ?? project.requiredLicense ?? "정기 신고";
  }

  return project.reason ?? "기타";
}

function formatJobNumber(id: number) {
  return `JOB-${String(id).padStart(4, "0")}`;
}

export function JobTable({ projects }: JobTableProps) {
  return (
    <div className="overflow-hidden rounded-b-xl bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse text-sm">
          <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-[0.08em] text-slate-500">
            <tr>
              <th scope="col" className="border-b px-3 py-2 font-semibold">
                No.
              </th>
              <th scope="col" className="border-b px-3 py-2 font-semibold">
                등록일
              </th>
              <th scope="col" className="border-b px-3 py-2 font-semibold">
                유형
              </th>
              <th scope="col" className="border-b px-3 py-2 font-semibold">
                업종
              </th>
              <th scope="col" className="border-b px-3 py-2 font-semibold">
                공고명 / 기업
              </th>
              <th scope="col" className="border-b px-3 py-2 font-semibold">
                핵심 조건
              </th>
              <th scope="col" className="border-b px-3 py-2 font-semibold">
                자산
              </th>
              <th scope="col" className="border-b px-3 py-2 text-right font-semibold">
                입찰
              </th>
              <th scope="col" className="border-b px-3 py-2 font-semibold">
                상태
              </th>
              <th
                scope="col"
                className="sticky right-0 border-b border-l bg-slate-50 px-3 py-2 text-right font-semibold"
              >
                액션
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="group bg-white transition-colors hover:bg-teal-50/50"
              >
                <td className="whitespace-nowrap px-3 py-2 font-mono text-xs text-slate-500">
                  {formatJobNumber(project.id)}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span>{project.postedDate}</span>
                    {project.isNew ? (
                      <Badge className="bg-red-100 px-1.5 py-0 text-[10px] text-red-700">
                        NEW
                      </Badge>
                    ) : null}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <Badge variant="outline" className={typeBadgeClass[project.type]}>
                    {project.type}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-slate-700">
                  {project.industry}
                </td>
                <td className="max-w-[320px] px-3 py-2">
                  <Link
                    to={`/expert/jobs/${project.id}`}
                    className="block truncate font-medium text-slate-950 hover:text-teal-700 hover:underline"
                  >
                    {project.title}
                  </Link>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {project.companyName ?? "기업명 미공개"} ·{" "}
                    {project.businessType ?? "사업자 유형 미공개"}
                  </p>
                </td>
                <td className="max-w-[260px] px-3 py-2 text-slate-600">
                  <span className="block truncate">{getRequirementText(project)}</span>
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                  {project.assetScale ?? "-"}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-right text-slate-700">
                  <span className="font-semibold text-slate-950">{project.bids}</span>명
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                    {project.status ?? "입찰 중"}
                  </Badge>
                </td>
                <td className="sticky right-0 border-l bg-white px-3 py-2 text-right shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.45)] transition-colors group-hover:bg-teal-50/95">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm" className="h-7 px-2 text-xs">
                      <Link to={`/expert/jobs/${project.id}`}>상세</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="h-7 bg-teal-600 px-2 text-xs hover:bg-teal-700"
                    >
                      <Link to={`/expert/jobs/${project.id}/bid`}>입찰</Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
