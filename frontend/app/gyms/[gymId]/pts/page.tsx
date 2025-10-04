import PTCard from "../../../../components/PTCard";
import EmptyState from "../../../../components/EmptyState";
import { api } from "../../../../lib/api";

interface PageProps {
  params: { gymId: string };
}

export default async function GymPTListingPage({ params }: PageProps) {
  const gymId = Number(params.gymId);
  const pts = await api.listPTs({ gym_id: gymId });

  return (
    <div style={{ marginTop: "2rem", marginBottom: "3rem" }}>
      <div className="badge">PT cộng tác</div>
      <h1 className="page-title">Huấn luyện viên tại phòng gym #{gymId}</h1>
      <p style={{ color: "#475569", maxWidth: "640px", marginBottom: "1.5rem" }}>
        Danh sách PT đã được Gym Staff xác thực. Bạn có thể chọn PT phù hợp với lịch và mục tiêu cá nhân.
      </p>

      {pts.length === 0 ? (
        <EmptyState
          title="Chưa có PT nào"
          description="Hãy quay lại sau để xem danh sách PT mới nhất."
        />
      ) : (
        <div className="card-grid">
          {pts.map((pt) => (
            <PTCard key={pt.id} profile={pt} />
          ))}
        </div>
      )}
    </div>
  );
}
