'use client';
import { SessionProvider } from "@/hooks/useSession";
import "./globals.css";

export const metadata = {
  title: "Fast Vote",
  description: "Get opinions in real-time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <SessionProvider>
      <body className="dark">{children}</body>
    </SessionProvider>
      
    </html>
  );
}
