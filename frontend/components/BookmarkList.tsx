import Link from "next/link";
import styles from "./BookmarkList.module.css";
import type { Bookmark } from "../types";

interface Props {
  bookmarks: Bookmark[] | undefined;
}

function BookmarkList({ bookmarks }: Props) {
  if (!bookmarks || bookmarks.length === 0) {
    return <p className={styles.empty}>Bạn chưa lưu gym hoặc PT nào.</p>;
  }

  return (
    <ul className={styles.list}>
      {bookmarks.map((bookmark) => (
        <li key={bookmark.id} className={styles.item}>
          <span className={styles.type}>{bookmark.type}</span>
          <Link href={bookmark.href}>{bookmark.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default BookmarkList;
