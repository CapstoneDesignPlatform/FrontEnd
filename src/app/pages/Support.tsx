"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../components/ui/accordion";
import { Badge } from "../components/ui/badge";
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  MapPin,
  HelpCircle,
  Send,
  Headphones
} from "lucide-react";
import { toast } from "sonner";

export function Support() {
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInquiryForm({ ...inquiryForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("문의가 정상적으로 접수되었습니다.");
    setInquiryForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    // container와 max-w-6xl로 좌우 여백을 충분히 주었습니다.
    <div className="container mx-auto max-w-6xl px-4 py-12 space-y-12">
      
      {/* 헤더 섹션 */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">고객센터</h1>
        <p className="text-lg text-gray-600">
          서비스 이용 중 궁금하신 점이 있으신가요? <br className="hidden md:block" />
          가장 빠른 답변을 드릴 수 있도록 준비하겠습니다.
        </p>
      </div>

      {/* 빠른 연락처 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Phone />, label: "전화 문의", value: "1588-1234" },
          { icon: <Mail />, label: "이메일 문의", value: "support@pro.com" },
          { icon: <MessageCircle />, label: "카카오톡", value: "@세움진단" },
          { icon: <Clock />, label: "상담 시간", value: "평일 09:00-18:00" },
        ].map((item, i) => (
          <Card key={i} className="border-none bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-teal-50 mx-auto flex items-center justify-center text-teal-600">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{item.label}</h3>
                <p className="font-bold text-gray-800">{item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 메인 탭 섹션 */}
      <Tabs defaultValue="faq" className="w-full">
        {/* 탭 리스트: max-w 제거하여 하단 카드들과 넓이를 동일하게 맞췄습니다. */}
        <TabsList className="grid w-full grid-cols-2 h-14 bg-gray-100 p-1.5 rounded-2xl mb-8">
          <TabsTrigger 
            value="faq" 
            className="rounded-xl text-base font-medium data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm"
          >
            <HelpCircle className="h-5 w-5 mr-2" />
            자주 묻는 질문
          </TabsTrigger>
          <TabsTrigger 
            value="inquiry" 
            className="rounded-xl text-base font-medium data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            1:1 문의하기
          </TabsTrigger>
        </TabsList>

        {/* 탭 1: FAQ */}
        <TabsContent value="faq" className="space-y-6 animate-in fade-in-50 duration-500">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b">
              <CardTitle>자주 묻는 질문 (FAQ)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {[
                  { q: "전문가 매칭은 얼마나 걸리나요?", a: "보통 의뢰 등록 후 24시간 이내에 첫 입찰이 들어옵니다." },
                  { q: "결제는 안전하게 진행되나요?", a: "네, 에스크로 시스템을 통해 작업이 완료될 때까지 대금을 안전하게 보호합니다." },
                  { q: "수수료 정책이 궁금합니다.", a: "의뢰 등록은 무료이며, 최종 계약 시에만 일정 수수료가 발생합니다." },
                ].map((faq, i) => (
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
        </TabsContent>

        {/* 탭 2: 1:1 문의하기 */}
        <TabsContent value="inquiry" className="animate-in fade-in-50 duration-500">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 문의 폼 */}
            <div className="lg:col-span-2">
              <Card className="border-none shadow-sm">
                <CardHeader className="border-b bg-white">
                  <CardTitle>1:1 문의 작성</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>성함</Label>
                        <Input name="name" value={inquiryForm.name} onChange={handleChange} required className="h-12 bg-gray-50 border-none rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>연락처</Label>
                        <Input name="phone" value={inquiryForm.phone} onChange={handleChange} required className="h-12 bg-gray-50 border-none rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>제목</Label>
                      <Input name="subject" value={inquiryForm.subject} onChange={handleChange} required className="h-12 bg-gray-50 border-none rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>문의 내용</Label>
                      <Textarea name="message" rows={6} value={inquiryForm.message} onChange={handleChange} required className="bg-gray-50 border-none rounded-xl resize-none" />
                    </div>
                    <Button type="submit" className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-lg font-bold rounded-2xl shadow-lg shadow-teal-100 transition-all">
                      <Send className="mr-2 h-5 w-5" />
                      문의 내용 제출하기
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* 안내 정보 */}
            <div className="space-y-6">
              <Card className="border-none shadow-sm bg-slate-800 text-white rounded-3xl">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <Headphones className="h-6 w-6 text-teal-400" />
                    <h3 className="text-xl font-bold">고객센터 연결</h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold">1588-1234</p>
                    <p className="text-sm text-slate-400">평일 09:00 ~ 18:00 (주말/공휴일 휴무)</p>
                  </div>
                  <div className="pt-4 border-t border-slate-700 text-sm text-slate-300 leading-relaxed">
                    전화 연결이 어려운 경우 1:1 문의를 남겨주시면 <br />
                    담당자가 확인 후 순차적으로 연락 드립니다.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}