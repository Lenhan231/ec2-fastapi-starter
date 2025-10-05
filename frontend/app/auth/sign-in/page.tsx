import Link from "next/link";

export const metadata = {
  title: "Đăng nhập | Easy Body"
};

export default function SignInPage() {
  return (
    <div style={{ maxWidth: "420px", margin: "3rem auto", padding: "2.5rem", background: "var(--surface)", borderRadius: "var(--radius-lg)", boxShadow: "0 24px 60px rgba(15,23,42,0.12)", display: "grid", gap: "1rem" }}>
      <h1 style={{ margin: 0, textAlign: "center" }}>Đăng nhập</h1>
      <p style={{ textAlign: "center", color: "#475569", marginBottom: "0.5rem" }}>
        Đăng nhập bằng email để quản lý Gym, PT và bookmark của bạn.
      </p>
      <label style={{ display: "grid", gap: "0.35rem" }}>
        Email
        <input type="email" placeholder="you@example.com" style={{ borderRadius: 12, border: "1px solid var(--border)", padding: "0.65rem 0.75rem" }} />
      </label>
      <label style={{ display: "grid", gap: "0.35rem" }}>
        Mật khẩu
        <input type="password" placeholder="••••••••" style={{ borderRadius: 12, border: "1px solid var(--border)", padding: "0.65rem 0.75rem" }} />
      </label>
      <button className="cta-button" style={{ width: "100%", justifyContent: "center" }}>
        Đăng nhập
      </button>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--muted)" }}>
        <Link href="/auth/forgot-password">Quên mật khẩu?</Link>
        <Link href="/auth/sign-up">Chưa có tài khoản?</Link>
      </div>
    </div>
  );
}
