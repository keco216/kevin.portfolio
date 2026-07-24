import type { Metadata } from "next";
import { IBM_Plex_Mono, Mona_Sans, Syne } from "next/font/google";
import { CustomCursor } from "@/components/CustomCursor";
import { MotionProvider } from "@/components/MotionProvider";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kevincolic.vercel.app"),
  title: "Kevin Colic — IT-Techniker & Software Developer",
  description:
    "Portfolio von Kevin Colic: IT-Techniker und Software-Entwickler mit Fokus auf Self-Hosting, Infrastruktur und eigene Tools.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kevin Colic — IT-Techniker & Software Developer",
    description:
      "Self-Hosting, Infrastruktur und saubere Tools — Portfolio von Kevin Colic aus Österreich.",
    url: "/",
    siteName: "Kevin Colic",
    locale: "de_AT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kevin Colic — IT-Techniker & Software Developer",
    description:
      "Self-Hosting, Infrastruktur und saubere Tools — Portfolio von Kevin Colic aus Österreich.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${syne.variable} ${monaSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MotionProvider>{children}</MotionProvider>
        <CustomCursor />
      </body>
    </html>
  );
}
