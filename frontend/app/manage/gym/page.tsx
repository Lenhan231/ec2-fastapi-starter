"use client";

import { useState } from "react";

import OfferFilterBar from "../../../components/OfferFilterBar";
import EmptyState from "../../../components/EmptyState";

const initialForm = {
  name: "Future Fitness District 1",
  phone: "0909 123 456",
  email: "contact@futurefit.vn",
  subscriptionMin: 690000,
  subscriptionMax: 1590000,
  amenities: "Sauna, Boxing, Parking"
};

function ManageGymPage() {
  const [form, setForm] = useState(initialForm);
  const [offers] = useState([
    { id: 101, title: "Miễn phí 7 ngày trải nghiệm", status: "approved" },
    { id: 102, title: "Combo 3 tháng -25%", status: "pending" }
  ]);
  const [pendingPT, setPendingPT] = useState([
    { id: 31, name: "Coach Linh", submittedAt: "2024-03-21" }
  ]);

  return (
    <div style={{ marginTop: "2rem", marginBottom: "3rem", display: "grid", gap: "1.5rem" }}>
      <header>
        <div className="badge">Gym Staff dashboard</div>
        <h1 className="page-title">Quản lý phòng gym & ưu đãi</h1>
        <p style={{ color: "#475569", maxWidth: "640px" }}>
          Cập nhật thông tin phòng gym, tạo ưu đãi mới và duyệt request từ PT. Toàn bộ ưu đãi sẽ đi qua pipeline moderation sau khi bạn submit.
        </p>
      </header>

      <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Thông tin phòng gym</h2>
        <label>
          Tên phòng gym
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            style={{ width: "100%", marginTop: "0.35rem", borderRadius: 12, border: "1px solid #e2e8f0", padding: "0.55rem 0.75rem" }}
          />
        </label>
        <label>
          Email liên hệ
          <input
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            style={{ width: "100%", marginTop: "0.35rem", borderRadius: 12, border: "1px solid #e2e8f0", padding: "0.55rem 0.75rem" }}
          />
        </label>
        <label>
          Khoảng giá subscription (VNĐ)
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "0.5rem", alignItems: "center" }}>
            <input
              type="number"
              value={form.subscriptionMin}
              onChange={(event) => setForm({ ...form, subscriptionMin: Number(event.target.value) })}
              style={{ borderRadius: 12, border: "1px solid #e2e8f0", padding: "0.55rem 0.75rem" }}
            />
            <span>→</span>
            <input
              type="number"
              value={form.subscriptionMax}
              onChange={(event) => setForm({ ...form, subscriptionMax: Number(event.target.value) })}
              style={{ borderRadius: 12, border: "1px solid #e2e8f0", padding: "0.55rem 0.75rem" }}
            />
          </div>
        </label>
        <label>
          Tiện ích
          <textarea
            value={form.amenities}
            onChange={(event) => setForm({ ...form, amenities: event.target.value })}
            rows={3}
            style={{ borderRadius: 12, border: "1px solid #e2e8f0", padding: "0.55rem 0.75rem" }}
          />
        </label>
        <button className="cta-button" style={{ justifyContent: "center", marginTop: "0.5rem", width: "fit-content" }}>
          Lưu thay đổi
        </button>
      </section>

      <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Tạo ưu đãi mới</h2>
        <OfferFilterBar variant="gym" />
        <button className="cta-button" style={{ width: "fit-content" }}>
          Bắt đầu wizard
        </button>
      </section>

      <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>Ưu đãi của gym</h2>
        {offers.length === 0 ? (
          <EmptyState
            title="Chưa có ưu đãi"
            description="Tạo ưu đãi đầu tiên để tăng tỷ lệ hiển thị và giữ chân khách hàng."
          />
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.65rem" }}>
            {offers.map((offer) => {
              const statusColor = offer.status === "approved" ? "#10b981" : "#f97316";
              return (
                <li key={offer.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{offer.title}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: statusColor }}>
                    {offer.status}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
        <h2 style={{ margin: 0 }}>PT chờ duyệt</h2>
        {pendingPT.length === 0 ? (
          <EmptyState
            title="Không có PT nào"
            description="PT mới sẽ xuất hiện tại đây khi họ xin liên kết với phòng gym của bạn."
          />
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.65rem" }}>
            {pendingPT.map((pt) => (
              <li key={pt.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>
                  {`${pt.name} - nộp ${pt.submittedAt}`}
                </span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="cta-button" style={{ background: "#22c55e" }} onClick={() => setPendingPT((current) => current.filter((item) => item.id !== pt.id))}>
                    Duyệt
                  </button>
                  <button className="cta-button" style={{ background: "#ef4444" }} onClick={() => setPendingPT((current) => current.filter((item) => item.id !== pt.id))}>
                    Từ chối
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default ManageGymPage;
