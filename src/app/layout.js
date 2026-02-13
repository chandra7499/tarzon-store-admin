// app/layout.tsx   (NO "use client")

import { Providers } from "../components/Providers";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex font-serif antialiased   min-h-screen text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
