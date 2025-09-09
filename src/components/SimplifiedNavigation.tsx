"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import ProfileDropdown from "./layout/ProfileDropdown";

export default function SimplifiedNavigation() {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowMobileMenu(false);
    };

    if (showMobileMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showMobileMenu]);

  if (!user) return null;

  return (
    <nav
      className={`relative backdrop-blur-xl border-b shadow-sm sticky top-0 z-50 transition-colors duration-200 ${
        darkMode
          ? "bg-gray-900/90 border-gray-700"
          : "bg-white/90 border-slate-200/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div
          className={`md:hidden backdrop-blur-xl border-t transition-colors duration-200 ${
            darkMode
              ? "bg-gray-900/95 border-gray-700"
              : "bg-white/95 border-slate-200/50"
          }`}
        >
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Profile Dropdown */}
            <div className="pt-2 border-t border-gray-700">
              <ProfileDropdown
                darkMode={darkMode}
                onToggleDarkMode={toggleDarkMode}
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
