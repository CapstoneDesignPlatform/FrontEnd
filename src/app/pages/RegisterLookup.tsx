import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { Search } from "lucide-react";

export function ReservationLookup() {
  const navigate = useNavigate();
  const [reservationCode, setReservationCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (reservationCode) {
      toast.success("예약 정보를 조회했습니다.");
    } else {
      toast.error("예약코드를 입력해주세요.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">비회원 예약 조회</CardTitle>
          <CardDescription>
            예약 시 발급받은 예약코드를 입력하여 진행 상황을 확인하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reservationCode">예약코드</Label>
              <div className="relative">
                <Input
                  id="reservationCode"
                  type="text"
                  placeholder="예) ABC-1234-5678"
                  value={reservationCode}
                  onChange={(e) => setReservationCode(e.target.value)}
                  required
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <p className="text-xs text-gray-600">
                예약코드는 견적 요청 접수 시 이메일로 발송되었습니다.
              </p>
            </div>

            <Button type="submit" className="w-full">
              예약 조회하기
            </Button>

            <div className="text-center text-sm pt-4">
              <span className="text-gray-600">예약코드를 찾을 수 없으신가요? </span>
              <Link to="/login" className="text-blue-600 hover:underline">
                로그인하기
              </Link>
            </div>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-sm mb-2">예약코드를 받지 못하셨나요?</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• 스팸 메일함을 확인해주세요</li>
              <li>• 이메일 주소를 정확히 입력했는지 확인해주세요</li>
              <li>• 문의사항은 고객센터로 연락주세요</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
