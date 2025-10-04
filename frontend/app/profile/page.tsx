import Link from "next/link";

import BookmarkList from "../../components/BookmarkList";
import EmptyState from "../../components/EmptyState";
import ReviewList from "../../components/ReviewList";
import { api } from "../../lib/api";

export const revalidate = 0;

const roleLabels: Record<string, string> = {
  CLIENT: "Client",
  PT: "Huấn luyện viên",
  GYM_STAFF: "Gym Staff",
  ADMIN: "Admin"
};

export default async function ProfilePage() {
  const profile = await api.getProfile();

  if (!profile) {
    return (
      <EmptyState
        title="Bạn chưa đăng nhập"
        description="Đăng nhập để quản lý bookmark, đánh giá và ưu đãi của bạn."
        actionLabel="Đăng nhập"
        actionHref="/auth/sign-in"
      />
    );
  }

  const role = roleLabels[profile.role] ?? profile.role;

  const roleAction = (() => {
    switch (profile.role) {
      case "GYM_STAFF":
        return (
          <Link href="/manage/gym" className="cta-button">
            Vào dashboard Gym
          </Link>
        );
      case "PT":
        return (
          <Link href="/manage/pt" className="cta-button">
            Quản lý PT Offer
          </Link>
        );
      case "ADMIN":
        return (
          <Link href="/moderation" className="cta-button">
            Moderation queue
          </Link>
        );
      default:
        return null;
    }
  })();

  return (
    <div style={{ marginTop: "2rem", marginBottom: "3rem", display: "grid", gap: "1.5rem" }}>
      <section className="profile-card">
        <h1 style={{ margin: 0 }}>{profile.name}</h1>
        <p style={{ margin: 0, color: "#475569" }}>{profile.email}</p>
        <span className="badge">Vai trò: {role}</span>
        {roleAction}
      </section>

      <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Bookmark của bạn</h2>
        <BookmarkList bookmarks={profile.bookmarks} />
      </section>

      <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Đánh giá đã viết</h2>
        <ReviewList reviews={profile.reviews ?? []} />
      </section>
    </div>
  );
}
