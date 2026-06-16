import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
  Trash2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";

const mockPosts = [
  {
    id: 1,
    category: "자유게시판",
    title: "건설 의뢰 진행 시 주의사항 공유합니다",
    author: "김철수",
    date: "2026-05-06",
    views: 234,
    comments: 12,
    likes: 45,
    content: `최근 의뢰를 진행하면서 겪은 경험을 공유합니다.

건설 의뢰를 진행할 때 가장 중요한 것은 철저한 사전 준비입니다. 특히 다음 사항들을 주의해야 합니다:

1. 계약서 검토
- 모든 조항을 꼼꼼히 확인하세요
- 불명확한 부분은 반드시 문의하고 명확히 하세요
- 특히 추가 비용 발생 조건을 잘 확인해야 합니다

2. 일정 관리
- 여유있는 일정 계획을 세우세요
- 날씨, 자재 수급 등 변수를 고려하세요
- 정기적인 진행상황 점검이 중요합니다

3. 의사소통
- 발주처와 원활한 소통을 유지하세요
- 문제 발생 시 즉시 보고하세요
- 모든 중요한 내용은 문서로 남기세요
이러한 점들을 잘 지키면 성공적인 의뢰 진행이 가능합니다. 다들 좋은 결과 있으시길 바랍니다!`,
  },
  {
    id: 2,
    category: "Q&A",
    title: "전기공사 견적 산정 방법 문의드립니다",
    author: "이영희",
    date: "2026-05-05",
    views: 189,
    comments: 8,
    likes: 23,
    content:
      "전기공사 견적을 처음 작성하는데 어떤 기준으로 산정해야 할지 문의드립니다. 경험 있으신 분들의 조언 부탁드립니다.",
  },
];

const initialComments = [
  {
    id: 1,
    author: "박민수",
    date: "2026-05-06",
    content:
      "좋은 정보 감사합니다! 특히 계약서 검토 부분이 도움이 많이 되었습니다.",
    isAdmin: false,
  },
  {
    id: 2,
    author: "최지은",
    date: "2026-05-06",
    content:
      "일정 관리 팁 유용하네요. 저도 최근에 날씨 때문에 일정이 밀린 적이 있어서 공감됩니다.",
    isAdmin: false,
  },
  {
    id: 3,
    author: "정우진",
    date: "2026-05-06",
    content: "문서화의 중요성을 다시 한번 느낍니다. 좋은 글 감사합니다!",
    isAdmin: false,
  },
];

export function AdminCommunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [deleted, setDeleted] = useState(false);

  const post = mockPosts.find((p) => p.id === Number(id));

  if (!post || deleted) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/admin/community">
            <ArrowLeft className="h-4 w-4 mr-1" />
            목록으로
          </Link>
        </Button>
        <p className="text-center text-gray-500 py-12">
          {deleted ? "게시글이 삭제되었습니다." : "게시글을 찾을 수 없습니다."}
        </p>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    자유게시판: "bg-blue-100 text-blue-700",
    "Q&A": "bg-green-100 text-green-700",
    정보공유: "bg-purple-100 text-purple-700",
  };

  const handlePostDelete = () => {
    if (confirm("이 게시글을 삭제하시겠습니까?")) {
      setDeleted(true);
    }
  };

  const handleCommentDelete = (commentId: number) => {
    if (confirm("이 댓글을 삭제하시겠습니까?")) {
      setComments(comments.filter((c) => c.id !== commentId));
    }
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          author: "관리자",
          date: new Date().toISOString().slice(0, 10),
          content: comment,
          isAdmin: true,
        },
      ]);
      setComment("");
    }
  };

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/admin/community">
          <ArrowLeft className="h-4 w-4 mr-1" />
          목록으로
        </Link>
      </Button>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <Badge className={categoryColors[post.category]}>
            {post.category}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handlePostDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            게시글 삭제
          </Button>
        </div>

        <h1 className="mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {post.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.views}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {post.comments}
          </span>
        </div>

        <div className="prose max-w-none mb-6">
          <p className="whitespace-pre-wrap text-gray-700">{post.content}</p>
        </div>

        <div className="flex items-center gap-2 pt-6 border-t">
          <Button
            variant={liked ? "default" : "outline"}
            onClick={() => setLiked(!liked)}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            좋아요 {liked ? post.likes + 1 : post.likes}
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            공유하기
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4">댓글 {comments.length}</h2>

        <div className="space-y-4 mb-6">
          {comments.map((c) => (
            <div key={c.id} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center gap-2 mb-2 justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-sm">
                    <User className="h-4 w-4" />
                    {c.author}
                  </span>
                  {c.isAdmin && (
                    <Badge className="bg-teal-100 text-teal-700 text-xs">
                      관리자
                    </Badge>
                  )}
                  <span className="text-sm text-gray-500">{c.date}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 px-2"
                  onClick={() => handleCommentDelete(c.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-gray-700">{c.content}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <Textarea
            placeholder="댓글을 입력하세요..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button onClick={handleCommentSubmit}>댓글 작성</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
