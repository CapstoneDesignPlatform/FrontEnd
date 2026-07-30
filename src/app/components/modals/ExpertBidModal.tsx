"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Building2, Phone, Mail, CheckCircle2, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ExpertBidModalProps {
  bid: any | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (bidId: number, amount: number) => void;
  onCancel?: (bidId: number) => void;
  viewOnly?: boolean;
}

export function ExpertBidModal({ bid, isOpen, onClose, onConfirm, onCancel, viewOnly = false }: ExpertBidModalProps) {
  const [confirmAmount, setConfirmAmount] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (isOpen && bid) {
      // 이미 선택된 전문가라면 기존 확정 금액을 표시, 아니면 비움
      setConfirmAmount(bid.isSelected ? bid.confirmedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "");
      setShowConfirmDialog(false);
    }
  }, [isOpen, bid]);

  if (!isOpen || !bid) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setConfirmAmount(value ? Number(value).toLocaleString() : "");
  };

  const rawAmount = Number(confirmAmount.replace(/,/g, ""));
  const isLowerThanProposed = rawAmount > 0 && rawAmount < bid.proposedAmount;
  const isButtonEnabled = rawAmount > 0 && !isLowerThanProposed;

  const handleFinalSubmit = () => {
    onConfirm?.(bid.id, rawAmount);
    toast.success(`${bid.expertName} 전문가로 최종 확정되었습니다.`);
    setShowConfirmDialog(false);
    onClose();
  };

  const handleCancelSelection = () => {
    onCancel?.(bid.id);
    toast.info("전문가 선택이 취소되었습니다.");
    onClose();
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${bid.email}`;
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <Card className="w-full max-w-xl relative animate-in fade-in zoom-in duration-200 shadow-2xl rounded-3xl overflow-hidden border-none bg-white">
          <button onClick={onClose} className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100 z-10"><X className="h-6 w-6 text-gray-400" /></button>

          <CardContent className="p-8">
            {/* 프로필 섹션 */}
            <div className="flex items-start gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-2xl font-bold shrink-0">{bid.expertName.charAt(0)}</div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{bid.expertName}</h2>
                </div>
                <div className="flex flex-wrap gap-y-2 gap-x-6 text-gray-500 text-sm">
                  <div className="flex items-center gap-2"><Building2 className="w-4 h-4" />{bid.companyName}</div>
                  {viewOnly && bid.phone && (
                    <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{bid.phone}</div>
                  )}
                  {viewOnly && bid.email && (
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{bid.email}</div>
                  )}
                </div>
              </div>
            </div>

            {/* 전문가 소개 */}
            <div className={`text-gray-600 leading-relaxed whitespace-pre-wrap ${viewOnly ? "mb-4" : "mb-10"}`}>
              {bid.expertIntro || "등록된 전문가 소개 내용이 없습니다."}
            </div>

            {/* 금액 입력부 — viewOnly 시 숨김 */}
            {!viewOnly && (
              <>
                <div className="space-y-8 mb-10">
                  <div>
                    <p className="text-sm text-gray-400 mb-2 font-medium">제시한 금액</p>
                    <p className="text-3xl font-bold text-slate-800">₩ {bid.proposedAmount.toLocaleString()}</p>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm text-gray-500 font-medium">협의된 최종 금액을 입력해주세요.</label>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <Input type="text" placeholder="숫자만 입력" className={`h-14 bg-gray-50 border-none text-lg px-6 rounded-2xl focus-visible:ring-2 ${isLowerThanProposed ? 'ring-2 ring-red-500' : 'focus-visible:ring-blue-500'}`} value={confirmAmount} onChange={handleAmountChange} />
                      </div>
                      <span className="text-xl font-bold text-slate-700">원</span>
                    </div>
                    {isLowerThanProposed && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" /> 전문가 제시액 이상 입력해야 합니다.</p>}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {bid.isSelected && (
                    <Button
                      variant="outline"
                      className="flex-1 h-14 rounded-2xl text-lg font-bold border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={handleCancelSelection}
                    >
                      취소하기
                    </Button>
                  )}
                  <Button
                    className={`flex-[2] h-14 rounded-2xl text-lg font-bold shadow-sm transition-all ${
                      isButtonEnabled ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white text-gray-400 border border-gray-200"
                    }`}
                    disabled={!isButtonEnabled}
                    onClick={() => setShowConfirmDialog(true)}
                  >
                    {bid.isSelected ? "가격 수정하기" : "최종 선택"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 2차 확인 모달 */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
          <Card className="w-full max-w-xs rounded-2xl border-none shadow-xl bg-white p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{bid.isSelected ? "가격을 수정하시겠습니까?" : "최종 선택 하시겠습니까?"}</h3>
            <p className="text-sm text-gray-500 mb-6">결제 전까지 가격 수정 및 취소가 가능합니다.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowConfirmDialog(false)}>취소</Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl" onClick={handleFinalSubmit}>확인</Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}