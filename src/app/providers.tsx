"use client";

import { PropsWithChildren, useEffect } from "react";
import analytics from "@/services/analytics";

export function PHProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    analytics.ensureInitialized();
  }, []);

  return children;
}
