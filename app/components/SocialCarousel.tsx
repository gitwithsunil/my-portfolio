"use client";

import { useEffect, useState } from "react";
import styles from "./SocialCarousel.module.scss";

const profiles = [
  {
    name: "LinkedIn",
    handle: "G. Sunil Kumar Reddy",
    description: "Professional profile and career updates",
    href: "https://www.linkedin.com/in/g-sunil-kumar-reddy-458779334",
    avatar: "/images/linkedin-profile.png",
    mark: "in",
    className: styles.linkedin,
  },
  {
    name: "GitHub",
    handle: "@gitwithsunil",
    description: "Code, experiments, and selected projects",
    href: "https://github.com/gitwithsunil",
    avatar: "/images/github-profile.png",
    mark: "GH",
    className: styles.github,
  },
  {
    name: "Instagram",
    handle: "@g_sunilreddy_",
    description: "Personal snapshots and campus life",
    href: "https://www.instagram.com/g_sunilreddy_/",
    avatar: "/images/instagram-profile.png",
    mark: "◎",
    className: styles.instagram,
  },
];

const slides = [profiles[profiles.length - 1], ...profiles, profiles[0]];

export default function SocialCarousel() {
  const [step, setStep] = useState(1);
  const [teleport, setTeleport] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setStep((current) => current + 1), 2000);
    return () => window.clearInterval(timer);
  }, []);

  const handleTransitionEnd = () => {
    if (step === profiles.length + 1) {
      setTeleport(true);
      setStep(1);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setTeleport(false));
      });
    }
  };

  return (
    <div className={styles.carousel} aria-label="Social profile links">
      <div className={styles.carouselHead}>
        <span>FIND ME AROUND THE WEB</span>
        <span>0{((step - 1) % profiles.length) + 1} / 03</span>
      </div>
      <div className={styles.viewport}>
        <div
          className={`${styles.track} ${teleport ? styles.teleport : ""}`}
          style={{ transform: `translateX(-${step * 25}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((profile, index) => (
            <div className={styles.slide} key={`${profile.name}-${index}`} aria-hidden={index !== step}>
              <a className={`${styles.card} ${profile.className}`} href={profile.href} target="_blank" rel="noreferrer" tabIndex={index === step ? 0 : -1}>
                <span className={styles.avatarWrap}>
                  <img className={styles.avatar} src={profile.avatar} alt="" loading="lazy" />
                  <span className={styles.brandMark} aria-hidden="true">{profile.mark}</span>
                </span>
                <span className={styles.cardCopy}>
                  <strong>{profile.name}</strong>
                  <span>{profile.handle}</span>
                  <small>{profile.description}</small>
                </span>
                <span className={styles.cardAction}>VIEW PROFILE <b aria-hidden="true">↗</b></span>
              </a>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.carouselFoot}>
        <span aria-hidden="true" />
        <div className={styles.dots} aria-label="Choose a social profile">
          {profiles.map((profile, index) => <button type="button" aria-label={`Show ${profile.name} profile`} aria-pressed={((step - 1) % profiles.length) === index} className={((step - 1) % profiles.length) === index ? styles.activeDot : ""} onClick={() => setStep(index + 1)} key={profile.name} />)}
        </div>
        <span className={styles.footBalance} aria-hidden="true" />
      </div>
    </div>
  );
}
