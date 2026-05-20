import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { toast } from "sonner";
import { Info } from "lucide-react";
import { useFormFields } from "../../hooks/useFormFields";
import { userInstance } from "../../../api/instance"; 
import Cookies from "js-cookie"; 

const initialCompanyInfoForm = {
  companyName: "",
  businessNumber: "",
  representative: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  description: "",
};

export function CompanyInfo() {
  const navigate = useNavigate();
  const { handleChange, values: formData } = useFormFields(initialCompanyInfoForm);

  const isLoggedIn = !!Cookies.get("ACCESS_TOKEN");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      representativeName: formData.representative,
      contact: formData.phone,
      email: formData.email,
      companyName: formData.companyName,
      businessNumber: formData.businessNumber,
      address: formData.address,
      website: formData.website,
      description: formData.description,
    };

    try {
      const endpoint = isLoggedIn ? "/client-info" : "/client-info/guest";
      const res = await userInstance.post(endpoint, payload);

      if (res.data.success) {
        const newId = res.data.data.id;
        Cookies.set("CLIENT_INFO_ID", String(newId), { expires: 1 });
        toast.success("기업 정보가 저장되었습니다!");
        navigate("/client/create-project");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "기업 정보 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Alert className="mb-6 border-teal-200 bg-teal-50">
        <Info className="h-4 w-4 text-teal-600" />
        <AlertDescription className="text-teal-800">
          비회원으로도 의뢰를 등록하실 수 있습니다. 기업 정보를 입력하신 후 바로 공고를 작성해보세요.
        </AlertDescription>
      </Alert>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">기업 정보 입력</CardTitle>
          <CardDescription>
            정확한 기업 정보를 입력해주세요. 전문가에게 신뢰를 줄 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">회사명</Label>
                <Input id="companyName" name="companyName" placeholder="(주)프로토콜" value={formData.companyName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessNumber">사업자등록번호</Label>
                <Input id="businessNumber" name="businessNumber" placeholder="123-45-67890" value={formData.businessNumber} onChange={handleChange} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <Label htmlFor="representative">대표자명</Label>
                  <span className="text-[11px] text-red-500">* 필수</span>
                </div>
                <Input id="representative" name="representative" placeholder="홍길동" value={formData.representative} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <Label htmlFor="phone">연락처</Label>
                  <span className="text-[11px] text-red-500">* 필수</span>
                </div>
                <Input id="phone" name="phone" type="tel" placeholder="010-1234-5678" value={formData.phone} onChange={handleChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">사업장 주소</Label>
              <Input id="address" name="address" placeholder="서울특별시 강남구..." value={formData.address} onChange={handleChange} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <Label htmlFor="email">이메일</Label>
                  <span className="text-[11px] text-red-500">* 필수</span>
                </div>
                <Input id="email" name="email" type="email" placeholder="company@example.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">웹사이트</Label>
                <Input id="website" name="website" type="url" placeholder="https://example.com" value={formData.website} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">회사 소개</Label>
              <Textarea id="description" name="description" placeholder="회사에 대한 간단한 소개를 입력해주세요." rows={5} value={formData.description} onChange={handleChange} />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700">
                다음: 공고 작성하기
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/")}>
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}