import { CheckCircle2 } from "lucide-react";

import type { ExpertVerificationStatus } from "../../../../types/expertVerification";
import { Badge } from "../../ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";

interface ExpertVerificationHeaderProps {
  verificationStatus: ExpertVerificationStatus;
}

export function ExpertVerificationHeader({
  verificationStatus,
}: ExpertVerificationHeaderProps) {
  return (
    <Card className="overflow-hidden border-black/10 shadow-sm">
      <CardHeader className="gap-4 bg-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-2xl">전문가 인증</CardTitle>
          <CardDescription className="mt-2 text-base">
            전문가 인증을 완료해야 입찰과 프로젝트 수주 기능을 이용하실 수
            있습니다.
          </CardDescription>
        </div>

        <VerificationStatusBadge verificationStatus={verificationStatus} />
      </CardHeader>
    </Card>
  );
}

function VerificationStatusBadge({
  verificationStatus,
}: ExpertVerificationHeaderProps) {
  if (verificationStatus === "APPROVED") {
    return (
      <Badge className="bg-green-100 px-4 py-2 text-base text-green-700">
        <CheckCircle2 className="mr-2 h-5 w-5" />
        인증 완료
      </Badge>
    );
  }

  if (verificationStatus === "PENDING") {
    return (
      <Badge className="bg-yellow-100 px-4 py-2 text-base text-yellow-700">
        검토 중
      </Badge>
    );
  }

  if (verificationStatus === "REJECTED") {
    return (
      <Badge className="bg-red-100 px-4 py-2 text-base text-red-700">
        보완 필요
      </Badge>
    );
  }

  return null;
}
