"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./GitHubContributions.module.scss";

type Contribution = { date: string; count: number; level: number };
type ContributionResponse = { total?: Record<string, number>; contributions?: Contribution[] };

export default function GitHubContributions() {
  const year = new Date().getFullYear();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [yearTotal, setYearTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/gitwithsunil?y=${year}`, { cache: "no-store" });
        if (!response.ok) throw new Error("Contribution data is unavailable");
        const result: ContributionResponse = await response.json();
        if (!active) return;
        const days = result.contributions ?? [];
        setContributions(days);
        setYearTotal(result.total?.[String(year)] ?? days.reduce((sum, day) => sum + day.count, 0));
        setFailed(false);
      } catch {
        if (active) setFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    const refresh = window.setInterval(load, 60 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(refresh);
    };
  }, [year]);

  const calendar = useMemo(() => {
    const firstDate = contributions[0]?.date;
    const offset = firstDate ? new Date(`${firstDate}T00:00:00`).getDay() : 0;
    const count = Math.ceil((offset + contributions.length) / 7) * 7;
    const cells: (Contribution | null)[] = Array(count).fill(null);
    contributions.forEach((day, index) => { cells[offset + index] = day; });
    return cells;
  }, [contributions]);

  return (
    <div className={styles.panel} aria-label={`GitHub contributions for ${year}`}>
      <div className={styles.panelHead}>
        <div><span className={styles.eyebrow}>CONTRIBUTIONS THIS YEAR</span><strong>{loading ? "—" : (yearTotal ?? 0).toLocaleString()} <small>contributions</small></strong></div>
        <span className={styles.year}>{year}</span>
      </div>
      {failed ? (
        <div className={styles.status}>Contribution data is temporarily unavailable. <a href="https://github.com/gitwithsunil" target="_blank" rel="noreferrer">See GitHub profile ↗</a></div>
      ) : (
        <div className={styles.calendarScroll}>
          <div className={styles.calendar} role="img" aria-label={`${(yearTotal ?? 0).toLocaleString()} contributions in ${year}`}>
            {calendar.map((day, index) => <span key={day?.date ?? `empty-${index}`} className={`${styles.cell} ${day ? styles[`level${day.level}`] : styles.empty}`} title={day ? `${day.count} contributions on ${day.date}` : undefined} />)}
          </div>
        </div>
      )}
      <div className={styles.panelFoot}><span>Less <i className={styles.legend0} /><i className={styles.legend1} /><i className={styles.legend2} /><i className={styles.legend3} /><i className={styles.legend4} /> More</span><a href="https://github.com/gitwithsunil" target="_blank" rel="noreferrer">VIEW GITHUB PROFILE ↗</a></div>
      <p className={styles.source}>Live public contribution data · refreshes hourly</p>
    </div>
  );
}
