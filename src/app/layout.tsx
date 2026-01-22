import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Montserrat, Cairo } from "next/font/google";
import { Providers } from "@/components/providers/Providers";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: {
    default: "Career Studio | Discover Your Career Path",
    template: "%s | Career Studio",
  },
  description:
    "Explore 700+ careers and 500+ majors. Find your perfect path with bilingual (English/Arabic) career guidance designed for MENA students.",
  keywords: [
    "career guidance",
    "career exploration",
    "majors",
    "university",
    "MENA",
    "Saudi Arabia",
    "UAE",
    "bilingual",
    "Arabic",
    "career counseling",
    "student guidance",
  ],
  authors: [{ name: "Career Studio" }],
  creator: "Career Studio",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_SA",
    url: "https://careerstudio.com",
    siteName: "Career Studio",
    title: "Career Studio | Discover Your Career Path",
    description:
      "Explore 700+ careers and 500+ majors. Find your perfect path with bilingual career guidance.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Career Studio - Discover Your Career Path",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Studio | Discover Your Career Path",
    description:
      "Explore 700+ careers and 500+ majors. Find your perfect path with bilingual career guidance.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E2DBBE" },
    { media: "(prefers-color-scheme: dark)", color: "#071B33" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${cairo.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
