import { useCallback, useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { ArrowLeft, CheckCircle2, CircleAlert, ClipboardList } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { createBid, getExpertJobDetail } from "../../../api/expert";
import type { CreateBidRequest, MyBidItemVM } from "../../../types/expert";
import { AsyncStateCard } from "../../components/common/AsyncStateCard";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  canBidOnExpertJob,
  getExpertBidAvailability,
} from "../../components/expert/jobStatus";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { useAsyncData } from "../../hooks/useAsyncData";

const cautionItems = [
  '의뢰인이 진단보고서 수령 확정 상태이거나 이에 준하는 경우에 한해 용역수수료를 수취하며 "플랫폼"에서 정한 방식에 따라 중개수수료를 지급합니다.',
  '입찰에 참가한 전문가의 최종 선택기준은 최저입찰가액이 아니며 "플랫폼"에서 제공한 전문가의 정보를 기초로 의뢰인이 최종 결정합니다.',
  "전문가는 의뢰인의 의뢰내용에 따른 관련 법규를 준수하여 보고서를 작성하여야 하며, 향후 보고서 내용 및 결과에 따른 책임은 전문가가 부담하여야 합니다.",
  '"의뢰인"과 입찰가격 이하의 금액으로 조정이 불가하며 "플랫폼"에서 정하지 않은 부당한 방법으로 용역수수료를 수납할 경우, 이에 따른 불이익(향후 입찰 금지, 회원 탈퇴 등)을 받을 수 있습니다.',
  '진단내용 및 보고서 제출 등 의뢰인 요청사항에 따른 용역 업무 범위, 기한, 수수료 수납 등은 의뢰인과 직접 협의 및 진행하여야 하며, 향후 법률상 문제에 대하여 통신판매중개업을 수행하는 "플랫폼"은 어떠한 책임을 부담하지 않습니다.',
];

interface SubmitBidResult {
  bid: MyBidItemVM;
  isEditing: boolean;
}

