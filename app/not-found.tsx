import styles from "./not-found.module.scss";

export default function NotFound() {
  return <main className={styles.page}><span>404 / SIGNAL LOST</span><h1>Page not found.</h1><p>The route you requested does not exist in this dossier.</p><a href="/">Return to the portfolio ↗</a></main>;
}
