import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function ExpertPending() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
              <Clock className="w-10 h-10 text-teal-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">전문가 인증 승인 대기중</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <p className="text-center text-gray-700">
              전문가 인증 신청이 완료되었습니다.<br />
              관리자 승인 후 서비스를 이용하실 수 있습니다.
            </p>
          </div>

          {/* 진행 상황 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">진행 상황</h3>
            
            <div className="space-y-3">
              {/* 완료된 단계 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-medium text-gray-900">회원가입 완료</p>
                  <p className="text-sm text-gray-600">기본 정보 등록이 완료되었습니다.</p>
                </div>
              </div>

              {/* 완료된 단계 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-medium text-gray-900">전문가 인증 신청 완료</p>
                  <p className="text-sm text-gray-600">인증 서류 제출이 완료되었습니다.</p>
                </div>
              </div>

              {/* 현재 진행중 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Clock className="w-5 h-5 text-teal-600" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-medium text-gray-900">관리자 승인 대기</p>
                  <p className="text-sm text-gray-600">승인까지 평균 1-2 영업일이 소요됩니다.</p>
                </div>
              </div>

              {/* 대기중 */}
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

          {/* 하단 버튼 */}
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
    </div>
  );
}
