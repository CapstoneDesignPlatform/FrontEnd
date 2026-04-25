import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useOutletContext, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Building2, Users } from "lucide-react";
import { toast } from "sonner";
import { BidForm, type BidFormData } from "../../components/expert/BidForm";
import { createBid, getExpertJobDetail } from "../../../api/expert";
import type { ExpertJobDetailVM } from "../../../types/expert";

export function ProjectDetailExpert() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useOutletContext<{ user: unknown; setUser: (user: unknown) => void }>();
  const shouldOpenBidForm = location.pathname.endsWith("/bid");
  const [showBidForm, setShowBidForm] = useState(shouldOpenBidForm);
  const [project, setProject] = useState<ExpertJobDetailVM | null>(null);
  const [bidData, setBidData] = useState<BidFormData>({
    price: "",
  });

  // 컴포넌트 마운트 시 전문가로 user 설정
  useEffect(() => {
    setUser({ type: "expert", name: "전문가" });
  }, [setUser]);

  useEffect(() => {
    void getExpertJobDetail(id ?? 1).then(setProject);
  }, [id]);

  useEffect(() => {
    setShowBidForm(shouldOpenBidForm);
  }, [shouldOpenBidForm]);

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBidData({
      ...bidData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();

    void createBid({
      jobPostId: Number(id ?? project?.id ?? 1),
      price: Number(bidData.price),
    }).then(() => {
      toast.success("입찰이 완료되었습니다!");
      setTimeout(() => {
        navigate("/expert/bids");
      }, 1500);
    });
  };

  const handleCancelBid = () => {
    setShowBidForm(false);
    if (project && location.pathname.endsWith("/bid")) {
      navigate(`/expert/jobs/${project.id}`);
    }
  };

  if (!project) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">공고 정보를 불러오는 중입니다.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
              {project.industry}
            </Badge>
            <Badge variant="outline">{project.type}</Badge>
            <Badge className="bg-green-100 text-green-700">{project.status}</Badge>
          </div>
          <h1 className="text-3xl mb-2">{project.title}</h1>
          <p className="text-gray-600">등록일: {project.createdAt}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/expert/jobs">목록으로</Link>
          </Button>
          {!showBidForm && (
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => navigate(`/expert/jobs/${project.id}/bid`)}>입찰하기</Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 주요 정보 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 의뢰인이 입력한 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>의뢰 정보</CardTitle>
              <CardDescription>의뢰인이 입력한 상세 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">업종</p>
                    <p className="font-medium">{project.industry}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">공고 유형</p>
                    <p className="font-medium">{project.type}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">사업자 유형</p>
                    <p className="font-medium">{project.businessType}</p>
                  </div>
                  {project.classification && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">구분</p>
                      <p className="font-medium">{project.classification}</p>
                    </div>
                  )}
                </div>

                {/* 필요 면허 유형일 때 */}
                {project.type === "필요 면허" && (
                  <>
                    {project.requiredLicense && (
                      <div className="pb-4 border-b">
                        <p className="text-sm text-gray-600 mb-1">필요 면허</p>
                        <p className="font-medium">{project.requiredLicense}</p>
                      </div>
                    )}
                    {project.currentIndustry && (
                      <div className="pb-4 border-b">
                        <p className="text-sm text-gray-600 mb-1">현재 업종</p>
                        <p className="font-medium">{project.currentIndustry}</p>
                      </div>
                    )}
                  </>
                )}

                {/* 실태 조사 유형일 때 */}
                {project.type === "실태 조사" && project.currentLicense && (
                  <div className="pb-4 border-b">
                    <p className="text-sm text-gray-600 mb-1">보유 면허</p>
                    <p className="font-medium">{project.currentLicense}</p>
                  </div>
                )}

                {/* 기타 유형일 때 */}
                {project.type === "기타" && project.reason && (
                  <div className="pb-4 border-b">
                    <p className="text-sm text-gray-600 mb-1">진단 사유</p>
                    <p className="font-medium">{project.reason}</p>
                  </div>
                )}

                {/* 자산 규모 */}
                {project.assetScale && project.assetScale !== "-" && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">자산 규모</p>
                    <p className="font-medium">{project.assetScale}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 입찰 폼 */}
          {showBidForm && (
            <BidForm
              bidData={bidData}
              onChange={handleBidChange}
              onSubmit={handleSubmitBid}
              onCancel={handleCancelBid}
            />
          )}
        </div>

        {/* 사이드바 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>입찰 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-teal-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">현재 입찰 수</p>
                  <p className="font-medium text-lg">{project.bids}개</p>
                  <p className="text-xs text-gray-500 mt-1">
                    경쟁이 치열할수록 빠른 입찰이 유리합니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>의뢰 기업 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Building2 className="h-5 w-5 text-teal-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">회사명</p>
                  <p className="font-medium">{project.company.name}</p>
                </div>
              </div>
              <div className="pl-7">
                <p className="text-sm text-gray-600">대표자</p>
                <p className="font-medium">{project.company.representative}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-teal-50 border-teal-200">
            <CardContent className="pt-6">
              <h4 className="font-medium text-teal-900 mb-2">입찰 안내</h4>
              <ul className="text-sm text-teal-800 space-y-1">
                <li>• 입찰가는 협상 전 가격입니다</li>
                <li>• 의뢰인이 선택하면 연락처가 공개됩니다</li>
                <li>• 최종 가격은 직접 협상으로 결정됩니다</li>
              </ul>
            </CardContent>
          </Card>

          {!showBidForm && (
            <Button className="w-full bg-teal-600 hover:bg-teal-700" size="lg" onClick={() => navigate(`/expert/jobs/${project.id}/bid`)}>
              지금 입찰하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
