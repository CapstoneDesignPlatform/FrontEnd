import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";

export function ExpertVerificationApprovedCard() {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-600" />
          <div>
            <h4 className="mb-1 font-medium text-green-900">
              인증이 완료되었습니다!
            </h4>
            <p className="mb-4 text-sm text-green-800">
              이제 인증 전문가로서 더 많은 기회를 얻을 수 있습니다.
            </p>
            <Button asChild>
              <Link to="/expert/jobs">의뢰 찾아보기</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
