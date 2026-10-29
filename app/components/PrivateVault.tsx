"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./PrivateVault.module.scss";

type VaultEntry = {
  id: string;
  kind: "file" | "note" | "link";
  title: string;
  updatedAt: string;
  body?: string;
  url?: string;
  file?: Blob;
  fileName?: string;
  mimeType?: string;
};

type Tab = VaultEntry["kind"];

function openVaultDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("sunil-portfolio-private-vault", 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains("entries")) {
        request.result.createObjectStore("entries", { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open local storage."));
  });
}

async function saveEntry(entry: VaultEntry) {
  const db = await openVaultDb();
  await new Promise<void>((resolve, reject) => {
    const request = db.transaction("entries", "readwrite").objectStore("entries").put(entry);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  db.close();
}

async function readEntries(): Promise<VaultEntry[]> {
  const db = await openVaultDb();
  const entries = await new Promise<VaultEntry[]>((resolve, reject) => {
    const request = db.transaction("entries", "readonly").objectStore("entries").getAll();
    request.onsuccess = () => resolve(request.result as VaultEntry[]);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return entries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

async function deleteEntry(id: string) {
  const db = await openVaultDb();
  await new Promise<void>((resolve, reject) => {
    const request = db.transaction("entries", "readwrite").objectStore("entries").delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
  db.close();
}

export default function PrivateVault({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("file");
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [category, setCategory] = useState("Image");
  const [file, setFile] = useState<File | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [error, setError] = useState("");
  const [selectedNote, setSelectedNote] = useState<VaultEntry | null>(null);
  const [deletePromptFor, setDeletePromptFor] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState("");

  async function refresh() {
    try {
      setEntries(await readEntries());
      setError("");
    } catch {
      setError("This browser could not open local storage. Try a current browser with site storage enabled.");
    }
  }

  useEffect(() => {
    if (open) void refresh();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  async function addFile() {
    if (!file) return setError("Choose a file first.");
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if ((category === "Image" && !isImage) || (category === "PDF" && !isPdf)) return setError(`Choose a file that matches the ${category} category.`);
    await saveEntry({ id: crypto.randomUUID(), kind: "file", title: category, fileName: file.name, mimeType: file.type, file, updatedAt: new Date().toISOString() });
    setFile(null);
    const input = document.getElementById("vault-file") as HTMLInputElement | null;
    if (input) input.value = "";
    await refresh();
  }

  async function addNote() {
    if (!noteTitle.trim() || !noteBody.trim()) return setError("Add a title and some note text.");
    await saveEntry({ id: crypto.randomUUID(), kind: "note", title: noteTitle.trim(), body: noteBody.trim(), updatedAt: new Date().toISOString() });
    setNoteTitle(""); setNoteBody(""); await refresh();
  }

  async function addLink() {
    if (!linkTitle.trim()) return setError("Add a title for this link.");
    try {
      const parsed = new URL(linkUrl);
      if (!["http:", "https:", "mailto:"].includes(parsed.protocol)) throw new Error();
    } catch {
      return setError("Enter a valid https://, http://, or mailto: link.");
    }
    await saveEntry({ id: crypto.randomUUID(), kind: "link", title: linkTitle.trim(), url: linkUrl.trim(), updatedAt: new Date().toISOString() });
    setLinkTitle(""); setLinkUrl(""); await refresh();
  }

  async function removeEntry(id: string) {
    if (!deletePassword) return setError("Enter the delete password to continue.");
    const response = await fetch("/api/vault-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: deletePassword }),
    });
    if (!response.ok) {
      setError(response.status === 503 ? "Password deletion is not configured on this server." : "That password did not match.");
      setDeletePassword("");
      return;
    }
    await deleteEntry(id);
    setDeletePromptFor(null);
    setDeletePassword("");
    await refresh();
  }

  function downloadEntry(entry: VaultEntry) {
    if (!entry.file) return;
    const url = URL.createObjectURL(entry.file);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = entry.fileName ?? entry.title; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const visibleEntries = entries.filter((entry) => entry.kind === tab);

  return createPortal((
    <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="vault-title">
        <header className={styles.header}>
          <div><span className={styles.eyebrow}>PERSONAL · THIS BROWSER</span><h2 id="vault-title">Private notebook</h2></div>
          <button className={styles.close} type="button" onClick={onClose} aria-label="Close private notebook">×</button>
        </header>
        <p className={styles.notice}>Files, notes, and links are stored on this device in this browser. They are not uploaded or synced. Anyone with access to this browser profile can open this notebook.</p>
        <div className={styles.tabs} role="tablist" aria-label="Notebook sections">
          {([["file", "Documents"], ["note", "Notes"], ["link", "Links"]] as [Tab, string][]).map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? styles.activeTab : ""} onClick={() => { setTab(id); setError(""); }}>{label}</button>)}
        </div>
        {tab === "file" && <div className={styles.formRow}>
          <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option>Image</option><option>PDF</option></select></label>
          <label className={styles.fileLabel}>Choose file<input id="vault-file" type="file" accept="image/*,.pdf,application/pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label>
          <button className={styles.saveButton} type="button" onClick={() => void addFile()}>Save document</button>
        </div>}
        {tab === "note" && <div className={styles.formStack}>
          <label>Title<input value={noteTitle} onChange={(event) => setNoteTitle(event.target.value)} placeholder="Note title" /></label>
          <label>Note<textarea rows={3} value={noteBody} onChange={(event) => setNoteBody(event.target.value)} placeholder="Write something to keep…" /></label>
          <button className={styles.saveButton} type="button" onClick={() => void addNote()}>Save note</button>
        </div>}
        {tab === "link" && <div className={styles.formRow}>
          <label>Title<input value={linkTitle} onChange={(event) => setLinkTitle(event.target.value)} placeholder="Link title" /></label>
          <label>URL<input value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} placeholder="https://…" inputMode="url" /></label>
          <button className={styles.saveButton} type="button" onClick={() => void addLink()}>Save link</button>
        </div>}
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.entries}>
          {visibleEntries.length === 0 ? <p className={styles.empty}>Nothing saved here yet.</p> : visibleEntries.map((entry) => <article className={styles.entry} key={entry.id}>
            <div className={styles.entryText}>{entry.kind === "note" ? <button className={styles.noteTitle} type="button" onClick={() => setSelectedNote(entry)}>{entry.title}</button> : <strong>{entry.title}</strong>}{entry.kind === "file" && <span>{entry.fileName} · {entry.file ? `${Math.max(1, Math.round(entry.file.size / 1024))} KB` : ""}</span>}{entry.kind === "link" && <a href={entry.url} target="_blank" rel="noreferrer">{entry.url}</a>}</div>
            <div className={styles.entryActions}>{entry.kind === "file" && <button type="button" onClick={() => downloadEntry(entry)}>Download</button>}{deletePromptFor === entry.id ? <><input aria-label={`Password to delete ${entry.title}`} type="password" autoComplete="current-password" value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void removeEntry(entry.id); }} placeholder="Password" /><button type="button" onClick={() => void removeEntry(entry.id)}>Confirm</button><button type="button" onClick={() => { setDeletePromptFor(null); setDeletePassword(""); setError(""); }}>Cancel</button></> : <button type="button" onClick={() => { setDeletePromptFor(entry.id); setDeletePassword(""); setError(""); }}>Delete</button>}</div>
          </article>)}
        </div>
        {selectedNote && <div className={styles.noteOverlay} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedNote(null); }}>
          <article className={styles.notePopup} role="dialog" aria-modal="true" aria-labelledby="note-popup-title">
            <div className={styles.notePopupHead}><h3 id="note-popup-title">{selectedNote.title}</h3><button type="button" aria-label="Close note" onClick={() => setSelectedNote(null)}>×</button></div>
            <p>{selectedNote.body}</p>
          </article>
        </div>}
      </section>
    </div>
  ), document.body);
}
