"use client";

import { useState } from "react";
import styles from "./Navigation.module.scss";
import PrivateVault from "./PrivateVault";

const links = [
  ["Work", "#projects"],
  ["About", "#story"],
  ["Community", "#community"],
  ["Toolkit", "#toolkit"],
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);

  return (
    <header className={styles.header}>
      <button className={styles.mark} type="button" aria-label="Open private notes and documents" onClick={() => setVaultOpen(true)}>
        <span className={styles.welcomeType}>WELCOME</span>
      </button>
      <button
        className={styles.menuButton}
        type="button"
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpen(!open)}
      >
        <span>{open ? "Close" : "Menu"}</span><span className={styles.menuGlyph} aria-hidden="true">{open ? "×" : "☰"}</span>
      </button>
      <nav id="primary-navigation" className={`${styles.nav} ${open ? styles.navOpen : ""}`} aria-label="Primary navigation">
        {links.map(([label, href], index) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            <span className={styles.linkIndex}>0{index + 1}</span>{label}
          </a>
        ))}
        <a className={styles.resume} href="#contact" onClick={() => setOpen(false)}>
          Let’s talk <span aria-hidden="true">↗</span>
        </a>
      </nav>
      <PrivateVault open={vaultOpen} onClose={() => setVaultOpen(false)} />
    </header>
  );
}
