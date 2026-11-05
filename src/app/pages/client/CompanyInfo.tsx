import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { toast } from "sonner";
import { Info } from "lucide-react";
import { useFormFields } from "../../hooks/useFormFields";
import { apiClient, ApiError } from "../../../api/apiClient";
import { getStoredAccessToken } from "../../../api/authTokens";
import { isMissingCompany, requireClientInfoId } from "../../../api/companyInfoModel";
import Cookies from "js-cookie"; 

const REGIONS: Record<string, string[]> = {
  서울특별시: ["종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구", "성북구", "강북구", "도봉구", "노원구", "은평구", "서대문구", "마포구", "양천구", "강서구", "구로구", "금천구", "영등포구", "동작구", "관악구", "서초구", "강남구", "송파구", "강동구"],
  부산광역시: ["중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구", "해운대구", "사하구", "금정구", "강서구", "연제구", "수영구", "사상구", "기장군"],
  대구광역시: ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군", "군위군"],
  인천광역시: ["중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"],
  광주광역시: ["동구", "서구", "남구", "북구", "광산구"],
  대전광역시: ["동구", "중구", "서구", "유성구", "대덕구"],
  울산광역시: ["중구", "남구", "동구", "북구", "울주군"],
  세종특별자치시: [],
  경기도: ["수원시", "용인시", "고양시", "화성시", "성남시", "부천시", "남양주시", "안산시", "평택시", "안양시", "시흥시", "파주시", "김포시", "의정부시", "광주시", "하남시", "광명시", "군포시", "양주시", "오산시", "이천시", "안성시", "구리시", "의왕시", "포천시", "양평군", "여주시", "동두천시", "가평군", "과천시", "연천군"],
  강원특별자치도: ["춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시", "홍천군", "횡성군", "영월군", "평창군", "정선군", "철원군", "화천군", "양구군", "인제군", "고성군", "양양군"],
  충청북도: ["청주시", "충주시", "제천시", "보은군", "옥천군", "영동군", "증평군", "진천군", "괴산군", "음성군", "단양군"],
  충청남도: ["천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시", "당진시", "금산군", "부여군", "서천군", "청양군", "홍성군", "예산군", "태안군"],
  전북특별자치도: ["전주시", "군산시", "익산시", "정읍시", "남원시", "김제시", "완주군", "진안군", "무주군", "장수군", "임실군", "순창군", "고창군", "부안군"],
  전라남도: ["목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군", "구례군", "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군", "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군", "신안군"],
  경상북도: ["포항시", "경주시", "김천시", "안동시", "구미시", "영주시", "영천시", "상주시", "문경시", "경산시", "의성군", "청송군", "영양군", "영덕군", "청도군", "고령군", "성주군", "칠곡군", "예천군", "봉화군", "울진군", "울릉군"],
  경상남도: ["창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시", "양산시", "의령군", "함안군", "창녕군", "고성군", "남해군", "하동군", "산청군", "함양군", "거창군", "합천군"],
  제주특별자치도: ["제주시", "서귀포시"],
};

const initialCompanyInfoForm = {
  companyName: "",
  representative: "",
  managerName: "",
  province: "",
  district: "",
  email: "",
};

const EMAIL_DOMAINS = [
  { value: "naver.com", label: "naver.com", icon: "https://www.google.com/s2/favicons?domain=naver.com&sz=64" },
  { value: "gmail.com", label: "gmail.com", icon: "https://www.google.com/s2/favicons?domain=gmail.com&sz=64" },
  { value: "daum.net", label: "daum.net", icon: "https://www.google.com/s2/favicons?domain=daum.net&sz=64" },
  { value: "hanmail.net", label: "hanmail.net", icon: "https://www.google.com/s2/favicons?domain=hanmail.net&sz=64" },
  { value: "kakao.com", label: "kakao.com", icon: "https://www.google.com/s2/favicons?domain=kakao.com&sz=64" },
] as const;

