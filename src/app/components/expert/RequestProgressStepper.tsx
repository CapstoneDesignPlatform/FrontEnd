import { Check } from "lucide-react";

export interface RequestProgressStep {
  id: string;
  label: string;
}

interface RequestProgressStepperProps {
  steps: RequestProgressStep[];
  currentStep: number | null;
}

export function RequestProgressStepper({
  steps,
  currentStep,
}: RequestProgressStepperProps) {
  const boundedCurrentStep = currentStep !== null && Number.isInteger(currentStep) && currentStep >= 1 && currentStep <= steps.length ? currentStep : null;

  return (
    <div className="overflow-x-auto px-1 pb-2 pt-3">
      <ol aria-label="의뢰 진행 단계" className="flex min-w-[780px] items-start">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = boundedCurrentStep !== null && stepNumber < boundedCurrentStep;
          const isCurrent = stepNumber === boundedCurrentStep;
          const isActive = boundedCurrentStep !== null && stepNumber <= boundedCurrentStep;
          const isLineActive = boundedCurrentStep !== null && index < boundedCurrentStep - 1;

          return (
            <li
              key={step.id}
              aria-current={isCurrent ? "step" : undefined}
              className="flex flex-1 items-start last:flex-none"
            >
              <div className="flex w-24 flex-col items-center gap-2 text-center">
                <div
                  className={[
                    "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300",
                    isCurrent
                      ? "scale-110 border-blue-600 bg-white text-blue-700 shadow-md shadow-blue-200"
                      : "",
                    isCompleted
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "",
                    !isActive ? "border-slate-300 bg-slate-100 text-slate-400" : "",
                  ].join(" ")}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
                </div>
                <span
                  className={[
                    "text-xs font-medium leading-tight transition-colors duration-300",
                    isActive ? "text-slate-900" : "text-slate-400",
                    isCurrent ? "text-blue-700" : "",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 ? (
                <div
                  className={[
                    "mt-4 h-0.5 flex-1 rounded-full transition-colors duration-300",
                    isLineActive ? "bg-blue-500" : "bg-slate-200",
                  ].join(" ")}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
