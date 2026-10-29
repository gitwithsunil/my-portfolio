import Image from "next/image";
import Navigation from "./components/Navigation";
import SocialCarousel from "./components/SocialCarousel";
import GitHubContributions from "./components/GitHubContributions";
import ProjectFlashcard from "./components/ProjectFlashcard";
import styles from "./page.module.scss";

const projects = [
  {
    number: "01",
    title: "Self-Evolving API Rate Limiter",
    short: "An experimental FastAPI service that combines two rate-limit strategies with traffic telemetry and adaptive policy logic.",
    note: "The repository describes in-memory request state and a Q-learning agent that benefits from varied traffic before its decisions settle.",
    category: "BACKEND SYSTEMS / EXPERIMENT",
    stack: ["FastAPI", "Python", "Token bucket", "Q-learning"],
    status: "Repository documented",
    href: "https://github.com/gitwithsunil/Self-Evolving-API-Rate-Limiter",
    diagram: "serl",
  },
  {
    number: "02",
    title: "TraceMe",
    short: "A Flask interface for running Sherlock username searches across public platforms and reviewing the possible matches.",
    note: "A username match is only a lead, not proof of identity. The repository notes that Holehe integration remains unfinished.",
    category: "WEB APPLICATION / OSINT",
    stack: ["Python", "Flask", "Sherlock"],
    status: "Repository documented · integration work remains",
    href: "https://github.com/gitwithsunil/TraceMe",
    diagram: "traceme",
  },
  {
    number: "03",
    title: "Network Troubleshooting Inspector",
    short: "A PCAP analysis concept for turning packet traces into a readable troubleshooting overview.",
    note: "Supplied project details list TCP retransmissions, duplicate ACKs, resets, latency, and DNS failures; implementation details are not yet verified against the repository.",
    category: "NETWORKING / USER-PROVIDED DETAILS",
    stack: ["Python", "Scapy", "Pandas", "Streamlit"],
    status: "Concept details supplied · repository linked",
    href: "https://github.com/gitwithsunil/Network-Troubleshooting-Inspector.git",
    diagram: "inspector",
  },
];

