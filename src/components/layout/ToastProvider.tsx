"use client";

import * as Toast from "@radix-ui/react-toast";
import type { ReactNode } from "react";

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <Toast.Provider swipeDirection="right" duration={5000}>
      {children}
      <Toast.Viewport className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 outline-none" />
    </Toast.Provider>
  );
}
