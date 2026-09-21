"use client";

import { useEffect } from "react";
import { getAttribution } from "@/lib/attribution";

/** Capture a entrada antes que a navegação interna remova os parâmetros de origem. */
export default function AttributionInitializer() {
  useEffect(() => {
    getAttribution();
  }, []);

  return null;
}
