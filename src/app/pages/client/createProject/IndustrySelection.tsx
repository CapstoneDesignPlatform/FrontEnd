import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { industries } from "./createProjectConfig";

interface IndustrySelectionProps {
  onSelectIndustry: (industry: string) => void;
}

export function IndustrySelection({ onSelectIndustry }: IndustrySelectionProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">업종 선택</CardTitle>
          <CardDescription>
            의뢰하실 업종을 먼저 선택해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {industries.map((industry) => (
              <Card
                key={industry.value}
                className="cursor-pointer hover:border-[#009689] hover:shadow-md transition-all"
                onClick={() => onSelectIndustry(industry.value)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{industry.label}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
