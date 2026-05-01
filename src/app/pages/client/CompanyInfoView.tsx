import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useFormFields } from "../../hooks/useFormFields";

const initialCompanyInfo = {
  companyName: "(주)테스트건설",
  businessNumber: "123-45-67890",
  representative: "홍길동",
  address: "서울특별시 강남구 테헤란로 123",
  phoneNumber: "02-1234-5678",
  email: "test@example.com",
  establishDate: "2020-01-15",
  capital: "100,000,000원",
  website: "https://example.com",
  description: "건설업 전문 기업으로 다양한 프로젝트 경험을 보유하고 있습니다.",
};

export function CompanyInfoView() {
  const [isEditing, setIsEditing] = useState(false);
  const [companyInfo, setCompanyInfo] = useState(initialCompanyInfo);
  const {
    handleChange,
    setValues: setEditedInfo,
    values: editedInfo,
  } = useFormFields(initialCompanyInfo);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo(companyInfo);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedInfo(companyInfo);
  };

  const handleSave = () => {
    setCompanyInfo(editedInfo);
    setIsEditing(false);
    toast.success("기업 정보가 성공적으로 수정되었습니다.");
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>등록된 기업 정보</CardTitle>
          {!isEditing && (
            <Button onClick={handleEdit} className="gap-2">
              <Edit className="w-4 h-4" />
              수정
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            // 조회 모드
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">기업명</p>
                  <p className="font-semibold">{companyInfo.companyName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">사업자등록번호</p>
                  <p className="font-semibold">{companyInfo.businessNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">대표자명</p>
                  <p className="font-semibold">{companyInfo.representative}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">주소</p>
                  <p className="font-semibold">{companyInfo.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">설립일</p>
                  <p className="font-semibold">{companyInfo.establishDate}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">이메일</p>
                  <p className="font-semibold">{companyInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">전화번호</p>
                  <p className="font-semibold">{companyInfo.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">자본금</p>
                  <p className="font-semibold">{companyInfo.capital}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">웹사이트</p>
                  <p className="font-semibold text-blue-600">
                    {companyInfo.website || "-"}
                  </p>
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">회사 소개</p>
                <p className="font-semibold whitespace-pre-wrap">
                  {companyInfo.description || "-"}
                </p>
              </div>
            </div>
          ) : (
            // 수정 모드
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">
                    기업명
                  </Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={editedInfo.companyName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessNumber">
                    사업자등록번호
                  </Label>
                  <Input
                    id="businessNumber"
                    name="businessNumber"
                    value={editedInfo.businessNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="representative">
                    대표자명 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="representative"
                    name="representative"
                    value={editedInfo.representative}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    전화번호 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={editedInfo.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  주소
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={editedInfo.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    이메일 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={editedInfo.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">웹사이트</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={editedInfo.website}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="establishDate">
                    설립일
                  </Label>
                  <Input
                    id="establishDate"
                    name="establishDate"
                    type="date"
                    value={editedInfo.establishDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capital">
                    자본금
                  </Label>
                  <Input
                    id="capital"
                    name="capital"
                    placeholder="100,000,000원"
                    value={editedInfo.capital}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">회사 소개</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={5}
                  placeholder="회사에 대한 간단한 소개를 입력해주세요."
                  value={editedInfo.description}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  취소
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  저장
                </Button>
              </div>
            </form>
          )}

          {!isEditing && (
            <div className="mt-6 pt-6 border-t">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">💡 안내사항:</span> 기업 정보에 변동사항이 있다면 
                  우측 상단의 "수정" 버튼을 눌러 정보를 업데이트하실 수 있습니다. 
                  정확한 정보는 전문가에게 신뢰를 줄 수 있습니다.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
