import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export interface BidFormData {
  price: string;
}

interface BidFormProps {
  bidData: BidFormData;
  isSubmitting?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function BidForm({
  bidData,
  isSubmitting = false,
  onChange,
  onCancel,
  onSubmit,
}: BidFormProps) {
  return (
    <Card className="gap-3 border-2 border-teal-500 md:gap-6">
      <CardHeader className="p-3 md:px-6 md:pt-6">
        <CardTitle className="text-base md:text-lg">입찰 정보 입력</CardTitle>
        <CardDescription className="text-[11px] md:text-sm">
          정확한 정보를 입력해주세요. 입찰가는 협상 전 가격입니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 pb-3 [&:last-child]:pb-3 md:px-6 md:pb-6 md:[&:last-child]:pb-6">
        <form onSubmit={onSubmit} className="space-y-3 md:space-y-4">
          <div className="w-full space-y-1.5 md:space-y-2">
            <Label htmlFor="price" className="text-xs md:text-sm">
              입찰가 (원) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="2500000"
              step={1}
              value={bidData.price}
              onChange={onChange}
              disabled={isSubmitting}
              required
              className="h-9 text-sm md:text-base"
            />
            <p className="text-[11px] text-gray-600 md:text-xs">
              의뢰인 선택 후 최종 가격 협상이 가능합니다.
            </p>
          </div>

          <div className="flex gap-2 md:gap-4">
            <Button
              type="submit"
              className="h-9 flex-1 bg-teal-600 text-sm hover:bg-teal-700 md:h-10 md:text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? "입찰 제출 중..." : "입찰 제출하기"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9 flex-1 text-sm md:h-10 md:text-base"
              disabled={isSubmitting}
              onClick={onCancel}
            >
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
