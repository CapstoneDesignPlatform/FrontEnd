import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 페이지 이동용
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Edit, Save, X, Info } from "lucide-react"; // ✅ Info 아이콘 추가
import { toast } from "sonner";
import { userInstance } from "../../../api/instance"; 

const emptyCompanyInfo = {
  companyName: "",
  businessNumber: "",
  representative: "",
  address: "",
  phoneNumber: "",
  email: "",
  website: "",
  description: "",
};

export function CompanyInfoView() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState(emptyCompanyInfo);
  const [editedInfo, setEditedInfo] = useState(emptyCompanyInfo);

  const formatBusinessNumber = (value: string) => {
    const nums = value.replace(/[^\d]/g, "");
    if (nums.length <= 3) return nums;
    if (nums.length <= 5) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 5)}-${nums.slice(5, 10)}`;
  };

  const formatPhoneNumber = (value: string) => {
    const nums = value.replace(/[^\d]/g, "");
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7, 11)}`;
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "businessNumber") {
      setEditedInfo({ ...editedInfo, [name]: formatBusinessNumber(value) });
    } else if (name === "phoneNumber") {
      setEditedInfo({ ...editedInfo, [name]: formatPhoneNumber(value) });
    } else {
      setEditedInfo({ ...editedInfo, [name]: value });
    }
  };

  // ── 조회 ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const res = await userInstance.get("/client-info");
        if (res.data.success) {
          const d = res.data.data;
          const mapped = {
            companyName: d.companyName ?? "",
            businessNumber: d.businessNumber ?? "",
            representative: d.representativeName ?? "",
            address: d.address ?? "",
            phoneNumber: d.contact ?? "",
            email: d.email ?? "",
            website: d.website ?? "",
            description: d.description ?? "",
          };
          setCompanyInfo(mapped);
          setEditedInfo(mapped);
        }
      } catch (err: any) {
        // 404 에러 시엔 그냥 로딩만 끄고 안내 화면(Empty State)을 보여줄 예정이므로 별도 toast는 안 띄워도 됩니다.
        if (err.response?.status !== 404) {
          toast.error(err.response?.data?.message || "기업 정보를 불러오지 못했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanyInfo();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo(companyInfo);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedInfo(companyInfo);
  };

  const handleSave = async () => {
    try {
      const payload = {
        representativeName: editedInfo.representative,
        contact: editedInfo.phoneNumber,
        email: editedInfo.email,
        companyName: editedInfo.companyName,
        businessNumber: editedInfo.businessNumber,
        address: editedInfo.address,
        website: editedInfo.website,
        description: editedInfo.description,
      };

      const res = await userInstance.put("/client-info", payload);
      if (res.data.success) {
        setCompanyInfo(editedInfo);
        setIsEditing(false);
        toast.success("기업 정보가 성공적으로 수정되었습니다.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "수정 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-gray-500">불러오는 중...</div>;
  }

  // ── ✨ 404 대응: 등록된 정보가 없을 때 보여주는 세련된 화면 ──
  if (!companyInfo.companyName) {
    return (
      <Card className="border-dashed border-2 bg-gray-50/50">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Info className="w-8 h-8 text-gray-400" />
          </div>
          <CardTitle className="text-xl mb-2">등록된 기업 정보가 없습니다</CardTitle>
          <p className="text-gray-500 mb-6 leading-relaxed">
            전문가에게 프로젝트를 의뢰하기 위해<br />
            먼저 기업 정보를 등록해주세요.
          </p>
          <Button 
            onClick={() => navigate("/client/company-info")}
            className="bg-teal-600 hover:bg-teal-700 gap-2"
          >
            기업 정보 등록하러 가기
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>등록된 기업 정보</CardTitle>
          {!isEditing && (
            <Button onClick={handleEdit} className="gap-2">
              <Edit className="w-4 h-4" /> 수정
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            /* ── 원본 UI 형태 (조회 모드) ── */
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">기업명</p>
                  <p className="font-semibold">{companyInfo.companyName || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">사업자등록번호</p>
                  <p className="font-semibold">{companyInfo.businessNumber || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">대표자명</p>
                  <p className="font-semibold">{companyInfo.representative || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">주소</p>
                  <p className="font-semibold">{companyInfo.address || "-"}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">이메일</p>
                  <p className="font-semibold">{companyInfo.email || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">전화번호</p>
                  <p className="font-semibold">{companyInfo.phoneNumber || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">웹사이트</p>
                  <p className="font-semibold text-blue-600">{companyInfo.website || "-"}</p>
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">회사 소개</p>
                <p className="font-semibold whitespace-pre-wrap">{companyInfo.description || "-"}</p>
              </div>
            </div>
          ) : (
            /* ── 원본 UI 형태 (수정 모드) ── */
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">기업명</Label>
                  <Input id="companyName" name="companyName" value={editedInfo.companyName} onChange={handleCustomChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessNumber">사업자등록번호</Label>
                  <Input id="businessNumber" name="businessNumber" value={editedInfo.businessNumber} onChange={handleCustomChange} maxLength={12} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="representative">대표자명 <span className="text-red-500">*</span></Label>
                  <Input id="representative" name="representative" value={editedInfo.representative} onChange={handleCustomChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">전화번호 <span className="text-red-500">*</span></Label>
                  <Input id="phoneNumber" name="phoneNumber" value={editedInfo.phoneNumber} onChange={handleCustomChange} maxLength={13} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">주소</Label>
                <Input id="address" name="address" value={editedInfo.address} onChange={handleCustomChange} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일 <span className="text-red-500">*</span></Label>
                  <Input id="email" name="email" type="email" value={editedInfo.email} onChange={handleCustomChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">웹사이트</Label>
                  <Input id="website" name="website" type="url" value={editedInfo.website} onChange={handleCustomChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">회사 소개</Label>
                <Textarea id="description" name="description" rows={5} value={editedInfo.description} onChange={handleCustomChange} />
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleCancel} className="gap-2"><X className="w-4 h-4" /> 취소</Button>
                <Button type="button" onClick={handleSave} className="gap-2"><Save className="w-4 h-4" /> 저장</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}