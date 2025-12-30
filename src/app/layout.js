// app/layout.js or app/layout.tsx
"use client";
import { Provider } from "react-redux";
import { store } from "../Global_States/GlobalStore";
import Progress from "@/components/Nprogress";

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex font-serif antialiased w-full min-h-screen  text-white">
      
        <Provider store={store}>
          <Progress />
          <main className="flex-1 bg-slate-950 p-0 ">{children}</main>
        </Provider>
      </body>
    </html>
  );
}
