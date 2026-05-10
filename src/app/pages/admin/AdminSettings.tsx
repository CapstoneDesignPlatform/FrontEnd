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
  // 내부 저장값은 소수 (0.7, 0.1)
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
        <h1 className="text-xl font-bold">플랫폼 설정</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          덤핑 방지 비율 및 플랫폼 수수료를 설정합니다.
        </p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
          설정이 저장되었습니다.
        </div>
      )}

      {/* 현재 기준 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Settings className="h-4 w-4" />
            현재 기준
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">덤핑 하한 비율</p>
              <p className="text-2xl font-bold text-teal-600">
                {(dumpingThresholdRatio * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-gray-400 mt-1">
                평균 입찰가 대비 최저 허용 비율
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">플랫폼 수수료율</p>
              <p className="text-2xl font-bold text-teal-600">
                {(platformFeeRate * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-gray-400 mt-1">
                낙찰 금액 대비 플랫폼 수수료
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 설정 변경 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">설정 변경</CardTitle>
          <CardDescription className="text-xs">
            % 단위로 입력하세요. 저장 시 자동 변환됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  덤핑 하한 비율 (10% ~ 100%)
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min={10}
                    max={100}
                    step={5}
                    value={Math.round(dumpingThresholdRatio * 100)}
                    onChange={(e) =>
                      setDumpingThresholdRatio(Number(e.target.value) / 100)
                    }
                    className="pr-8 text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                    %
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  현재 저장값: {dumpingThresholdRatio.toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  플랫폼 수수료율 (0% ~ 30%)
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    max={30}
                    step={1}
                    value={Math.round(platformFeeRate * 100)}
                    onChange={(e) =>
                      setPlatformFeeRate(Number(e.target.value) / 100)
                    }
                    className="pr-8 text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                    %
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  현재 저장값: {platformFeeRate.toFixed(2)}
                </p>
              </div>
            </div>
            <Button
              type="submit"
              className="bg-[#009689] hover:bg-[#007d71] text-sm"
            >
              설정 저장
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
