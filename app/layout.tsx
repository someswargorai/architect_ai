import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/Providers/ReduxProvider";
import AuthProvider from "@/Providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import SessionProviders from "@/Providers/SessionProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Architect AI",
    template: "%s | AI System Design Studio",
  },
  description:
    "Design scalable system architectures visually using AI. Generate system design diagrams, nodes, and flows instantly with an intelligent canvas.",

  applicationName: "Architect AI",

  icons: {
    icon: "/og_image.png",
    shortcut: "/og_image.png",
    apple: "/og_image.png",
  },

  openGraph: {
    type: "website",
    title: "Architect AI",
    description:
      "Generate system design diagrams with AI. Visualize APIs, databases, queues, and services in an interactive canvas.",
    url: "https://architect-ai.seven.vercel.app",
    siteName: "Architect AI",
    images: [
      {
        url: "https://res.cloudinary.com/dpacclyw4/image/upload/v1769409502/og_image_rrnstk.png",
        width: 1200,
        height: 630,
        alt: "AI System Design Studio Preview",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "AI System Design Studio",
    description:
      "Design and visualize system architectures using AI-powered diagrams.",
    images: ["https://res.cloudinary.com/dpacclyw4/image/upload/v1769409502/og_image_rrnstk.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#000000" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       <Toaster position="bottom-right" />
        <ReduxProvider>
          <SessionProviders>{children}</SessionProviders>
        </ReduxProvider>
      </body>
    </html>
  );
}
