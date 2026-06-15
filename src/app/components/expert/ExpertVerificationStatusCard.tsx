import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { ExpertVerificationStatusVM } from "../../../types/expertVerification";

interface ExpertVerificationStatusCardProps {
  verificationRequest: ExpertVerificationStatusVM;
}

export function ExpertVerificationStatusCard({
  verificationRequest,
}: ExpertVerificationStatusCardProps) {
  if (verificationRequest.status === "APPROVED") {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">전문가 인증 완료</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-center text-gray-700">
              전문가 인증이 완료되었습니다.<br />
              이제 의뢰를 확인하고 입찰할 수 있습니다.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" asChild className="flex-1">
              <Link to="/expert/profile">프로필 관리</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link to="/expert/jobs">의뢰 목록 보기</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (verificationRequest.status === "REJECTED") {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">전문가 인증 반려</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-center text-gray-700">
              제출하신 인증 신청이 반려되었습니다.<br />
              사유를 확인한 뒤 다시 신청해주세요.
            </p>
          </div>

          {verificationRequest.rejectedReason && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <FileText className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">반려 사유</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {verificationRequest.rejectedReason}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" asChild className="flex-1">
              <Link to="/">홈으로</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link to="/expert/verification/apply">재신청하기</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (verificationRequest.status === "NOT_APPLIED") {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-10 h-10 text-gray-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">전문가 인증이 필요합니다</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-center text-gray-700">
              전문가 서비스를 이용하려면 인증 신청을 먼저 완료해주세요.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" asChild className="flex-1">
              <Link to="/">홈으로</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link to="/expert/verification/apply">인증 신청하기</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl">전문가 인증 승인 대기중</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-center text-gray-700">
            전문가 인증 신청이 완료되었습니다.<br />
            관리자 승인 후 서비스를 이용하실 수 있습니다.
          </p>
        </div>

        {/* 진행 상황 */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">진행 상황</h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 pt-1">
                <p className="font-medium text-gray-900">회원가입 완료</p>
                <p className="text-sm text-gray-600">기본 정보 등록이 완료되었습니다.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 pt-1">
                <p className="font-medium text-gray-900">전문가 인증 신청 완료</p>
                <p className="text-sm text-gray-600">인증 서류 제출이 완료되었습니다.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 pt-1">
                <p className="font-medium text-gray-900">관리자 승인 대기</p>
                <p className="text-sm text-gray-600">승인까지 평균 1-2 영업일이 소요됩니다.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              </div>
              <div className="flex-1 pt-1">
                <p className="font-medium text-gray-400">서비스 이용 가능</p>
                <p className="text-sm text-gray-400">승인 후 모든 기능을 이용하실 수 있습니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 안내 사항 */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">안내 사항</p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside">
                <li>승인 결과는 이메일로 발송됩니다.</li>
                <li>서류에 문제가 있는 경우 추가 서류 요청이 있을 수 있습니다.</li>
                <li>영업일 기준 3일 이내 승인이 완료됩니다.</li>
                <li>문의사항은 고객센터로 연락 주시기 바랍니다.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" asChild className="flex-1">
            <Link to="/">홈으로</Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link to="/expert/verification/apply">인증 정보 수정</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