const skills = [
  { label: "Backend & APIs", items: "Python · FastAPI · Flask · JavaScript · Node.js · Express.js · REST" },
  { label: "Data & persistence", items: "PostgreSQL · MySQL · SQLite · SQL · Pandas" },
  { label: "Systems & security", items: "Linux · Networking · Scapy · Wireshark · OSINT" },
  { label: "Build workflow", items: "Git · GitHub · Debugging · Technical documentation" },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span className={styles.arrow} aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

function GitHubMark() {
  return <svg className={styles.githubMark} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.1c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.12 3.04.74.8 1.18 1.82 1.18 3.08 0 4.43-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14v3.18c0 .3.21.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" /></svg>;
}

function ProjectDiagram({ type }: { type: string }) {
  if (type === "serl" || type === "traceme" || type === "inspector") return <ProjectFlashcard type={type} />;

  const diagrams: Record<string, { flow: string; heading: string }> = {
    serl: { flow: "DOCUMENTED SYSTEM FLOW", heading: "TRAFFIC CONTROL / ADAPTIVE FEEDBACK" },
    traceme: { flow: "DOCUMENTED USERNAME SEARCH", heading: "PUBLIC WEB / SEARCH / REVIEW" },
    inspector: { flow: "CONCEPT FROM SUPPLIED DETAILS", heading: "PCAP / SIGNALS / TRIAGE" },
  };
  const diagram = diagrams[type];
  return (
    <div className={`${styles.diagram} ${styles[`diagram_${type}`]}`} aria-hidden="true">
      <div className={styles.diagramTop}><span>{diagram.flow}</span><span>{diagram.heading}</span></div>
      {type === "serl" ? (
        <div className={styles.serlDiagram}>
          <div className={styles.serlMainFlow}>
            <span className={styles.diagramNode}><b>01</b>INCOMING<br />REQUESTS</span><i />
            <span className={`${styles.diagramNode} ${styles.nodeAccent}`}><b>02</b>RATE<br />LIMITER</span><i />
            <span className={styles.diagramNode}><b>03</b>ALLOW /<br />DENY</span>
          </div>
          <div className={styles.serlModules}>
            <span><b>TOKEN BUCKET</b><small>allows short bursts</small></span>
            <span><b>SLIDING WINDOW</b><small>checks rolling interval</small></span>
            <span><b>TELEMETRY</b><small>records each decision</small></span>
          </div>
          <div className={styles.serlFeedback}><i /><span>Z-SCORE SPIKE CHECK</span><i /><span>Q-LEARNING LIMIT UPDATE</span><i /></div>
          <div className={styles.serlFoot}><span>BACKGROUND EVALUATION · 8 SEC</span><span>REQUEST STATE · IN MEMORY</span></div>
        </div>
      ) : type === "traceme" ? (
        <div className={styles.traceDiagram}>
          <div className={styles.traceMainFlow}>
            <span className={styles.traceInput}><small>INPUT</small><b>Username</b></span><i />
            <span className={styles.traceCore}><small>SEARCH ENGINE</small><b>Sherlock</b></span><i />
            <span className={styles.traceResults}><small>PUBLIC WEB</small><b>Possible matches</b></span>
          </div>
          <div className={styles.tracePlatforms}><span>Platform A</span><span>Platform B</span><span>Platform C</span><span>More results</span></div>
          <div className={styles.traceReview}><b>REVIEW EACH MATCH</b><span>A USERNAME MATCH DOES NOT CONFIRM IDENTITY</span></div>
        </div>
      ) : (
        <div className={styles.inspectorDiagram}>
          <div className={styles.inspectorTop}><span className={styles.pcapFile}><b>.PCAP</b><small>CAPTURE FILE</small></span><i /><span className={styles.parseStage}><b>PACKET PARSER</b><small>DECODE & GROUP</small></span><i /><span className={styles.reportStage}><b>DIAGNOSTIC VIEW</b><small>INVESTIGATE SIGNALS</small></span></div>
          <div className={styles.signalGrid}>
            <span><b>TCP</b><small>retransmits · duplicate ACKs · resets</small></span>
            <span><b>LATENCY</b><small>timing patterns to investigate</small></span>
            <span><b>DNS</b><small>resolution failures</small></span>
          </div>
          <div className={styles.inspectorFoot}>ANALYSIS OVERVIEW · CONCEPTUAL, NOT LIVE PACKET DATA</div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main className={styles.desktop}>
      <div className={styles.desktopShortcuts} aria-hidden="true">
        <div><i className={styles.computerIcon} /><span>My computer</span></div>
        <div><i className={styles.folderIcon} /><span>Projects</span></div>
        <div className={styles.recycle}><i className={styles.binIcon} /><span>Recycle bin</span></div>
      </div>
      <div className={styles.appWindow}>
        <div className={styles.windowBar} aria-hidden="true">
          <span className={styles.windowControls}><i /><i /><i /></span>
        </div>
        <div className={styles.appSurface}>
          <Navigation />

      <section className={styles.hero} id="home" aria-labelledby="hero-title">
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroSideNote}>
          <span>01 / PRESENCE</span>
          <span>BACKEND<br />EDUCATION<br />HUMAN CONNECTION</span>
        </div>
        <div className={styles.portraitFrame}>
          <div className={styles.photoWrap}><Image src="/images/sunil-kumar-reddy-formal-clean-neck.png" alt="Portrait of G. Sunil Kumar Reddy in a charcoal black formal shirt, with a clean-shaven neck and transparent background" fill priority sizes="(max-width: 760px) 85vw, 45vw" className={styles.portrait} /></div>
          <div className={styles.halftone} aria-hidden="true" />
        </div>
        <div className={styles.heroIdentity}>
          <h1 id="hero-title"><span className={styles.typedName}>G. Sunil Kumar Reddy</span></h1>
          <p>Computer science student building practical software through <strong>backend development, APIs, and systems thinking.</strong></p>
          <p className={styles.heroAsideCopy}>Linux, networking, and security give me another way to look at how systems behave. I use projects to turn that curiosity into practice—and learn what holds up, what breaks, and what I’d improve next.</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#projects">Explore selected work <Arrow diagonal /></a>
            <a className={styles.textButton} href="#story">Read my story <Arrow /></a>
          </div>
        </div>
        <div className={styles.heroMeta}><span>01 / 05</span><span className={styles.metaLine} /><span>BACKEND · SOFTWARE · SYSTEMS</span></div>
        <a className={styles.scrollCue} href="#story"><span className={styles.scrollStem} /> SCROLL TO INVESTIGATE</a>
      </section>

      <section className={`${styles.section} ${styles.story}`} id="story" aria-labelledby="story-title">
        <div className={styles.sectionHead}><span>ACT 01 — THE ORIGIN</span><span>01 / 05</span></div>
        <div className={styles.storyLayout}>
          <div className={styles.storyText}><h2 id="story-title">College life: where<br />Wi-Fi drops, but deadlines<br /><em>never do.</em></h2><div className={styles.storyCopy}><p>I’m studying Computer Science and Engineering at <strong className={styles.universityHighlight}>NIST University</strong>. I’m drawn to the work behind useful software: understanding a problem, shaping its logic, and building the backend that makes it dependable.</p><a href="#contact" className={styles.inlineLink}>A little more about my direction <Arrow /></a></div></div>
          <div className={styles.storyGallery} aria-label="Scenes from NIST University">
            <figure className={`${styles.galleryCard} ${styles.galleryMain}`}><img src="https://www.nist.edu/nist/campus/images/lhc.webp" alt="Lecture Hall Complex at NIST University" loading="lazy" /><figcaption>LECTURE HALL COMPLEX</figcaption></figure>
            <div className={styles.gallerySide}>
              <figure className={`${styles.galleryCard} ${styles.galleryTop}`}><img src="https://www.nist.edu/nist/campus/images/galleraia_building.webp" alt="Galleria academic building at NIST University" loading="lazy" /><figcaption>GALLERIA</figcaption></figure>
              <figure className={`${styles.galleryCard} ${styles.galleryBottom}`}><img src="https://www.nist.edu/nist/campus/images/Atrium.webp" alt="Atrium building at NIST University" loading="lazy" /><figcaption>ATRIUM</figcaption></figure>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.community}`} id="community" aria-labelledby="community-title">
        <div className={styles.sectionHead}><span>INTERLUDE — THE COMMUNITY</span><span>VOLUNTEERING · CAMPUS · TECHNOLOGY</span></div>
        <div className={styles.communityLayout}>
          <div className={`${styles.storyGallery} ${styles.communityGallery}`} aria-label="Campus technology communities">
            <figure className={`${styles.galleryCard} ${styles.galleryMain} ${styles.cloudClubLogo}`} aria-label="Cloud Computing Club symbol">
              <img src="/images/cloud-computing-club-logo.svg" alt="Cloud Computing Club logo" />
              <figcaption>CLOUD COMPUTING CLUB</figcaption>
            </figure>
            <div className={styles.gallerySide}>
              <figure className={`${styles.galleryCard} ${styles.galleryTop} ${styles.gdgSign}`} aria-label="GDG on Campus NIST logo"><svg viewBox="0 0 80 54" aria-hidden="true"><path d="M36 9 22 23 36 37" fill="none" stroke="#4285f4" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/><path d="m44 9 14 14-14 14" fill="none" stroke="#34a853" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/><path d="m22 23 14 14" fill="none" stroke="#ea4335" strokeWidth="8" strokeLinecap="round"/><path d="M44 9 58 23" fill="none" stroke="#fbbc05" strokeWidth="8" strokeLinecap="round"/></svg><span>GDG ON CAMPUS</span><small>NIST UNIVERSITY</small></figure>
              <figure className={`${styles.galleryCard} ${styles.galleryBottom} ${styles.ambassadorLogo}`}><img src="https://risingstar.googlestudentambassador.vn/img/logo-gsa-2.png" alt="Google Student Ambassador logo" loading="lazy" /></figure>
            </div>
          </div>
          <div className={`${styles.storyText} ${styles.communityText}`}>
            <p className={styles.kicker}>Learning is better when it is shared.</p>
            <h2 id="community-title">Build skills.<br />Bring people <em>together.</em></h2>
            <div className={styles.storyCopy}>
              <p>Volunteering and campus communities give me a way to contribute while learning with others. I’m involved with student groups that make technology more approachable through shared study, events, and campus engagement.</p>
              <ul className={styles.communityList}>
                <li><strong className={styles.cloudClub}>Cloud Computing Club</strong><span>Exploring cloud platforms and hands-on learning with the NIST student community.</span></li>
                <li><strong className={styles.gdgCampus}>GDG on Campus</strong><span>Learning Google developer technologies and building alongside fellow students.</span></li>
                <li><strong className={styles.googleAmbassador}>Google Student Ambassador</strong><span>Supporting campus engagement around technology and student learning.</span></li>
              </ul>
              <a href="#contact" className={styles.inlineLink}>Let’s make useful things together <Arrow /></a>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.projects}`} id="projects" aria-labelledby="projects-title">
        <div className={styles.sectionHead}><span>ACT 02 — THE BUILDS</span><span>SELECTED WORK / 03</span></div>
        <div className={styles.projectsIntro}><div><p className={styles.kicker}>Proof through practice.</p><h2 id="projects-title">Systems, under<br /><em>the surface.</em></h2></div><p>Small investigations into traffic, identity signals, and network behavior. Each project is presented at the level its available evidence supports.</p></div>
        <div className={styles.projectList}>
          {projects.map((project) => <article className={`${styles.project} ${styles[`project_${project.diagram}`]}`} key={project.number}>
            <div className={styles.projectInfo}>
              <div className={styles.projectTop}><span>{project.number} / {project.category}</span><span className={styles.projectStatus}><i />{project.status}</span></div>
              <h3>{project.title}</h3><p>{project.short}</p>
              <p className={styles.projectNote}>{project.note}</p>
              <div className={styles.tags}>{project.stack.map((tech) => <span key={tech}>{tech}</span>)}</div>
              {project.href ? <a className={styles.projectLink} href={project.href} target="_blank" rel="noreferrer" aria-label="View source repository"><GitHubMark />View source repository <Arrow diagonal /></a> : <span className={styles.projectLinkMuted}>Repository details to be added</span>}
            </div>
            <ProjectDiagram type={project.diagram} />
          </article>)}
        </div>
        <a className={styles.allProjectsButton} href="https://github.com/gitwithsunil?tab=repositories" target="_blank" rel="noreferrer"><GitHubMark />Explore all projects on GitHub <Arrow diagonal /></a>
      </section>

      <section className={`${styles.section} ${styles.method}`} aria-labelledby="method-title">
        <div className={styles.sectionHead}><span>ACT 03 — THE INVESTIGATION</span><span>GITHUB ACTIVITY</span></div>
        <div className={styles.methodHead}><h2 id="method-title">A year of<br /><em>building.</em></h2><p>My public GitHub contribution graph, synced to <a href="https://github.com/gitwithsunil" target="_blank" rel="noreferrer">@gitwithsunil</a>.</p></div>
        <GitHubContributions />
      </section>

      <section className={`${styles.section} ${styles.toolkit}`} id="toolkit" aria-labelledby="toolkit-title">
        <div className={styles.sectionHead}><span>ACT 04 — THE TOOLKIT</span><span>LEARNED BY BUILDING</span></div>
        <div className={styles.toolkitLayout}><div><p className={styles.kicker}>Tools are evidence of practice, not a score.</p><h2 id="toolkit-title">A growing<br /><em>technical range.</em></h2></div><div className={styles.skillList}>{skills.map((skill, index) => <div className={styles.skillRow} key={skill.label}><span>0{index + 1}</span><div><h3>{skill.label}</h3><p>{skill.items}</p></div><span className={styles.skillMark}>+</span></div>)}</div></div>
      </section>

      <section className={`${styles.section} ${styles.next}`}>
        <div className={styles.sectionHead}><span>ACT 05 — THE NEXT MISSION</span><span>OPEN TO OPPORTUNITY</span></div>
        <div className={styles.nextLayout}><SocialCarousel /><div className={styles.nextCopy}><p>I’m looking for internships and entry-level opportunities in backend development and software engineering—places to contribute, learn from a team, and grow through real engineering work.</p><a href="#contact" className={styles.primaryButton}>Start a conversation <Arrow /></a></div></div>
      </section>

      <footer className={styles.footer} id="contact">
        <div className={styles.footerTop}><span className={styles.kicker}>HAVE A GOOD PROBLEM TO SOLVE?</span><a className={styles.contactCta} href="mailto:reddysu81@gmail.com?subject=Portfolio%20inquiry" aria-label="Email Sunil at reddysu81@gmail.com"><span className={styles.emailIcon} aria-hidden="true"><svg viewBox="0 0 24 24"><path fill="#4285F4" d="M2.5 6.7v11.1c0 1 .8 1.8 1.8 1.8h2.5V10L2.5 6.7Z"/><path fill="#34A853" d="M17.2 19.6h2.5c1 0 1.8-.8 1.8-1.8V6.7L17.2 10v9.6Z"/><path fill="#FBBC04" d="M17.2 5.2V10l4.3-3.3V5.5c0-1.4-1.6-2.2-2.7-1.3l-1.6 1Z"/><path fill="#EA4335" d="m2.5 6.7 9.5 7.1 9.5-7.1-3.2-2.4L12 9.8 5.7 4.3 2.5 6.7Z"/><path fill="#C5221F" d="M2.5 5.5v1.2L6.8 10V5.2l-1.6-1c-1.1-.9-2.7-.1-2.7 1.3Z"/></svg></span>Email me <Arrow diagonal /></a></div>
        <div className={styles.footerBottom}><div><b>G. SUNIL KUMAR REDDY</b><span>BACKEND DEVELOPMENT · SOFTWARE ENGINEERING</span></div><span className={styles.copyright}>© 2026 · BUILT WITH INTENT</span></div>
      </footer>
        </div>
      </div>
    </main>
  );
}
