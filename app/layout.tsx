import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "SignalSentry AI | Security Operations", description: "Evidence-led cybersecurity threat detection and investigation dashboard." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
