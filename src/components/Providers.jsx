// app/providers.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "../Global_States/GlobalStore";
import Progress from "@/components/Nprogress";

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <Progress />
      {children}
    </Provider>
  );
}
