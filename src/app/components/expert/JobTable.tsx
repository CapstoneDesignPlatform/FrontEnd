import { Link } from "react-router-dom";

import type { ExpertJobListItemVM } from "../../../types/expert";
import {
  canBidOnExpertJob,
  getExpertBidAvailability,
} from "./jobStatus";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface JobTableProps {
  projects: ExpertJobListItemVM[];
}

const typeBadgeClass: Record<ExpertJobListItemVM["type"], string> = {
  "필요 면허": "border-blue-200 bg-blue-50 text-blue-700",
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

function getBidActionButtonClassName(hasMyBid?: boolean) {
  return hasMyBid
    ? "h-7 bg-sky-600 px-2 text-xs text-white hover:bg-sky-700"
    : "h-7 bg-blue-600 px-2 text-xs text-white hover:bg-blue-700";
}

function TypeBadgeLabel({ type }: { type: ExpertJobListItemVM["type"] }) {
  const parts = type.split(" ");

  if (parts.length === 1) {
    return <>{type}</>;
  }

  return (
    <span className="inline-flex flex-col items-center leading-tight">
      {parts.map((part) => (
        <span key={part}>{part}</span>
      ))}
    </span>
  );
}

export function JobTable({ projects }: JobTableProps) {
  return (
    <div className="overflow-x-auto bg-white">
      <table className="w-full table-fixed border-collapse text-sm md:min-w-[920px] md:table-auto">
        <thead className="bg-slate-50 text-xs font-medium text-slate-500">
          <tr>
            <th
              scope="col"
              className="hidden w-[76px] border-b px-4 py-3 text-center md:table-cell"
            >
              No.
            </th>
            <th
              scope="col"
              className="hidden w-[92px] border-b px-4 py-3 text-center md:table-cell"
            >
              등록일
            </th>
            <th
              scope="col"
              className="w-[56px] border-b px-1.5 py-3 text-center md:w-[74px] md:px-3"
            >
              유형
            </th>
            <th
              scope="col"
              className="hidden w-[124px] border-b px-4 py-3 text-left md:table-cell"
            >
              업종
            </th>
            <th
              scope="col"
              className="border-b px-2 py-3 text-left md:w-[260px] md:px-4"
            >
              핵심 조건
            </th>
            <th
              scope="col"
              className="w-[62px] border-b px-1.5 py-3 text-right md:w-[92px] md:px-4"
            >
              자산
            </th>
            <th
              scope="col"
              className="hidden w-[66px] border-b px-4 py-3 text-center md:table-cell"
            >
              입찰
            </th>
            <th
              scope="col"
              className="w-[72px] border-b px-1.5 py-3 text-center md:w-[92px] md:px-4"
            >
              상태
            </th>
            <th
              scope="col"
              className="sticky right-0 w-[58px] border-b border-l bg-slate-50 px-1.5 py-3 text-center md:w-[156px] md:px-4"
            >
              액션
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {projects.map((project) => {
            const bidStatus = getExpertBidAvailability(project);
            const canBid = canBidOnExpertJob(project);
            const detailPath = `/expert/jobs/${encodeURIComponent(project.announcementCode)}`;
            const bidPath = `${detailPath}/bid`;

            return (
              <tr
                key={project.id}
                className="group bg-white align-middle hover:bg-slate-50"
              >
                  <td className="hidden whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500 md:table-cell">
                    {formatJobNumber(project.id)}
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-center text-slate-600 md:table-cell">
                    <div className="flex flex-col items-center gap-1">
                      <span>{formatTableDate(project.postedDate)}</span>
                      {project.isNew ? (
                        <Badge className="bg-red-100 px-1.5 py-0 text-[10px] text-red-700">
                          NEW
                        </Badge>
                      ) : null}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-1.5 py-3 text-center md:px-3">
                    <Badge
                      variant="outline"
                      aria-label={project.type}
                      className={`justify-center px-1 py-1 text-center text-[10px] md:px-2 md:text-[11px] ${typeBadgeClass[project.type]}`}
                    >
                      <TypeBadgeLabel type={project.type} />
                    </Badge>
                  </td>
                  <td className="hidden truncate px-4 py-3 text-left text-slate-700 md:table-cell">
                    {project.industry}
                  </td>
                  <td className="min-w-0 px-2 py-3 text-slate-600 md:max-w-[260px] md:px-4">
                    <span className="block truncate">{getRequirementText(project)}</span>
                  </td>
                  <td className="whitespace-nowrap px-1.5 py-3 text-right text-slate-600 md:px-4">
                    {project.assetScale ?? "-"}
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-center text-slate-600 md:table-cell">
                    <span className="font-semibold text-slate-950">{project.bids}</span>명
                  </td>
                  <td className="whitespace-nowrap px-1.5 py-3 text-center md:px-4">
                    <Badge
                      variant="outline"
                      className={
                        bidStatus === "입찰 가능"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-slate-50 text-slate-500"
                      }
                    >
                      {bidStatus}
                    </Badge>
                  </td>
                  <td className="sticky right-0 border-l bg-white px-1.5 py-3 text-center shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.45)] group-hover:bg-slate-50 md:px-4">
                    <div className="flex justify-end gap-1 md:gap-2">
                      <Button asChild variant="outline" size="sm" className="h-7 px-1.5 text-xs md:px-2">
                        <Link to={detailPath}>상세</Link>
                      </Button>
                      {canBid && !project.hasMyBid ? (
                        <Button
                          asChild
                          size="sm"
                          className={`hidden md:inline-flex ${getBidActionButtonClassName(project.hasMyBid)}`}
                        >
                          <Link to={bidPath}>입찰 시작</Link>
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="hidden h-7 px-2 text-xs md:inline-flex"
                          disabled
                        >
                          {project.hasMyBid ? "입찰 완료" : "입찰 마감"}
                        </Button>
                      )}
                    </div>
                  </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
