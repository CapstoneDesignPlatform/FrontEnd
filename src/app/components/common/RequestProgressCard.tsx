import { progressSteps } from '../../../api/clientAnnouncementsModel';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { RequestProgressStepper } from '../expert/RequestProgressStepper';

const steps = progressSteps.map((label, index) => ({ id: String(index + 1), label }));

export function RequestProgressCard({ status, progressStep }: {
  status: string;
  progressStep?: number | null;
}) {
  const currentStep = Number.isInteger(progressStep) && progressStep! >= 1 && progressStep! <= steps.length
    ? progressStep! : null;
  const cancelled = status === 'CANCELLED';
  return <Card>
    <CardHeader>
      <CardTitle>진행 상태</CardTitle>
      <p className="text-sm text-slate-500">
        {cancelled ? '취소된 의뢰입니다. 진행 단계를 표시하지 않습니다.'
          : currentStep === null ? '서버에서 유효한 진행 단계가 제공되지 않았습니다.'
          : `현재 단계: ${progressSteps[currentStep - 1]}`}
      </p>
    </CardHeader>
    <CardContent><RequestProgressStepper steps={steps} currentStep={cancelled ? null : currentStep} /></CardContent>
  </Card>;
}
