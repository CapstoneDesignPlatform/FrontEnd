import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";

interface ProjectPurposeProps {
  onSelectPurpose: (purpose: string) => void;
}

// 목적 데이터를 컴포넌트 내부에서 바로 정의합니다.
const PURPOSES = [
  { label: "필요면허", value: "license" },
  { label: "실태조사", value: "survey" },
  { label: "기타", value: "other" },
];

export function PurposeSelection({ onSelectPurpose }: ProjectPurposeProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <CardTitle className="text-2xl font-bold">의뢰 목적</CardTitle>
          <CardDescription className="text-base">
            의뢰를 맡기실 목적을 선택해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          {/* 3개이므로 그리드 비율을 조정하거나 간격을 넓혀서 시각적으로 안정감을 줍니다. */}
          <div className="grid md:grid-cols-3 gap-6">
            {PURPOSES.map((purpose) => (
              <Card
                key={purpose.value}
                className="group cursor-pointer border-2 border-gray-100 hover:border-blue-600 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden"
                onClick={() => onSelectPurpose(purpose.value)}
              >
                <CardHeader className="py-10 text-center">
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {purpose.label}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}