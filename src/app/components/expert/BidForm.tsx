import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export interface BidFormData {
  price: string;
}

interface BidFormProps {
  bidData: BidFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function BidForm({ bidData, onChange, onCancel, onSubmit }: BidFormProps) {
  return (
    <Card className="border-teal-500 border-2">
      <CardHeader>
        <CardTitle>입찰 정보 입력</CardTitle>
        <CardDescription>
          정확한 정보를 입력해주세요. 입찰가는 협상 전 가격입니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2 w-full">
            <Label htmlFor="price">
              입찰가 (원) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="2500000"
              value={bidData.price}
              onChange={onChange}
              required
            />
            <p className="text-xs text-gray-600">
              의뢰인 선택 후 최종 가격 협상이 가능합니다.
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700">
              입찰 제출하기
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
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
