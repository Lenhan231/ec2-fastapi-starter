import Link from "next/link";
import styles from "./GymCard.module.css";
import type { Gym } from "../types";

interface Props {
  gym: Gym;
}

function formatPrice(gym: Gym): string {
  if (gym.price_min == null && gym.price_max == null) return "Liên hệ";
  if (gym.price_min != null && gym.price_max != null) {
    return `${gym.price_min.toLocaleString("vi-VN")}đ - ${gym.price_max.toLocaleString("vi-VN")}đ`;
  }
  if (gym.price_min != null) return `Từ ${gym.price_min.toLocaleString("vi-VN")}đ`;
  return `Đến ${gym.price_max!.toLocaleString("vi-VN")}đ`;
}

function GymCard({ gym }: Props) {
  return (
    <article className={`card ${styles.wrapper}`}>
      <div className={styles.thumbnail} aria-hidden>
        {gym.thumbnail ? <img src={gym.thumbnail} alt={gym.name} /> : <div className={styles.placeholder} />}
      </div>
      <div className={styles.content}>
        <header className={styles.header}>
          <div>
            <h3>{gym.name}</h3>
            <p className={styles.meta}>{gym.location?.district ?? ""} • {gym.location?.city ?? ""}</p>
          </div>
          <span className="rating">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            {gym.rating_avg?.toFixed(1) ?? "5.0"}
            <span className={styles.reviewCount}>({gym.rating_count ?? 0})</span>
          </span>
        </header>

        <p className={styles.price}>{formatPrice(gym)} • Cách bạn {gym.distance_km?.toFixed(1) ?? "-"} km</p>
        <p className={styles.summary}>{gym.summary ?? "Phòng gym đa dạng tiện ích, PT chuyên nghiệp, lịch linh hoạt."}</p>

        <footer className={styles.footer}>
          <Link href={`/gyms/${gym.id}`} className={styles.cta}>
            Xem chi tiết
          </Link>
        </footer>
      </div>
    </article>
  );
}

export default GymCard;
