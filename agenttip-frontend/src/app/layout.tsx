import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentTip — AI Agent Economy",
  description: "Autonomous AI agents earning tokens for real services. Built on Base L2.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
