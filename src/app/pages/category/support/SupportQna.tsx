import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import { Checkbox } from "../../../components/ui/checkbox";
import { ChevronDown, ChevronUp, Lock, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

interface QnaItem {
  id: number;
  author: string;
  title: string;
  content: string;
  date: string;
  status: "answered" | "pending";
  answer: string | null;
  answeredAt: string | null;
  isSecret: boolean;
}

// 현재 로그인한 사용자 (실제 구현 시 auth context로 교체)
const CURRENT_USER = "나";

const MOCK_QNA: QnaItem[] = [
  {
    id: 1,
    author: "김**",
    title: "면허 취득 기간이 얼마나 걸리나요?",
    content: "안녕하세요, 건설업 면허 취득을 위해 의뢰를 등록했는데 대략 얼마나 걸리는지 궁금합니다.",
    date: "2026-05-10",
    status: "answered",
    answer: "안녕하세요! 일반적으로 서류 준비 완료 후 약 2~4주 소요됩니다. 업종과 지역에 따라 달라질 수 있으며, 전문가가 배정되면 더 정확한 일정을 안내드립니다.",
    answeredAt: "2026-05-11",
    isSecret: false,
  },
  {
    id: 2,
    author: "이**",
    title: "비용 산정 기준이 궁금합니다.",
    content: "전문가별로 제시하는 금액이 다른데 어떤 기준으로 산정되는 건가요?",
    date: "2026-05-15",
    status: "pending",
    answer: null,
    answeredAt: null,
    isSecret: true,
  },
  {
    id: 3,
    author: "박**",
    title: "전문가 변경이 가능한가요?",
    content: "전문가를 선택했는데 마감 전에 다른 전문가로 변경하고 싶습니다. 가능한가요?",
    date: "2026-05-17",
    status: "answered",
    answer: "네, 마감(진단 시작) 단계 이전까지는 전문가 변경이 가능합니다. 마이페이지에서 기존 선택을 취소하신 후 다시 선택해 주세요.",
    answeredAt: "2026-05-17",
    isSecret: false,
  },
];

export function SupportQna() {
  const [qnaList, setQnaList] = useState<QnaItem[]>(MOCK_QNA);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", content: "", isSecret: false });
  const [showForm, setShowForm] = useState(false);

  const canView = (item: QnaItem) => !item.isSecret || item.author === CURRENT_USER;

  const handleRowClick = (item: QnaItem) => {
    if (!canView(item)) {
      toast.error("비밀글은 작성자만 확인할 수 있습니다.");
      return;
    }
    setExpandedId(expandedId === item.id ? null : item.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: QnaItem = {
      id: qnaList.length + 1,
      author: CURRENT_USER,
      title: form.title,
      content: form.content,
      date: new Date().toISOString().slice(0, 10),
      status: "pending",
      answer: null,
      answeredAt: null,
      isSecret: form.isSecret,
    };
    setQnaList([newItem, ...qnaList]);
    setForm({ title: "", content: "", isSecret: false });
    setShowForm(false);
    toast.success("문의가 정상적으로 접수되었습니다. 영업일 기준 1~2일 내 답변드립니다.");
  };

  return (
    <div className="relative mb-6 container mx-auto px-4 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-2">Q&A</h1>
          <p className="text-gray-500 my-4">궁금하신 점을 남겨주시면 담당자가 답변드립니다.</p>
        </div>
        <Button
          className="bg-[#34499C] hover:bg-[#2a3d84] gap-2"
          onClick={() => setShowForm(!showForm)}
        >
          <MessageCircle className="w-4 h-4" />
          문의하기
        </Button>
      </div>

      {/* 문의 작성 폼 */}
      {showForm && (
        <Card className="border border-[#34499C]/20 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <CardHeader className="border-b bg-[#34499C]/5">
            <CardTitle className="text-base text-[#34499C]">1:1 문의 작성</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>제목</Label>
                <Input
                  placeholder="문의 제목을 입력해주세요"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="h-12 bg-gray-50 border-none rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>문의 내용</Label>
                <Textarea
                  placeholder="문의 내용을 상세히 입력해주세요"
                  rows={5}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required
                  className="bg-gray-50 border-none rounded-xl resize-none"
                />
              </div>

              {/* 비밀글 체크박스 */}
              <div className="flex items-center gap-2 pt-1">
                <Checkbox
                  id="isSecret"
                  checked={form.isSecret}
                  onCheckedChange={(checked) => setForm({ ...form, isSecret: !!checked })}
                />
                <label htmlFor="isSecret" className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer select-none">
                  <Lock className="w-3.5 h-3.5" />
                  비밀글로 등록
                </label>
              </div>

              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>취소</Button>
                <Button type="submit" className="bg-[#34499C] hover:bg-[#2a3d84] gap-2">
                  <Send className="w-4 h-4" /> 제출하기
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Q&A 목록 */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b">
          <div className="flex items-center justify-between">
            <CardTitle>문의 내역</CardTitle>
            <span className="text-sm text-gray-400">총 {qnaList.length}건</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {qnaList.map((item) => {
            const viewable = canView(item);
            const isExpanded = expandedId === item.id;

            return (
              <div key={item.id} className="border-b last:border-0">
                {/* 질문 헤더 행 */}
                <button
                  className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors"
                  onClick={() => handleRowClick(item)}
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      className={item.status === "answered"
                        ? "bg-[#34499C] text-white shrink-0"
                        : "bg-gray-200 text-gray-600 shrink-0"}
                    >
                      {item.status === "answered" ? "답변완료" : "대기중"}
                    </Badge>

                    {/* 비밀글 자물쇠 아이콘 */}
                    {item.isSecret && (
                      <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    )}

                    <span className={`flex-1 text-sm truncate ${viewable ? "font-medium text-gray-900" : "text-gray-400 italic"}`}>
                      {viewable ? item.title : "비밀글입니다."}
                    </span>

                    <span className="text-xs text-gray-400 shrink-0">{item.author} · {item.date}</span>
                    {viewable && (
                      isExpanded
                        ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </div>
                </button>

                {/* 펼쳐진 상세 내용 */}
                {isExpanded && viewable && (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="px-6 py-4 bg-gray-50 border-t">
                      <p className="text-xs font-semibold text-gray-400 mb-2">Q. 질문</p>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                    </div>
                    {item.answer ? (
                      <div className="px-6 py-4 bg-[#34499C]/5 border-t border-[#34499C]/10">
                        <p className="text-xs font-semibold text-[#34499C] mb-2">A. 답변 · {item.answeredAt}</p>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{item.answer}</p>
                      </div>
                    ) : (
                      <div className="px-6 py-4 bg-amber-50 border-t border-amber-100">
                        <p className="text-sm text-amber-700">답변 준비 중입니다. 영업일 기준 1~2일 내 답변드립니다.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
