import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  FileSearch,
  Gavel,
  Handshake,
  ShieldCheck,
} from "lucide-react";

import { progressSteps } from "../../../../api/clientAnnouncementsModel";
import { industries } from "../../client/createProject/createProjectConfig";
import { Button } from "../../../components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";

const features = [
  {
    icon: Gavel,
    title: "공개 입찰",
    description: "의뢰를 등록하면 인증된 전문가들이 진단수수료를 직접 제안합니다.",
  },
  {
    icon: BadgeCheck,
    title: "인증된 전문가",
    description: "자격증과 사업자 정보를 제출해 관리자 심사를 통과한 전문가만 입찰할 수 있습니다.",
  },
  {
    icon: FileSearch,
    title: "비교 후 직접 선택",
    description: "입찰 금액과 전문가 정보를 비교해 의뢰인이 최종 전문가를 결정합니다.",
  },
  {
    icon: ClipboardList,
    title: "진행 상황 확인",
    description: "의뢰 등록부터 진단보고서 수령까지 단계별 진행 상태를 확인할 수 있습니다.",
  },
];

const expertPrinciples = [
  "최종 선정 기준은 최저 입찰가가 아니며, 의뢰인이 전문가 정보를 바탕으로 결정합니다.",
  "선정 후에는 입찰가 이하로 금액을 조정할 수 없습니다.",
  "보고서는 관련 법규를 준수하여 작성하며, 보고서 내용에 대한 책임은 전문가에게 있습니다.",
  "용역 범위·기한·수수료 수납은 의뢰인과 직접 협의하여 진행합니다.",
];

export function BidIntro() {
  return (
    <div className="desktop-bid-intro">
      <section className="bg-[#34499C] py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-3 text-sm font-semibold tracking-wider text-blue-200">전문 bid</p>
          <h1 className="mb-5 text-4xl font-bold leading-tight">
            기업진단, 입찰로 맞는 전문가를 찾으세요
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-blue-100">
            전문 bid는 진단매치의 입찰형 매칭 서비스입니다. 의뢰인은 조건을 한 번 등록하고,
            인증된 전문가들의 제안을 비교해 선택합니다.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary">
              <Link to="/client/start">
                기업진단 의뢰하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <Link to="/signup/expert">전문가로 입찰 참여하기</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold">전문 bid의 특징</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardHeader className="pb-6">
                  <Icon className="mb-4 h-10 w-10 text-blue-600" aria-hidden="true" />
                  <CardTitle>{title}</CardTitle>
                  <CardDescription className="leading-relaxed">{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-14">
        <div className="container mx-auto px-4">
          <h2 className="mb-3 text-center text-3xl font-bold">진행 절차</h2>
          <p className="mb-10 text-center text-gray-600">의뢰는 아래 7단계로 진행됩니다.</p>
          <ol className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {progressSteps.map((step, index) => (
              <li key={step} className="flex items-center gap-3 rounded-xl border bg-white p-4">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span className="font-medium">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container mx-auto px-4">
          <h2 className="mb-3 text-center text-3xl font-bold">진단 분야</h2>
          <p className="mb-8 text-center text-gray-600">아래 업종의 기업진단을 의뢰할 수 있습니다.</p>
          <ul className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
            {industries.map((industry) => (
              <li
                key={industry.value}
                className="rounded-full border border-blue-100 bg-blue-50 px-5 py-2 text-sm font-medium text-blue-700"
              >
                {industry.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-gray-50 py-14">
        <div className="container mx-auto grid max-w-5xl gap-6 px-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Handshake className="mb-3 h-9 w-9 text-blue-600" aria-hidden="true" />
              <CardTitle>의뢰인이라면</CardTitle>
              <CardDescription className="space-y-2 leading-relaxed">
                <span className="block">회원가입 후 기업 정보와 진단 조건을 입력하면 의뢰가 등록됩니다.</span>
                <span className="block">등록된 의뢰에 전문가들이 입찰하면, 금액과 정보를 비교해 전문가를 선택하세요.</span>
              </CardDescription>
              <Button asChild className="mt-4 w-fit">
                <Link to="/client/start">의뢰 시작하기</Link>
              </Button>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <ShieldCheck className="mb-3 h-9 w-9 text-blue-600" aria-hidden="true" />
              <CardTitle>전문가라면</CardTitle>
              <CardDescription className="leading-relaxed">
                전문가 인증을 마치면 등록된 의뢰를 확인하고 입찰할 수 있습니다. 입찰 전 아래 원칙을 확인해 주세요.
              </CardDescription>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                {expertPrinciples.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-blue-600">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="mt-4 w-fit">
                <Link to="/signup/expert">전문가 가입하기</Link>
              </Button>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
