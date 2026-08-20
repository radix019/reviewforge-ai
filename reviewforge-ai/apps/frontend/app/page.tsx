"use client";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const handleClick = () => {
    router.replace("/login");
  };
  return (
    <div className={styles.page}>
      <button onClick={handleClick}>Login</button>
      <h1>This is ReviewForge Ai</h1>
      <main className={styles.main}></main>
    </div>
  );
}
