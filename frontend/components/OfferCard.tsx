import Link from "next/link";
import styles from "./OfferCard.module.css";
import type { Offer } from "../types";

interface Props {
  offer: Offer;
}

function formatDateRange(start: string, end: string) {
  const formatter = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit"
  });
  return `${formatter.format(new Date(start))} - ${formatter.format(new Date(end))}`;
}

function OfferCard({ offer }: Props) {
  const isGymOffer = offer.offer_type === "GYM";
  const entity = isGymOffer ? offer.gym?.name : offer.pt?.name;
  const promoted = offer.promoted;
  const href = isGymOffer ? `/offers/gyms/${offer.id}` : `/offers/pts/${offer.id}`;

  return (
    <article className={`card ${styles.wrapper}`}>
      <div className={styles.header}>
        <span className="badge">{isGymOffer ? "Gym Deal" : "PT Deal"}</span>
        {promoted && <span className={styles.promoted}>Promoted</span>}
      </div>
      <h3 className={styles.title}>{offer.title}</h3>
      <p className={styles.summary}>{offer.summary ?? offer.description ?? "Ưu đãi hấp dẫn dành cho thành viên mới và alumni."}</p>
      <div className={styles.metaRow}>
        {entity && <span className={styles.entity}>{entity}</span>}
        <span className={styles.meta}>Hạn: {formatDateRange(offer.valid_from, offer.valid_to)}</span>
        {offer.status && <span className={styles.status}>Status: {offer.status}</span>}
      </div>
      <Link href={href} className="cta-button">
        Xem chi tiết
      </Link>
    </article>
  );
}

export default OfferCard;
