import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import { Instrument_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteNav } from "@/components/site-nav";
import { siteConfig } from "@/lib/site";
import { metadataKeywords } from "./metadata";
import Footer from "@/components/footer";
import "@/app/globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: metadataKeywords,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrumentSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SiteNav />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
