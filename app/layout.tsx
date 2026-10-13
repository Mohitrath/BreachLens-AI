import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BreachLens AI | Security Investigation",
  description: "Explainable security event correlation and incident triage."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}