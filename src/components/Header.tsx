import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavLink } from "./ui/NavLink";
import { getAssetPath } from "@/utils/assets";

export const Header: React.FC = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ position: "fixed" }}
    >
      <nav className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-1.5 sm:gap-2 text-lg sm:text-xl md:text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <img
            src={getAssetPath("assets/logo.svg")}
            alt="EduVoice Logo"
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
            loading="eager"
          />
          <span className="hidden xs:inline">EduVoice</span>
          <span className="inline xs:hidden">Edu</span>
        </Link>

        <div className="flex gap-1.5 sm:gap-2 md:gap-4">
          <NavLink to="/" isActive={isActive("/")}>
            Início
          </NavLink>
          <NavLink to="/quiz" isActive={isActive("/quiz")}>
            Quiz
          </NavLink>
          <NavLink to="/equipe" isActive={isActive("/equipe")}>
            Equipe
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
