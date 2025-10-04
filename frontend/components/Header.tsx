"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/offers/gyms", label: "Ưu đãi Gym" },
  { href: "/offers/pts", label: "Ưu đãi PT" },
  { href: "/profile", label: "Hồ sơ" }
];

const authLinks = [
  { href: "/auth/sign-in", label: "Đăng nhập" },
  { href: "/auth/sign-up", label: "Đăng ký" }
];

function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.wrapper}>
      <div className={styles.left}>
        <Link href="/" className={styles.logo}>
          Easy Body
        </Link>
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={`${styles.navLink} ${active ? styles.active : ""}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className={styles.right}>
        {authLinks.map((item, index) => (
          <Link key={item.href} href={item.href} className={`${styles.authLink} ${index === 1 ? styles.primary : ""}`}>
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}

export default Header;
