import { useEffect, useId, useRef, useState } from "react";
import { mockExpertPlans } from "../../../mocks/expert";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";

type Plan = (typeof mockExpertPlans)[keyof typeof mockExpertPlans];

function alertAllowance(plan: Plan) {
  return typeof plan.alertLimit === "number" ? `${plan.alertLimit}회` : plan.alertLimit;
}

export function ExpertPlanPicker({ currentGrade }: { currentGrade: Plan["grade"] }) {
  const [selected, setSelected] = useState<Plan | null>(null);
  const [draft, setDraft] = useState<Plan | null>(null);
  const [step, setStep] = useState<"summary" | "choose" | "review">("summary");
  const pickerId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reviewHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (step === "review") reviewHeadingRef.current?.focus();
  }, [step]);

  const choosePlan = () => {
    setDraft(selected);
    setStep("choose");
  };

  const navigation = {
    summary: selected
      ? { label: "주문 내용 보기", onClick: () => setStep("review") }
      : { label: "이용권 선택", onClick: choosePlan },
    choose: { label: "취소", onClick: () => setStep(selected ? "review" : "summary") },
    review: { label: "이용권 다시 선택", onClick: choosePlan },
  }[step];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {step === "review" ? (
          <h3 ref={reviewHeadingRef} tabIndex={-1} className="font-semibold text-slate-950">
            주문 내용 확인
          </h3>
        ) : (
          <p role="status" className="text-sm text-slate-700">
            {selected && step === "summary" && (
              <>선택한 이용권 <strong>{selected.grade}</strong> · 알림 {alertAllowance(selected)} · {selected.price.toLocaleString("ko-KR")}원</>
            )}
          </p>
        )}
        <Button
          ref={toggleRef}
          type="button"
          size="sm"
          variant="outline"
          aria-controls={pickerId}
          onClick={navigation.onClick}
        >
          {navigation.label}
        </Button>
      </div>
      <div id={pickerId} hidden={step === "summary"}>
        {step === "choose" && (
          <>
            <fieldset>
              <legend className="font-semibold text-slate-950">등급별 이용권</legend>
              <p className="mt-1 text-xs text-slate-600">
                가격과 알림 횟수는 예시입니다. 선택 내용은 이 화면에서만 유지됩니다.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {Object.values(mockExpertPlans).map((plan) => (
                  <label
                    key={plan.grade}
                    className={cn(
                      "cursor-pointer rounded-lg border bg-white p-3 focus-within:ring-2 focus-within:ring-blue-600",
                      draft === plan ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-slate-400",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={pickerId}
                        value={plan.grade}
                        checked={draft === plan}
                        onChange={() => setDraft(plan)}
                        className="accent-blue-700"
                      />
                      <span className="font-semibold text-slate-950">{plan.grade}</span>
                      {plan.grade === currentGrade && <Badge variant="outline">현재 등급</Badge>}
                    </span>
                    <span className="mt-3 block text-sm text-slate-700">새 의뢰 알림 {alertAllowance(plan)}</span>
                    <span className="mt-1 block font-semibold tabular-nums text-slate-950">
                      {plan.price.toLocaleString("ko-KR")}원
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-3 flex justify-end">
              <Button
                type="button"
                size="sm"
                disabled={draft === null}
                onClick={() => {
                  if (!draft) return;
                  setSelected(draft);
                  setStep("review");
                }}
              >
                결제 전 확인
              </Button>
            </div>
          </>
        )}
        {step === "review" && selected && (
          <>
            <dl className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-slate-600">이용권 이름</dt>
                <dd className="font-medium text-slate-950">{selected.grade}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-slate-600">새 의뢰 알림 횟수</dt>
                <dd className="font-medium tabular-nums text-slate-950">{alertAllowance(selected)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-t border-slate-200 pt-2">
                <dt className="font-semibold text-slate-950">결제 예정 금액</dt>
                <dd className="text-lg font-semibold tabular-nums text-slate-950">{selected.price.toLocaleString("ko-KR")}원</dd>
              </div>
            </dl>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-slate-600">예시 주문입니다. 실제 결제는 연동 후 이용할 수 있습니다.</p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setStep("summary");
                  toggleRef.current?.focus();
                }}
              >
                닫기
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