export function CompanyInfo() {
  const navigate = useNavigate();
  const { handleChange, values: formData, setValues } = useFormFields(initialCompanyInfoForm);
  const [managerNameError, setManagerNameError] = useState("");
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [emailDomainOption, setEmailDomainOption] = useState("custom");
  const [contactPhone, setContactPhone] = useState("");

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

  // 연락처 포매터 (010-0000-0000)
  const formatPhoneNumber = (value: string) => {
    const nums = value.replace(/[^\d]/g, "");
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7, 11)}`;
  };

  const updateEmail = (nextId: string, nextDomain: string) => {
    setValues((current) => ({
      ...current,
      email: nextId ? `${nextId}@${nextDomain}` : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (checking || checkError || saveLock.current) return;
    if (!isLoggedIn) { toast.error("비회원 의뢰는 휴대폰 인증 연결 후 이용할 수 있습니다."); return; }
    if (!/^010\d{8}$/.test(contactPhone.replace(/\D/g, ""))) { toast.error("휴대폰 번호 11자리를 입력해 주세요."); return; }

    if (!formData.managerName.trim()) {
      setManagerNameError("담당자명을 입력해 주세요.");
      return;
    }

    if (emailId && !emailDomain) {
      toast.error("이메일 도메인을 입력하거나 선택해 주세요.");
      return;
    }

    if (emailId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      toast.error("이메일 형식을 정확히 입력해 주세요.");
      return;
    }

    setManagerNameError("");
    saveLock.current = true;
    setSaving(true);

    const selectedAddress = [formData.province, formData.district].filter(Boolean).join(" ");
    const payload = {
      managerName: formData.managerName.trim(),
      contact: formatPhoneNumber(contactPhone),
      ...(formData.companyName.trim() && { companyName: formData.companyName.trim() }),
      ...(formData.representative.trim() && { representativeName: formData.representative.trim() }),
      ...(selectedAddress && { address: selectedAddress }),
      ...(formData.email.trim() && { email: formData.email.trim() }),
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


  return (
    <div className="max-w-3xl mx-auto py-8">
      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          회원가입 없이 간편하게 기업진단을 의뢰할 수 있습니다.
        </AlertDescription>
      </Alert>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">기업 정보 입력</CardTitle>
          <CardDescription>
            아는 범위에서 정확하게 입력해 주세요.
            <br />
            구체적인 기업 정보는 전문가가 보다 합리적인 수수료를 제안하는 데 도움이 됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {checking && <p role="status" className="mb-4 text-sm text-slate-500">기존 기업 정보를 확인하고 있습니다.</p>}
          {checkError && <p role="alert" className="mb-4 text-sm text-red-600">{checkError} <button type="button" className="underline" onClick={() => setRetryKey(key => key + 1)}>다시 조회</button></p>}
          {!isLoggedIn && <p role="status" className="mb-4 text-sm text-amber-700">비회원 휴대폰 인증을 준비하고 있습니다. 회원으로 로그인하여 의뢰할 수 있습니다.</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <Label htmlFor="companyName">회사명(사업자명)</Label>
                </div>
                <Input id="companyName" name="companyName" placeholder="(주)프로토콜" value={formData.companyName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <Label htmlFor="representative">대표자명</Label>
                </div>
                <Input id="representative" name="representative" placeholder="홍길동" value={formData.representative} onChange={handleChange} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <Label htmlFor="managerName">담당자명</Label>
                  <span className="text-[11px] text-red-500">* 필수</span>
                </div>
                <Input
                  id="managerName"
                  name="managerName"
                  placeholder="홍길동"
                  value={formData.managerName}
                  onChange={(event) => {
                    handleChange(event);
                    if (managerNameError) setManagerNameError("");
                  }}
                  aria-invalid={!!managerNameError}
                  aria-describedby={managerNameError ? "managerName-error" : undefined}
                />
                {managerNameError && (
                  <p id="managerName-error" className="text-xs text-red-500">담당자명을 입력해 주세요.</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <Label htmlFor="phone">연락처</Label>
                </div>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  value={formatPhoneNumber(contactPhone)}
                  onChange={(event) => setContactPhone(formatPhoneNumber(event.target.value))}
                  required
                  maxLength={13}
                />
                <p className="text-xs text-gray-500">의뢰 관련 연락을 받을 휴대폰 번호를 입력해 주세요.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <Label>사업장 소재지</Label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <select
                      id="province"
                      name="province"
                      aria-label="시·도"
                      value={formData.province}
                      onChange={(event) => {
                        setValues((current) => ({
                          ...current,
                          province: event.target.value,
                          district: "",
                        }));
                      }}
                      className="border-input bg-input-background h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    >
                      <option value="">시·도 선택</option>
                      {Object.keys(REGIONS).map((province) => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <select
                      id="district"
                      name="district"
                      aria-label="시·군·구"
                      value={formData.district}
                      onChange={handleChange}
                      disabled={!formData.province || REGIONS[formData.province].length === 0}
                      className="border-input bg-input-background h-9 w-full rounded-md border px-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    >
                      <option value="">
                        {formData.province && REGIONS[formData.province].length === 0 ? "해당 없음" : "시·군·구 선택"}
                      </option>
                      {(REGIONS[formData.province] ?? []).map((district) => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <Label htmlFor="email">이메일</Label>
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_minmax(0,0.8fr)] items-center gap-2">
                  <Input
                    id="email"
                    aria-label="이메일 아이디"
                    value={emailId}
                    onChange={(event) => {
                      const nextId = event.target.value.replace(/[\s@]/g, "");
                      setEmailId(nextId);
                      updateEmail(nextId, emailDomain);
                    }}
                  />
                  <span className="text-sm text-gray-500">@</span>
                  <Input
                    aria-label="이메일 도메인"
                    value={emailDomain}
                    readOnly={emailDomainOption !== "custom"}
                    onChange={(event) => {
                      const nextDomain = event.target.value.replace(/[\s@]/g, "");
                      setEmailDomain(nextDomain);
                      updateEmail(emailId, nextDomain);
                    }}
                    className={emailDomainOption !== "custom" ? "bg-gray-100" : undefined}
                  />
                  <Select
                    value={emailDomainOption}
                    onValueChange={(nextOption) => {
                      const nextDomain = nextOption === "custom" ? "" : nextOption;
                      setEmailDomainOption(nextOption);
                      setEmailDomain(nextDomain);
                      updateEmail(emailId, nextDomain);
                    }}
                  >
                    <SelectTrigger aria-label="이메일 도메인 선택" className="min-w-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">직접입력</SelectItem>
                      {EMAIL_DOMAINS.map((domain) => (
                        <SelectItem key={domain.value} value={domain.value}>
                          <img
                            src={domain.icon}
                            alt=""
                            aria-hidden="true"
                            className="size-5 rounded-sm object-contain"
                          />
                          <span>{domain.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={checking || !!checkError || saving || !isLoggedIn} className="flex-1 bg-blue-600 hover:bg-blue-700">
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
