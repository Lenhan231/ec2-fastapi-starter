"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function resolveErrorMessage(detail: unknown): string | null {
  if (!detail) {
    return null;
  }

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    const first = detail[0];

    if (typeof first === "string") {
      return first;
    }

    if (first && typeof first === "object") {
      if ("msg" in first && typeof first.msg === "string") {
        return first.msg;
      }

      if ("message" in first && typeof first.message === "string") {
        return first.message;
      }
    }

    return JSON.stringify(detail);
  }

  if (typeof detail === "object") {
    if ("message" in detail && typeof detail.message === "string") {
      return detail.message;
    }

    if ("detail" in detail && typeof detail.detail === "string") {
      return detail.detail;
    }

    return JSON.stringify(detail);
  }

  return String(detail);
}

export default function SignUpForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      full_name: String(form.get("full_name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      password: String(form.get("password") || ""),
      role: String(form.get("role") || "CLIENT"),
    };

    if (!payload.full_name || !payload.email.includes("@") || payload.password.length < 6) {
      setErr("Thông tin chưa hợp lệ (email hợp lệ, mật khẩu ≥ 6 ký tự).");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const detailMessage = resolveErrorMessage(data?.detail);
        throw new Error(detailMessage || `Đăng ký thất bại (HTTP ${res.status})`);
      }

      router.push("/auth/sign-in?registered=1");
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : typeof error === "string"
          ? error
          : "Có lỗi xảy ra, thử lại sau.";
      setErr(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "3rem auto",
        padding: "2.5rem",
        background: "var(--surface)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "0 24px 60px rgba(15,23,42,0.12)",
        display: "grid",
        gap: "1rem",
      }}
    >
      <h1 style={{ margin: 0, textAlign: "center" }}>Tạo tài khoản</h1>
      <p style={{ textAlign: "center", color: "#475569", marginBottom: "0.5rem" }}>
        Chọn vai trò phù hợp để quản lý ưu đãi, phòng gym hoặc trải nghiệm PT.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <label style={{ display: "grid", gap: "0.35rem" }}>
          Họ và tên
          <input
            name="full_name"
            type="text"
            placeholder="Nguyễn Văn A"
            style={{ borderRadius: 12, border: "1px solid var(--border)", padding: "0.65rem 0.75rem" }}
            required
          />
        </label>

        <label style={{ display: "grid", gap: "0.35rem" }}>
          Email
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            style={{ borderRadius: 12, border: "1px solid var(--border)", padding: "0.65rem 0.75rem" }}
            required
          />
        </label>

        <label style={{ display: "grid", gap: "0.35rem" }}>
          Mật khẩu
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            style={{ borderRadius: 12, border: "1px solid var(--border)", padding: "0.65rem 0.75rem" }}
            minLength={6}
            required
          />
        </label>

        <label style={{ display: "grid", gap: "0.35rem" }}>
          Vai trò
          <select
            name="role"
            defaultValue="CLIENT"
            style={{ borderRadius: 12, border: "1px solid var(--border)", padding: "0.65rem 0.75rem" }}
          >
            <option value="CLIENT">Client</option>
            <option value="PT">PT</option>
            <option value="GYM_STAFF">Gym Staff</option>
          </select>
        </label>

        {err && (
          <div style={{ color: "#b91c1c", fontSize: ".9rem" }}>
            {err}
          </div>
        )}

        <button
          className="cta-button"
          type="submit"
          disabled={loading}
          style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--muted)" }}>
        Đã có tài khoản? <Link href="/auth/sign-in">Đăng nhập</Link>
      </p>
    </div>
  );
}
