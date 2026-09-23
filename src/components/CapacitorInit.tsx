"use client";
import { useEffect } from "react";
import { initCapacitor } from "@/lib/capacitor/init";
import { useTheme } from "./ThemeProvider";

export default function CapacitorInit() {
  const { theme } = useTheme();

  useEffect(() => {
    initCapacitor(theme);
  }, [theme]);

  return null;
}
