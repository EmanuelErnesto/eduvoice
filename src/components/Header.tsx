import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NavLink } from "./ui/NavLink";
import { getAssetPath } from "@/utils/assets";

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <img
            src={getAssetPath("assets/logo.svg")}
            alt="EduVoice Logo"
            className="w-8 h-8"
            loading="eager"
          />
          EduVoice
        </Link>

        <div className="flex gap-4">
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
