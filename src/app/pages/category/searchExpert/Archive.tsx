import { useState } from "react";
import { FileText, Download, Calendar, Search } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

const mockArchive = [
  { id: 1, title: "건설업 입찰 가이드북 2026", category: "입찰가이드", size: "2.5MB", downloads: 1234, date: "2026-04-30" },
  { id: 2, title: "전기공사업 표준 계약서 양식", category: "계약서", size: "1.8MB", downloads: 856, date: "2026-04-25" },
];

export function Archive() {
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = mockArchive.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">자료실</h1>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input className="pl-10" placeholder="자료 검색..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="space-y-4">
          {filtered.map((item) => (
            <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <FileText className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="mb-2 font-semibold">{item.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <Badge variant="secondary">{item.category}</Badge>
                      <span>{item.size}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" /> 다운로드</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}