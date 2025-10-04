"use client";

import { useState } from "react";

import OfferFilterBar from "../../../components/OfferFilterBar";
import EmptyState from "../../../components/EmptyState";

const initialProfile = {
  name: "Coach Linh",
  bio: "6 năm kinh nghiệm body recomposition & strength.",
  certifications: "NASM CPT, Precision Nutrition Level 1",
  availability: "Thứ 2-6 | 6h-9h & 17h-21h",
  gyms: ["Future Fitness", "Beast Mode"]
};

function ManagePTPage() {
  const [profile, setProfile] = useState(initialProfile);
  const [offers] = useState([
    { id: 201, title: "Combo 10 buổi PT cá nhân", status: "approved" },
    { id: 202, title: "Buổi trải nghiệm 199k", status: "pending" }
  ]);

  return (
    <div style={{ marginTop: "2rem", marginBottom: "3rem", display: "grid", gap: "1.5rem" }}>
      <header>
        <div className="badge">PT dashboard</div>
        <h1 className="page-title">Quản lý profile & ưu đãi PT</h1>
        <p style={{ color: "#475569", maxWidth: "640px" }}>
          Cập nhật thông tin cá nhân, lịch rảnh và gợi ý phòng gym đang cộng tác. Tạo ưu đãi mới để thu hút học viên.
        </p>
      </header>

      <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Thông tin cá nhân</h2>
        <label>
          Tên hiển thị
          <input
            value={profile.name}
            onChange={(event) => setProfile({ ...profile, name: event.target.value })}
            style={{ width: "100%", marginTop: "0.35rem", borderRadius: 12, border: "1px solid #e2e8f0", padding: "0.55rem 0.75rem" }}
          />
        </label>
        <label>
          Bio
          <textarea
            value={profile.bio}
            onChange={(event) => setProfile({ ...profile, bio: event.target.value })}
            rows={3}
            style={{ borderRadius: 12, border: "1px solid #e2e8f0", padding: "0.55rem 0.75rem" }}
          />
        </label>
        <label>
          Chứng chỉ
          <textarea
            value={profile.certifications}
            onChange={(event) => setProfile({ ...profile, certifications: event.target.value })}
            rows={2}
            style={{ borderRadius: 12, border: "1px solid #e2e8f0", padding: "0.55rem 0.75rem" }}
          />
        </label>
        <label>
          Khung giờ rảnh
          <input
            value={profile.availability}
            onChange={(event) => setProfile({ ...profile, availability: event.target.value })}
            style={{ width: "100%", marginTop: "0.35rem", borderRadius: 12, border: "1px solid #e2e8f0", padding: "0.55rem 0.75rem" }}
          />
        </label>
        <label>
          Phòng gym cộng tác
          <input
            value={profile.gyms.join(", ")}
            onChange={(event) => setProfile({ ...profile, gyms: event.target.value.split(", ").filter(Boolean) })}
            style={{ width: "100%", marginTop: "0.35rem", borderRadius: 12, border: "1px solid #e2e8f0", padding: "0.55rem 0.75rem" }}
          />
        </label>
        <button className="cta-button" style={{ width: "fit-content", marginTop: "0.5rem" }}>
          Lưu cập nhật
        </button>
      </section>

      <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Tạo ưu đãi PT</h2>
        <OfferFilterBar variant="pt" />
        <p style={{ color: "var(--muted)", margin: 0 }}>
          Quy tắc: Tiêu đề ≤ 80 ký tự, bắt buộc chọn phòng gym liên kết, valid_from &lt; valid_to, ảnh chuẩn 4:3 hoặc 1:1.
        </p>
        <button className="cta-button" style={{ width: "fit-content" }}>
          Mở wizard tạo ưu đãi
        </button>
      </section>

      <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Ưu đãi của tôi</h2>
        {offers.length === 0 ? (
          <EmptyState
            title="Bạn chưa có ưu đãi"
            description="Tạo offer đầu tiên để dễ dàng tiếp cận học viên mới."
          />
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.65rem" }}>
            {offers.map((offer) => (
              <li key={offer.id} style={{ display: "flex", justify-content: "space-between", alignItems: "center" }}>
                <span>{offer.title}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: offer.status === "approved" ? "#10b981" : "#f97316" }}>
                  {offer.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default ManagePTPage;
