import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "JANSAHAY — AI Public-Service Copilot",
  description:
    "Tell us your problem. JANSAHAY finds the path. AI-powered public service discovery, eligibility checking, document analysis, and journey tracking.",
  keywords: ["JANSAHAY", "public services", "AI copilot", "government schemes", "eligibility"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#f8faff] text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
