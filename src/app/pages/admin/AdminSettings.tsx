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
  const [dumpingLower, setDumpingLower] = useState(10);
  const [dumpingUpper, setDumpingUpper] = useState(10);
  const [platformFee, setPlatformFee] = useState(10);
  const [medianBaseRatio, setMedianBaseRatio] = useState(80);
  const [exposureCount, setExposureCount] = useState(5);
  const [saved, setSaved] = useState(false);

  // 실제 저장값 (소수)
  const dumpingLowerValue = dumpingLower / 100;
  const dumpingUpperValue = dumpingUpper / 100;
  const platformFeeValue = platformFee / 100;
  const medianBaseValue = medianBaseRatio / 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const fields = [
    {
      label: "덤핑 하한 비율",
      value: dumpingLower,
      setValue: setDumpingLower,
      min: 10,
      max: 100,
      step: 5,
      hint: "10% ~ 100%",
    },
    {
      label: "덤핑 상한 비율",
      value: dumpingUpper,
      setValue: setDumpingUpper,
      min: 10,
      max: 100,
      step: 5,
      hint: "10% ~ 100%",
    },
    {
      label: "플랫폼 수수료율",
      value: platformFee,
      setValue: setPlatformFee,
      min: 0,
      max: 30,
      step: 1,
      hint: "0% ~ 30%",
    },
    {
      label: "중앙값 기준 비율",
      value: medianBaseRatio,
      setValue: setMedianBaseRatio,
      min: 10,
      max: 100,
      step: 5,
      hint: "덤핑 상한·하한 제외 평균가의 %",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">수수료 산정 기준</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          덤핑 방지 비율 및 플랫폼 수수료를 설정합니다.
        </p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-md text-sm">
          설정이 저장되었습니다.
        </div>
      )}

      {/* 현재 기준 - 엑셀 스타일 테이블 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Settings className="h-4 w-4" />
            현재 기준
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-300 rounded overflow-hidden">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {[
                    "덤핑 하한 비율",
                    "덤핑 상한 비율",
                    "플랫폼 수수료율",
                    "중앙값 기준 비율",
                    "최저가 기준",
                    "노출건수",
                  ].map((h) => (
                    <th
                      key={h}
                      className="border-b border-r border-gray-300 px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap last:border-r-0"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td className="border-r border-gray-200 px-3 py-2 font-bold text-blue-600">
                    {dumpingLower}%
                  </td>
                  <td className="border-r border-gray-200 px-3 py-2 font-bold text-blue-600">
                    {dumpingUpper}%
                  </td>
                  <td className="border-r border-gray-200 px-3 py-2 font-bold text-blue-600">
                    {platformFee}%
                  </td>
                  <td className="border-r border-gray-200 px-3 py-2 font-bold text-blue-600">
                    {medianBaseRatio}%
                  </td>
                  <td className="border-r border-gray-200 px-3 py-2">
                    <span className="font-bold text-blue-600">
                      중앙값의 {medianBaseRatio}%
                    </span>
                    <p className="text-gray-400 text-xs">최저가 이상 추천</p>
                  </td>
                  <td className="border-gray-200 px-3 py-2">
                    <span className="font-bold text-blue-600">
                      {exposureCount}건
                    </span>
                    <p className="text-gray-400 text-xs">
                      최저가순 {exposureCount}건 노출
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 설정 변경 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">설정 변경</CardTitle>
          <CardDescription className="text-xs">
            % 단위로 입력하세요. 내부적으로 소수값으로 변환되어 저장됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {fields.map((f) => (
                <div key={f.label} className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    {f.label} ({f.hint})
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      min={f.min}
                      max={f.max}
                      step={f.step}
                      value={f.value}
                      onChange={(e) => f.setValue(Number(e.target.value))}
                      className="pr-8 text-sm"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      %
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{f.hint}</p>
                </div>
              ))}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  노출 건수 (1 ~ 20건)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  step={1}
                  value={exposureCount}
                  onChange={(e) => setExposureCount(Number(e.target.value))}
                  className="text-sm"
                />
                <p className="text-xs text-gray-400">
                  중앙값 {medianBaseRatio}% 이상 최저가순 추천 수
                </p>
              </div>
            </div>
            <Button
              type="submit"
              className="bg-[#34499C] hover:bg-[#2a3d84] text-sm"
            >
              설정 저장
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
