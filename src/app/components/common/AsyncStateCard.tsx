import type { ReactNode } from "react";

import { Card, CardContent } from "../ui/card";

type AsyncStateTone = "neutral" | "danger";

const toneClassName: Record<AsyncStateTone, string> = {
  neutral: "text-gray-600",
  danger: "text-red-600",
};

interface AsyncStateCardProps {
  action?: ReactNode;
  className?: string;
  message: string;
  tone?: AsyncStateTone;
}

export function AsyncStateCard({
  action,
  className,
  message,
  tone = "neutral",
}: AsyncStateCardProps) {
  return (
    <Card className={className}>
      <CardContent className="py-12 text-center">
        <p className={toneClassName[tone]}>{message}</p>
        {action ? <div className="mt-4">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
