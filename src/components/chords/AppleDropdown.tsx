"use client";

import React, { useState, useRef, useEffect } from "react";

export interface DropdownOption {
  value: string;
  label: string;
  shortLabel?: string;
}

interface AppleDropdownProps {
  label: string;
  headerTitle: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  align?: "left" | "center" | "right";
  className?: string;
}

export const AppleDropdown: React.FC<AppleDropdownProps> = ({
  label,
  headerTitle,
  value,
  options,
  onChange,
  align = "left",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];
  const displayLabel = selectedOption?.shortLabel || selectedOption?.label || value;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Scroll active item into view when opening
  useEffect(() => {
    if (isOpen && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  // Determine popover position class based on align prop
  const alignClass =
    align === "right"
      ? "right-0 origin-top-right"
      : align === "center"
      ? "left-1/2 -translate-x-1/2 origin-top"
      : "left-0 origin-top-left";

  return (
    <div ref={dropdownRef} className={`relative flex flex-col flex-1 min-w-0 ${className}`}>
      {/* Category header above */}
      <span className="text-[11px] font-semibold text-[#8E8E93] dark:text-[#98989D] uppercase tracking-[0.5px] px-1 mb-1 truncate select-none">
        {label}
      </span>

      {/* Trigger Button (Apple Menu Button) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between bg-[#767680]/12 dark:bg-[#767680]/24 hover:bg-[#767680]/18 dark:hover:bg-[#767680]/32 active:scale-[0.98] text-[#000000] dark:text-[#FFFFFF] text-[13.5px] sm:text-[14.5px] font-semibold tracking-[-0.2px] rounded-[13px] px-2.5 sm:px-3 py-2 sm:py-2.5 border transition-all duration-150 text-left select-none ${
          isOpen
            ? "border-[#007AFF] ring-1 ring-[#007AFF]"
            : "border-black/[0.06] dark:border-white/[0.08]"
        }`}
      >
        <span className="truncate pr-1 leading-tight">{displayLabel}</span>
        {/* Apple SF Symbol chevron.up.chevron.down */}
        <div className="text-[#8E8E93] shrink-0 opacity-80">
          <svg width="9" height="13" viewBox="0 0 10 14" fill="currentColor">
            <path d="M5 2.5L8.5 6C8.8 6.3 9.2 6.3 9.5 6C9.8 5.7 9.8 5.3 9.5 5L5.5 1C5.2 0.7 4.8 0.7 4.5 1L0.5 5C0.2 5.3 0.2 5.7 0.5 6C0.8 6.3 1.2 6.3 1.5 6L5 2.5Z" />
            <path d="M5 11.5L1.5 8C1.2 7.7 0.8 7.7 0.5 8C0.2 8.3 0.2 8.7 0.5 9L4.5 13C4.8 13.3 5.2 13.3 5.5 13L9.5 9C9.8 8.7 9.8 8.3 9.5 8C9.2 7.7 8.8 7.7 8.5 8L5 11.5Z" />
          </svg>
        </div>
      </button>

      {/* Apple Custom Dropdown Popover (Exact match to user reference image) */}
      {isOpen && (
        <div
          className={`absolute top-[calc(100%+6px)] ${alignClass} w-[200px] sm:w-[220px] max-w-[240px] bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-2xl rounded-[18px] border border-black/[0.08] dark:border-white/[0.12] shadow-[0_16px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100`}
        >
          {/* Header at top (e.g. 'extension', 'chord type', 'root note') */}
          <div className="py-2 px-3 text-center border-b border-[#3C3C43]/10 dark:border-[#545458]/25 bg-black/[0.01] dark:bg-white/[0.02]">
            <span className="text-[12px] font-normal text-[#8E8E93] dark:text-[#98989D] select-none lowercase">
              {headerTitle}
            </span>
          </div>

          {/* List items with dividers and checkmark on selected item */}
          <div className="max-h-[260px] overflow-y-auto overscroll-contain divide-y divide-[#3C3C43]/10 dark:divide-[#545458]/20 scrollbar-thin">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  ref={isSelected ? activeItemRef : null}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full px-3.5 py-2.5 flex items-center text-left text-[14px] sm:text-[14.5px] transition-colors select-none cursor-pointer ${
                    isSelected
                      ? "text-[#FF3B30] dark:text-[#FF453A] font-semibold bg-[#FF3B30]/[0.05] dark:bg-[#FF453A]/[0.08]"
                      : "text-[#000000] dark:text-[#FFFFFF] font-normal hover:bg-black/[0.04] dark:hover:bg-white/[0.06] active:bg-black/[0.08]"
                  }`}
                >
                  {/* Left: Red Checkmark for selected item, or empty spacer for alignment */}
                  <span className="w-5 shrink-0 flex items-center">
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-[#FF3B30] dark:text-[#FF453A]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  <span className="truncate">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
