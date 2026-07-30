import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Lock } from "lucide-react";

export function AdminLogin() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ adminId: 11, password }),
      });
      if (response.ok) {
        const data = await response.json();
        import("js-cookie").then((Cookies) => {
          Cookies.default.set("ACCESS_TOKEN", data.data.accessToken, {
            path: "/",
          });
        });
        sessionStorage.setItem("admin-auth", "true");
        navigate("/admin/projects");
      } else {
        setError(true);
        setShake(true);
        setPassword("");
        setTimeout(() => setShake(false), 500);
      }
    } catch {
      setError(true);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">진단매치</span>
          </div>
          <p className="text-sm text-gray-500">관리자 전용 접속</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mx-auto mb-6">
            <Lock className="h-5 w-5 text-blue-600" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secret Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="비밀번호를 입력하세요"
                className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all
                  ${error ? "border-red-400 bg-red-50" : "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"}
                  ${shake ? "animate-pulse" : ""}`}
                autoFocus
              />
              {error && (
                <p className="text-xs text-red-500 mt-1">
                  비밀번호가 올바르지 않습니다.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              접속
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
