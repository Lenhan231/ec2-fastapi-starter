"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, BuildingStorefrontIcon, UserGroupIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import styles from "./BottomNav.module.css";

const tabs = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/offers/gyms", label: "Gym", icon: BuildingStorefrontIcon },
  { href: "/offers/pts", label: "PT", icon: UserGroupIcon },
  { href: "/profile", label: "Profile", icon: UserCircleIcon }
];

function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.wrapper}>
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link key={href} href={href} className={`${styles.tab} ${active ? styles.active : ""}`}>
            <Icon className={styles.icon} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default BottomNav;
