import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Settings } from "lucide-react";

export function AdminSettings() {
  const [dumpingThresholdRatio, setDumpingThresholdRatio] = useState(0.7);
  const [platformFeeRate, setPlatformFeeRate] = useState(0.1);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">플랫폼 설정</h1>
        <p className="text-gray-600">
          덤핑 방지 비율 및 플랫폼 수수료를 설정합니다.
        </p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          설정이 저장되었습니다.
        </div>
      )}

      {/* 현재 기준 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            현재 기준
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600 mb-1">덤핑 하한 비율</p>
              <p className="text-2xl font-bold">
                {(dumpingThresholdRatio * 100).toFixed(0)}%
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600 mb-1">플랫폼 수수료율</p>
              <p className="text-2xl font-bold">
                {(platformFeeRate * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 설정 변경 */}
      <Card>
        <CardHeader>
          <CardTitle>설정 변경</CardTitle>
          <CardDescription>값을 수정하고 저장 버튼을 누르세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  평균가 대비 하한 비율 (0.1 ~ 1.0)
                </label>
                <Input
                  type="number"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={dumpingThresholdRatio}
                  onChange={(e) =>
                    setDumpingThresholdRatio(Number(e.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  플랫폼 수수료율 (0 ~ 0.3)
                </label>
                <Input
                  type="number"
                  min={0}
                  max={0.3}
                  step={0.01}
                  value={platformFeeRate}
                  onChange={(e) => setPlatformFeeRate(Number(e.target.value))}
                />
              </div>
            </div>
            <Button type="submit" className="bg-[#009689] hover:bg-[#007d71]">
              설정 저장
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
