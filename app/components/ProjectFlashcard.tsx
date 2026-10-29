"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ProjectFlashcard.module.scss";

type ProjectType = "serl" | "traceme" | "inspector";
type ProjectContent = {
  topic: string;
  label: string;
  headline: [string, string];
  flow: { step: string; title: string; subtitle: string }[];
  feedback: string;
  backHeadline: [string, string];
  details: { title: string; copy: string }[];
  stack: string;
};

const projectContent: Record<ProjectType, ProjectContent> = {
  serl: {
    topic: "ADAPTIVE TRAFFIC CONTROL",
    label: "SELF-EVOLVING API RATE LIMITER",
    headline: ["Traffic in.", "Decisions out."],
    flow: [
      { step: "01 · INPUT", title: "Requests", subtitle: "Incoming traffic" },
      { step: "02 · CONTROL", title: "Rate limiter", subtitle: "Bucket + rolling window" },
      { step: "03 · RESPONSE", title: "ALLOW / DENY", subtitle: "Per-request decision" },
    ],
    feedback: "TELEMETRY ↶ ADAPTIVE POLICY · Z-SCORE + Q-LEARNING EXPERIMENT",
    backHeadline: ["Two checks.", "One decision."],
    details: [
      { title: "Token bucket", copy: "Allows brief bursts while keeping a refill rate." },
      { title: "Sliding window", copy: "Counts recent requests across a rolling interval." },
      { title: "Adaptive feedback", copy: "Telemetry and a Q-learning experiment can tune the limit." },
    ],
    stack: "FASTAPI · PYTHON · IN-MEMORY REQUEST STATE",
  },
  traceme: {
    topic: "PUBLIC USERNAME SEARCH",
    label: "TRACEME · OSINT WORKFLOW",
    headline: ["Search a handle.", "Review the signal."],
    flow: [
      { step: "01 · INPUT", title: "Username", subtitle: "One public handle" },
      { step: "02 · SEARCH", title: "Sherlock", subtitle: "Check public platforms" },
      { step: "03 · REVIEW", title: "Possible matches", subtitle: "Inspect each result" },
    ],
    feedback: "PUBLIC SOURCES · MANUAL REVIEW · NO IDENTITY CERTAINTY",
    backHeadline: ["Find a lead.", "Check the evidence."],
    details: [
      { title: "Start with a username", copy: "Submit a handle to the Flask interface." },
      { title: "Search public platforms", copy: "Sherlock checks for profiles using that handle." },
      { title: "Review possible matches", copy: "Compare results manually before drawing conclusions." },
    ],
    stack: "PYTHON · FLASK · SHERLOCK",
  },
  inspector: {
    topic: "PACKET ANALYSIS CONCEPT",
    label: "NETWORK TROUBLESHOOTING INSPECTOR",
    headline: ["Capture traffic.", "Find the signal."],
    flow: [
      { step: "01 · CAPTURE", title: ".PCAP file", subtitle: "Network packet trace" },
      { step: "02 · ANALYZE", title: "Packet signals", subtitle: "Decode + group events" },
      { step: "03 · INVESTIGATE", title: "Diagnostics", subtitle: "Review likely issues" },
    ],
    feedback: "TCP RETRANSMITS · LATENCY · DNS FAILURES",
    backHeadline: ["Turn packets", "into clues."],
    details: [
      { title: "Load a capture", copy: "Start with a PCAP file containing network traffic." },
      { title: "Inspect packet signals", copy: "Look for retransmissions, duplicate ACKs, resets, and timing patterns." },
      { title: "Summarize likely issues", copy: "Group findings into a readable troubleshooting view." },
    ],
    stack: "PYTHON · SCAPY · PANDAS · STREAMLIT",
  },
};

export default function ProjectFlashcard({ type }: { type: ProjectType }) {
  const [flipped, setFlipped] = useState(false);
  const [inView, setInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const project = projectContent[type];

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting && entry.intersectionRatio >= 0.6);
    }, { threshold: [0, 0.6] });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const timer = window.setInterval(() => setFlipped((value) => !value), 4000);
    return () => window.clearInterval(timer);
  }, [inView]);

  return (
    <div className={styles.flashcard} data-project={type}>
      <button className={styles.flipButton} type="button" aria-pressed={flipped} onClick={() => setFlipped((value) => !value)}>
        {flipped ? "BACK TO PROJECT FLOW" : "FLIP FOR THE DETAILS"}<span aria-hidden="true">↻</span>
      </button>
      <div ref={cardRef} className={`${styles.card} ${flipped ? styles.flipped : ""}`}>
        <article className={`${styles.face} ${styles.front}`} aria-hidden={flipped}>
          <header className={styles.cardHead}><span>FLASHCARD / FLOW</span><span>{project.topic}</span></header>
          <div className={styles.frontTitle}><small>{project.label}</small><h3>{project.headline[0]}<br /><em>{project.headline[1]}</em></h3></div>
          <div className={styles.flow}>
            {project.flow.map((item, index) => <div className={`${styles.flowGroup} ${index === 1 ? styles.flowMiddle : ""}`} key={item.step}>
              <div className={`${styles.flowNode} ${index === 1 ? styles.limiter : ""} ${index === 2 ? styles.outcome : ""}`}>
                <small>{item.step}</small><strong>{item.title}</strong><span>{item.subtitle}</span>
              </div>
              {index < project.flow.length - 1 && <span className={styles.connector} aria-hidden="true">→</span>}
            </div>)}
          </div>
          <div className={styles.feedback}><span>{project.feedback}</span></div>
          <footer className={styles.cardFoot}><span>{project.stack}</span><span>01 / 02</span></footer>
        </article>

        <article className={`${styles.face} ${styles.back}`} aria-hidden={!flipped}>
          <header className={styles.cardHead}><span>FLASHCARD / DETAILS</span><span>HOW IT WORKS</span></header>
          <div className={styles.backTitle}><small>{project.label}</small><h3>{project.backHeadline[0]}<br /><em>{project.backHeadline[1]}</em></h3></div>
          <div className={styles.explanations}>
            {project.details.map((item, index) => <div key={item.title}><span>0{index + 1}</span><p><strong>{item.title}</strong><small>{item.copy}</small></p></div>)}
          </div>
          <footer className={styles.cardFoot}><span>{project.stack}</span><span>02 / 02</span></footer>
        </article>
      </div>
    </div>
  );
}
