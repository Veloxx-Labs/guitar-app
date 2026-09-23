"use client";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

export async function initCapacitor(theme: "light" | "dark" = "dark") {
  if (!Capacitor.isNativePlatform()) {
    document.documentElement.style.setProperty("--safe-top", "0px");
    return;
  }

  // Initial fallback for native mobile so layout is immediately inset
  document.documentElement.classList.add("capacitor-native");
  document.documentElement.style.setProperty("--safe-top", "38px");

  try {
    const info = await StatusBar.getInfo();
    if (info && typeof info.height === "number" && info.height > 0) {
      document.documentElement.style.setProperty("--safe-top", `${info.height}px`);
    }

    // On dark theme, Style.Dark gives light status bar icons. On light theme, Style.Light gives dark icons.
    await StatusBar.setStyle({
      style: theme === "dark" ? Style.Dark : Style.Light,
    });
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
