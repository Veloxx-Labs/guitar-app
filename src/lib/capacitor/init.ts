"use client";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

export async function initCapacitor() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await StatusBar.setOverlaysWebView({ overlay: false });
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: "#faf9f5" });
  } catch (e) {
    console.warn("StatusBar init failed", e);
  }
}

export function isNative() {
  return Capacitor.isNativePlatform();
}

export function platform() {
  return Capacitor.getPlatform(); // "android" | "ios" | "web"
}
