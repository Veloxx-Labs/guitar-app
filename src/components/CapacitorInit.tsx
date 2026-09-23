"use client";
import { useEffect } from "react";
import { initCapacitor } from "@/lib/capacitor/init";

export default function CapacitorInit() {
  useEffect(() => {
    initCapacitor();
  }, []);
  return null;
}
