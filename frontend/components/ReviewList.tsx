import styles from "./ReviewList.module.css";
import type { Review } from "../types";

interface Props {
  reviews: Review[];
}

function ReviewList({ reviews }: Props) {
  if (reviews.length === 0) {
    return <p className={styles.empty}>Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!</p>;
  }

  return (
    <ul className={styles.list}>
      {reviews.map((review) => (
        <li key={review.id} className={styles.item}>
          <header>
            <strong>{review.author}</strong>
            <span className={styles.rating}>{"★".repeat(review.rating)} </span>
          </header>
          <p>{review.content}</p>
          <time>{new Date(review.created_at).toLocaleDateString("vi-VN")}</time>
        </li>
      ))}
    </ul>
  );
}

export default ReviewList;
