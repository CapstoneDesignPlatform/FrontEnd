import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Building2, Users, FileText, DollarSign, CheckCircle2, ArrowRight, Search } from "lucide-react";

export function Home() {
  return (
    <div>
      {/* 히어로 섹션 */}
      <section className="bg-[#34499C] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl mb-6">
            전문가와 의뢰인을 연결하는
            <br />
            스마트 매칭 플랫폼
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            면허 취득, 실태 조사 등 전문 서비스가 필요하신가요?
            <br />
            투명한 입찰 시스템으로 최적의 전문가를 만나보세요.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/client/start">
                의뢰인으로 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
              <Link to="/signup/expert">전문가로 시작하기</Link>
            </Button>
          </div>
          <div className="mt-6">
            <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10 border border-white/30">
              <Link to="/check-request">
                <Search className="mr-2 h-5 w-5" />
                내 의뢰 확인하기
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 서비스 소개 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 ">
          <h2 className="text-3xl text-center mb-12">서비스 분야</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-6">
                <FileText className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>필요 면허</CardTitle>
                <CardDescription>
                  사업에 필요한 각종 면허 취득을 전문가에게 의뢰하세요.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-6">
                <Building2 className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>실태 조사</CardTitle>
                <CardDescription>
                  기업 실태 조사와 진단을 전문가가 정확하게 수행합니다.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-6">
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>기타 서비스</CardTitle>
                <CardDescription>
                  그 외 다양한 전문 서비스를 요청하실 수 있습니다.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* 이용 방법 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* 의뢰인 */}
            <div>
              <h2 className="text-3xl mb-8">의뢰인 이용 방법</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <h3 className="mb-2">회원가입 또는 비회원 이용</h3>
                    <p className="text-gray-600">간편하게 회원가입하거나 비회원으로도 서비스를 이용할 수 있습니다.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <h3 className="mb-2">기업 정보 입력</h3>
                    <p className="text-gray-600">기본적인 기업 정보를 입력합니다.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <h3 className="mb-2">의뢰 의뢰 작성 및 게시</h3>
                    <p className="text-gray-600">필요한 서비스를 선택하고 상세 내용을 작성합니다.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    4
                  </div>
                  <div>
                    <h3 className="mb-2">전문가 선택 및 결제</h3>
                    <p className="text-gray-600">입찰한 전문가 중 최저가 기준 3~5명을 확인하고 선택합니다.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 전문가 */}
            <div>
              <h2 className="text-3xl mb-8">전문가 이용 방법</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#34499C] text-white rounded-full flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <h3 className="mb-2">회원가입</h3>
                    <p className="text-gray-600">전문가로 회원가입을 진행합니다.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#34499C] text-white rounded-full flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <h3 className="mb-2">전문가 인증</h3>
                    <p className="text-gray-600">자격증 및 경력을 인증받습니다.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#34499C] text-white rounded-full flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <h3 className="mb-2">의뢰 확인 및 입찰</h3>
                    <p className="text-gray-600">등록된 의뢰를 확인하고 가격을 입찰합니다.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#34499C] text-white rounded-full flex items-center justify-center">
                    4
                  </div>
                  <div>
                    <h3 className="mb-2">협상 및 서비스 제공</h3>
                    <p className="text-gray-600">의뢰인과 협상 후 최종 가격을 결정하고 서비스를 제공합니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 특징 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-center mb-12">왜 저희 플랫폼인가요?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader className="pb-6">
                <DollarSign className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
                <CardTitle>투명한 가격</CardTitle>
                <CardDescription>
                  입찰 시스템으로 공정한 가격 책정
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader className="pb-6">
                <CheckCircle2 className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
                <CardTitle>검증된 전문가</CardTitle>
                <CardDescription>
                  인증 시스템으로 신뢰할 수 있는 전문가
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader className="pb-6">
                <Users className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
                <CardTitle>직접 협상</CardTitle>
                <CardDescription>
                  의뢰인과 전문가 간 직접 소통
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader className="pb-6">
                <Building2 className="h-12 w-12 text-blue-600 mb-4 mx-auto" />
                <CardTitle>다양한 분야</CardTitle>
                <CardDescription>
                  면허, 조사, 진단 등 폭넓은 서비스
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#34499C] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl mb-6">지금 바로 시작하세요</h2>
          <p className="text-xl mb-8 text-blue-100">
            간편한 가입으로 진단매치 서비스를 이용해보세요.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/register">시작하기</Link>
          </Button>
        </div>
      </section>

      {/* 데모버전 - 관리인 접속 */}
      <section className="py-8 bg-gray-100 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 mb-3">데모 버전</p>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin">
              관리인 접속
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
