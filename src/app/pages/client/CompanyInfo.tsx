import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // 💡 useEffect 추가
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
import DaumPostcodeEmbed from "react-daum-postcode"; 
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
  const { handleChange, values: formData, setValues } = useFormFields(initialCompanyInfoForm);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  const isLoggedIn = !!Cookies.get("ACCESS_TOKEN");

  // ── 💡 [핵심 추가] 기존에 등록된 기업 정보가 있는지 진입할 때 체크 ──
  useEffect(() => {
    if (isLoggedIn) {
      const checkExistingCompany = async () => {
        try {
          const res = await userInstance.get("/client-info");
          // 이미 기업 정보가 있다면 굳이 다시 받지 않고 의뢰 작성 페이지로 이동
          if (res.data.success && res.data.data?.companyName) {
            toast.info("기존에 등록된 기업 정보가 확인되어 의뢰 작성 페이지로 이동합니다.");
            navigate("/client/create-project");
          }
        } catch (err: any) {
          console.log("기존 기업 정보가 없습니다. 새로 등록을 진행합니다.");
        }
      };
      checkExistingCompany();
    }
  }, [isLoggedIn, navigate]);

  // 💡 1. 사업자등록번호 포매터 (000-00-00000)
  const formatBusinessNumber = (value: string) => {
    const nums = value.replace(/[^\d]/g, "");
    if (nums.length <= 3) return nums;
    if (nums.length <= 5) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 5)}-${nums.slice(5, 10)}`;
  };

  // 💡 2. 연락처 포매터 (010-0000-0000)
  const formatPhoneNumber = (value: string) => {
    const nums = value.replace(/[^\d]/g, "");
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7, 11)}`;
  };

  // 💡 3. 숫자 포매팅 전용 핸들러 (입력할 때 가로채서 하이픈을 넣어줍니다)
  const handleFormattedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "businessNumber") {
      setValues((prev: any) => ({ ...prev, [name]: formatBusinessNumber(value) }));
    } else if (name === "phone") {
      setValues((prev: any) => ({ ...prev, [name]: formatPhoneNumber(value) }));
    }
  };

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

  const handleCompletePostcode = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") extraAddress += data.bname;
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setValues((prev: any) => ({
      ...prev,
      address: fullAddress,
    }));

    setIsPostcodeOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          비회원으로도 의뢰를 등록하실 수 있습니다. 기업 정보를 입력하신 후 바로 의뢰를 작성해보세요.
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
                <Input 
                  id="businessNumber" 
                  name="businessNumber" 
                  placeholder="123-45-67890" 
                  value={formData.businessNumber} 
                  onChange={handleFormattedChange} 
                  maxLength={12} 
                />
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
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  placeholder="010-1234-5678" 
                  value={formData.phone} 
                  onChange={handleFormattedChange} 
                  maxLength={13} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">사업장 주소</Label>
              <div className="flex gap-2">
                <Input 
                  id="address" 
                  name="address" 
                  placeholder="주소 검색을 이용해 주세요." 
                  value={formData.address} 
                  readOnly 
                  onClick={() => setIsPostcodeOpen(true)} 
                  className="cursor-pointer"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsPostcodeOpen(true)}
                >
                  주소 검색
                </Button>
              </div>
            </div>

            {isPostcodeOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="relative w-full max-w-lg rounded-lg bg-white p-4 shadow-xl">
                  <div className="flex items-center justify-between mb-3 border-b pb-2">
                    <h3 className="font-semibold text-lg text-gray-800">주소 검색</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsPostcodeOpen(false)}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      닫기
                    </Button>
                  </div>
                  <DaumPostcodeEmbed onComplete={handleCompletePostcode} />
                </div>
              </div>
            )}

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
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                다음: 의뢰 작성하기
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