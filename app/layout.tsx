import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "./components/nav-bar";

export const metadata: Metadata = {
  title: "ARTICLE REVIEW SYSTEM",
  description: "Brutalist article review platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}