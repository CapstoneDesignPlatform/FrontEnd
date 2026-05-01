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

function formatTableDate(date: string) {
  const [, month, day] = date.split("-");

  return month && day ? `${month}-${day}` : date;
}

function TypeBadgeLabel({ type }: { type: ExpertJobListItemVM["type"] }) {
  const parts = type.split(" ");

  if (parts.length === 1) {
    return <>{type}</>;
  }

  return (
    <>
      <span className="inline-flex flex-col items-center leading-tight md:hidden">
        {parts.map((part) => (
          <span key={part}>{part}</span>
        ))}
      </span>
      <span className="hidden md:inline">{type}</span>
    </>
  );
}

export function JobTable({ projects }: JobTableProps) {
  return (
    <div className="overflow-hidden rounded-b-xl bg-white">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-sm md:min-w-[1180px] md:table-auto">
          <thead className="bg-slate-50 text-center text-[11px] uppercase tracking-[0.08em] text-slate-500">
            <tr>
              <th scope="col" className="hidden w-[76px] border-b px-3 py-2 text-center font-semibold md:table-cell">
                No.
              </th>
              <th scope="col" className="w-[62px] border-b px-2 py-2 text-center font-semibold md:w-[122px] md:px-4">
                등록일
              </th>
              <th scope="col" className="w-[58px] border-b px-2 py-2 text-center font-semibold md:w-[104px] md:px-3">
                유형
              </th>
              <th scope="col" className="w-[82px] border-b px-2 py-2 text-center font-semibold md:w-[124px] md:px-4">
                업종
              </th>
              <th scope="col" className="border-b px-2 py-2 text-center font-semibold md:w-[270px] md:px-4">
                <span className="md:hidden">공고명</span>
                <span className="hidden md:inline">공고명 / 기업</span>
              </th>
              <th scope="col" className="hidden w-[220px] border-b px-4 py-2 text-center font-semibold md:table-cell">
                핵심 조건
              </th>
              <th scope="col" className="hidden w-[92px] border-b px-3 py-2 text-center font-semibold md:table-cell">
                자산
              </th>
              <th scope="col" className="hidden w-[66px] border-b px-3 py-2 text-center font-semibold md:table-cell">
                입찰
              </th>
              <th scope="col" className="hidden w-[92px] border-b px-3 py-2 text-center font-semibold md:table-cell">
                상태
              </th>
              <th
                scope="col"
                className="sticky right-0 hidden w-[114px] border-b border-l bg-slate-50 px-3 py-2 text-center font-semibold md:table-cell"
              >
                액션
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="group bg-white align-middle transition-colors hover:bg-teal-50/50"
              >
                <td className="hidden whitespace-nowrap px-3 py-2 font-mono text-xs text-slate-500 md:table-cell">
                  {formatJobNumber(project.id)}
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-center text-xs text-slate-600 md:px-4 md:text-left">
                  <div className="flex flex-col items-center gap-1 md:flex-row md:items-center md:gap-2">
                    <span className="md:hidden">{formatTableDate(project.postedDate)}</span>
                    <span className="hidden md:inline">{project.postedDate}</span>
                    {project.isNew ? (
                      <Badge className="bg-red-100 px-1.5 py-0 text-[10px] text-red-700">
                        NEW
                      </Badge>
                    ) : null}
                  </div>
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-center md:px-3">
                  <Badge
                    variant="outline"
                    aria-label={project.type}
                    className={`justify-center px-2 py-1 text-center text-[11px] md:px-2.5 md:text-xs ${typeBadgeClass[project.type]}`}
                  >
                    <TypeBadgeLabel type={project.type} />
                  </Badge>
                </td>
                <td className="truncate px-2 py-2 text-left text-xs text-slate-700 md:whitespace-nowrap md:px-4 md:text-sm">
                  {project.industry}
                </td>
                <td className="min-w-0 px-2 py-2 md:max-w-[270px] md:px-4">
                  <Link
                    to={`/expert/jobs/${project.id}`}
                    className="block truncate text-xs font-medium text-slate-950 hover:text-teal-700 hover:underline md:text-sm"
                  >
                    {project.title}
                  </Link>
                  <p className="mt-0.5 hidden truncate text-xs text-slate-500 md:block">
                    {project.companyName ?? "기업명 미공개"} ·{" "}
                    {project.businessType ?? "사업자 유형 미공개"}
                  </p>
                </td>
                <td className="hidden max-w-[220px] px-4 py-2 text-slate-600 md:table-cell">
                  <span className="block truncate">{getRequirementText(project)}</span>
                </td>
                <td className="hidden whitespace-nowrap px-3 py-2 text-right text-slate-600 md:table-cell">
                  {project.assetScale ?? "-"}
                </td>
                <td className="hidden whitespace-nowrap px-3 py-2 text-right text-slate-700 md:table-cell">
                  <span className="font-semibold text-slate-950">{project.bids}</span>명
                </td>
                <td className="hidden whitespace-nowrap px-3 py-2 text-center md:table-cell">
                  <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                    {project.status ?? "입찰 중"}
                  </Badge>
                </td>
                <td className="sticky right-0 hidden border-l bg-white px-3 py-2 text-right shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.45)] transition-colors group-hover:bg-teal-50/95 md:table-cell">
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
