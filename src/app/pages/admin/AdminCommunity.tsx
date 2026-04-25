import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { MessageSquare } from "lucide-react";

export function AdminCommunity() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">커뮤니티 관리</h1>
        <p className="text-gray-600">커뮤니티 게시글 및 댓글을 관리합니다.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            커뮤니티
          </CardTitle>
          <CardDescription>
            이 기능은 추후 개발 예정입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>커뮤니티 관리 기능은 곧 출시됩니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