export function ExpertBidPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState("");
  const [hasReadCautions, setHasReadCautions] = useState(false);
  const [hasAgreedToBid, setHasAgreedToBid] = useState(false);
  const loadProject = useCallback(() => getExpertJobDetail(id ?? 1), [id]);
  const {
    data: project,
    error,
    isLoading,
  } = useAsyncData(loadProject, {
    keepPreviousData: true,
  });
  const { isPending: isSubmittingBid, run: submitBid } = useAsyncAction(
    async (
      payload: CreateBidRequest,
      isEditing: boolean,
    ): Promise<SubmitBidResult> => {
      if (isEditing) {
        throw new Error("입찰 수정 API는 아직 제공되지 않습니다.");
      }

      const bid = await createBid(payload);

      return { bid, isEditing };
    },
    {
      onError: () => {
        toast.error("입찰 처리에 실패했습니다.");
      },
      onSuccess: ({ isEditing }) => {
        toast.success(isEditing ? "입찰이 수정되었습니다." : "입찰이 완료되었습니다.");
        navigate("/expert/bids");
      },
    },
  );

  const projectId = project?.id;
  const projectBidAmount = project?.myBid?.amount;

  useEffect(() => {
    if (!projectId) return;

    setBidAmount(projectBidAmount !== undefined ? String(projectBidAmount) : "");
  }, [projectId, projectBidAmount]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!project || !canBidOnExpertJob(project)) {
      toast.error("입찰이 마감된 의뢰입니다.");
      return;
    }

    const isEditingBid = project.hasMyBid === true || Boolean(project.myBid);

    const amount = Number(bidAmount.trim());

    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("입찰 금액은 1원 이상 숫자로 입력해주세요.");
      return;
    }

    if (isEditingBid) {
      toast.error("입찰 수정은 아직 지원되지 않습니다.");
      return;
    }

    if (!hasReadCautions || !hasAgreedToBid) {
      toast.error("주의사항 확인 및 최종 입찰 동의가 필요합니다.");
      return;
    }

    void submitBid(
      {
        announcementCode: project.announcementCode,
        price: amount,
      },
      isEditingBid,
    );
  };

  if (error) {
    return (
      <div className="space-y-6">
        <AsyncStateCard message="입찰할 의뢰 정보를 불러오지 못했습니다." tone="danger" />
      </div>
    );
  }

  if (isLoading && !project) {
    return (
      <div className="space-y-6">
        <AsyncStateCard message="입찰 정보를 불러오는 중입니다." />
      </div>
    );
  }

  if (!project) return null;

  const bidStatus = getExpertBidAvailability(project);
  const canBid = canBidOnExpertJob(project);
  const isEditingBid = project.hasMyBid === true || Boolean(project.myBid);
  const canSubmit =
    canBid && !isEditingBid && hasReadCautions && hasAgreedToBid && !isSubmittingBid;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
              {isEditingBid ? "입찰 완료" : "입찰 참여"}
            </Badge>
            <Badge variant="outline">{project.type}</Badge>
            <Badge
              variant="outline"
              className={
                canBid
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-slate-50 text-slate-500"
              }
            >
              {bidStatus}
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold text-slate-950">
            {isEditingBid ? "입찰 완료 공고" : "입찰 페이지"}
          </h1>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to={`/expert/jobs/${encodeURIComponent(project.announcementCode)}`}>
            <ArrowLeft className="h-4 w-4" />
            상세로 돌아가기
          </Link>
        </Button>
      </div>

      {!canBid ? (
        <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
          <div>
            <p className="font-semibold text-slate-950">입찰이 마감된 의뢰입니다.</p>
            <p className="mt-1">
              마감된 의뢰는 입찰을 새로 제출하거나 기존 입찰을 수정할 수 없습니다.
            </p>
          </div>
        </div>
      ) : null}

      {isEditingBid ? (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-950">이미 입찰한 의뢰입니다.</p>
            <p className="mt-1">
              현재 백엔드에서 입찰 수정 API가 제공되지 않아 추가 제출을 막아두었습니다.
            </p>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardList className="h-5 w-5 text-blue-600" />
              입찰 내용
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2">
              <BidInfoRow label="의뢰번호" value={formatJobNumber(project.id)} />
              <BidInfoRow label="의뢰명" value={project.title} />
              <BidInfoRow label="의뢰일시" value={project.createdAt} />
              <BidInfoRow label="마감일시" value={project.deadline ?? "미정"} />
              <BidInfoRow
                label="진행상태"
                value={
                  <Badge
                    className={
                      canBid
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }
                  >
                    {canBid ? "진행 중" : "입찰 마감"}
                  </Badge>
                }
              />
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <Label htmlFor="bidAmount" className="text-sm font-semibold text-slate-900">
                <span className="text-red-500">*</span> 입찰 금액
              </Label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  id="bidAmount"
                  inputMode="numeric"
                  name="bidAmount"
                  pattern="[0-9]*"
                  placeholder="입찰할 금액 입력"
                  type="text"
                  value={bidAmount}
                  onChange={(event) => setBidAmount(event.target.value)}
                  disabled={!canBid || isSubmittingBid}
                  className="max-w-sm bg-white"
                />
                <span className="text-sm font-medium text-slate-700">
                  원 <span className="text-slate-500">(VAT 포함)</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">주의사항</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <ul className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
              {cautionItems.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
              <AgreementCheckbox
                checked={hasReadCautions}
                disabled={!canBid || isSubmittingBid}
                id="hasReadCautions"
                label="각 항목의 모든 주의사항에 대해 이해하였습니다."
                onCheckedChange={setHasReadCautions}
              />
              <AgreementCheckbox
                checked={hasAgreedToBid}
                disabled={!canBid || isSubmittingBid}
                id="hasAgreedToBid"
                label="위의 모든 내용에 대해 동의하며, 최종적으로 입찰에 참여합니다."
                onCheckedChange={setHasAgreedToBid}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button asChild variant="outline">
            <Link to={`/expert/jobs/${encodeURIComponent(project.announcementCode)}`}>
              취소
            </Link>
          </Button>
          <Button
            type="submit"
            disabled={!canSubmit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isSubmittingBid
              ? isEditingBid
                ? "입찰 수정 중"
                : "입찰 제출 중"
              : isEditingBid
                ? "입찰 수정"
                : "입찰 참여"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function BidInfoRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <div className="mt-1 break-keep text-sm font-semibold text-slate-950">
        {value}
      </div>
    </div>
  );
}

function AgreementCheckbox({
  checked,
  disabled = false,
  id,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  disabled?: boolean;
  id: string;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 text-sm text-slate-700 ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
    >
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        className="mt-0.5"
      />
      <span>{label}</span>
    </label>
  );
}

function formatJobNumber(id: number) {
  return `JOB-${String(id).padStart(4, "0")}`;
}
