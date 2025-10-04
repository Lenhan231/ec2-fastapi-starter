import styles from "./PTCard.module.css";
import type { PTProfile } from "../types";

interface Props {
  profile: PTProfile;
}

function PTCard({ profile }: Props) {
  return (
    <article className={`card ${styles.wrapper}`}>
      <div className={styles.avatar} aria-hidden>
        {profile.avatar ?? profile.name?.slice(0, 1)?.toUpperCase() ?? "P"}
      </div>
      <div className={styles.content}>
        <header>
          <h3>{profile.name ?? "Huấn luyện viên"}</h3>
          <span className="badge">{profile.promoted ? "Promoted" : "Verified"}</span>
        </header>
        <p className={styles.meta}>{profile.experience_years ?? 0} năm kinh nghiệm • {profile.specialties?.join(", ") ?? "PT đa năng"}</p>
        <p className={styles.meta}>{profile.price_per_session ? `${profile.price_per_session.toLocaleString("vi-VN")}đ / buổi` : "Liên hệ báo giá"}</p>
      </div>
    </article>
  );
}

export default PTCard;
