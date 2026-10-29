import type { Metadata, Viewport } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "G. Sunil Kumar Reddy — Backend & Software Engineer",
  description:
    "The engineering portfolio of G. Sunil Kumar Reddy: backend development, APIs, practical software projects, and systems thinking.",
  openGraph: {
    title: "G. Sunil Kumar Reddy — The Engineer Behind the Systems",
    description:
      "A computer science student building practical software and exploring the systems beneath it.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "G. Sunil Kumar Reddy — Backend & Software Engineer",
    description: "Practical software, backend systems, and engineering in progress.",
  },
};

export const viewport: Viewport = {
  themeColor: "#080a0f",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
