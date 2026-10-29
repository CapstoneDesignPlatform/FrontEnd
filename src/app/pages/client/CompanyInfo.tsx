import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react"; // 💡 useEffect 추가
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { toast } from "sonner";
import { Info } from "lucide-react";
import { useFormFields } from "../../hooks/useFormFields";
import { apiClient, ApiError } from "../../../api/apiClient";
import { getStoredAccessToken } from "../../../api/authTokens";
import { isMissingCompany, requireClientInfoId } from "../../../api/companyInfoModel";
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

  const isLoggedIn = !!getStoredAccessToken();
  const [checking, setChecking] = useState(isLoggedIn);
  const [checkError, setCheckError] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const saveLock = useRef(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    let active = true;
    setChecking(true);
    setCheckError('');
    void apiClient.get<unknown>('/client-info').then(data => {
      const id = requireClientInfoId(data);
      if (!active) return;
      Cookies.set('CLIENT_INFO_ID', String(id), { expires: 1 });
      navigate('/client/create-project', { replace: true });
    }).catch(error => {
      if (!active) return;
      if (error instanceof ApiError && isMissingCompany(error.status, error.message)) {
        Cookies.remove('CLIENT_INFO_ID');
        return;
      }
      setCheckError(error instanceof ApiError && [401, 403].includes(error.status)
        ? '기업 정보를 조회할 권한이 없습니다. 의뢰인 계정의 로그인 상태를 확인해 주세요.'
        : error instanceof Error ? error.message : '기업 정보를 조회하지 못했습니다. 다시 시도해 주세요.');
    }).finally(() => { if (active) setChecking(false); });
    return () => { active = false; };
  }, [isLoggedIn, navigate, retryKey]);

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
    if (checking || checkError || saveLock.current) return;
    saveLock.current = true;
    setSaving(true);

    const payload = {
      representativeName: formData.representative,
      contact: formData.phone,
      email: formData.email,
      companyName: formData.companyName,
      businessNumber: formData.businessNumber || null,
      address: formData.address,
      website: formData.website,
      description: formData.description,
    };

    try {
      const endpoint = isLoggedIn ? "/client-info" : "/client-info/guest";
      const data = await apiClient.post<unknown>(endpoint, { body: payload });
      const newId = requireClientInfoId(data);
      Cookies.set("CLIENT_INFO_ID", String(newId), { expires: 1 });
      toast.success("기업 정보가 저장되었습니다!");
      navigate("/client/create-project");
    } catch (err) {
      if (err instanceof ApiError && [401, 403].includes(err.status)) {
        setCheckError('의뢰인 계정으로 다시 로그인한 후 진행해 주세요.');
      }
      toast.error(err instanceof Error ? err.message : "기업 정보 저장 중 오류가 발생했습니다.");
    } finally {
      saveLock.current = false;
      setSaving(false);
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
      {!isLoggedIn && <Alert className="mb-6 border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          비회원으로도 의뢰를 등록하실 수 있습니다. 기업 정보를 입력하신 후 바로 의뢰를 작성해보세요.
        </AlertDescription>
      </Alert>}

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">기업 정보 입력</CardTitle>
          <CardDescription>
            정확한 기업 정보를 입력해주세요. 전문가에게 신뢰를 줄 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {checking && <p role="status" className="mb-4 text-sm text-slate-500">기존 기업 정보를 확인하고 있습니다.</p>}
          {checkError && <p role="alert" className="mb-4 text-sm text-red-600">{checkError} <button type="button" className="underline" onClick={() => setRetryKey(key => key + 1)}>다시 조회</button></p>}
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
                      type="button"
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
              <Button type="submit" disabled={checking || !!checkError || saving} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {saving ? "저장 중..." : "다음: 의뢰 작성하기"}
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
