import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

const FAQ_ITEMS = [
  { q: "전문가 매칭은 얼마나 걸리나요?", a: "보통 의뢰 등록 후 24시간 이내에 첫 입찰이 들어옵니다." },
  { q: "결제는 안전하게 진행되나요?", a: "네, 에스크로 시스템을 통해 작업이 완료될 때까지 대금을 안전하게 보호합니다." },
  { q: "수수료 정책이 궁금합니다.", a: "의뢰 등록은 무료이며, 최종 계약 시에만 일정 수수료가 발생합니다." },
  { q: "면허 취득 기간은 얼마나 걸리나요?", a: "서류 준비 완료 후 일반적으로 2~4주 소요됩니다. 업종과 조건에 따라 달라질 수 있습니다." },
  { q: "전문가를 선택한 후 변경할 수 있나요?", a: "진단 시작 단계 이전에는 전문가 변경이 가능합니다. 마감 후에는 고객센터로 문의해주세요." },
  { q: "의뢰를 취소하고 싶습니다.", a: "마이페이지에서 의뢰 취소가 가능합니다. 단, 진행 단계에 따라 취소 정책이 다를 수 있습니다." },
];

export function SupportFaq() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">자주하는 질문</h1>
      </div>

      <Card className="relative mb-6 container mx-auto px-4 max-w-6xl">
        <CardHeader className="bg-white border-b">
          <CardTitle>FAQ</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="px-6 border-b last:border-0">
                <AccordionTrigger className="py-5 hover:no-underline font-medium text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-6 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
