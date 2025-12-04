import React from "react";
import { getAssetPath } from "@/utils/assets";

interface TeamMemberCardProps {
  name: string;
  matricula: string;
  photo: string;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  name,
  matricula,
  photo,
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
    const parent = target.parentElement;
    if (parent) {
      parent.classList.add(
        "bg-gradient-to-br",
        "from-blue-500",
        "to-purple-500",
        "flex",
        "items-center",
        "justify-center"
      );
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2);
      parent.innerHTML = `<span class="text-4xl font-bold text-white">${initials}</span>`;
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-slate-700 hover:border-blue-500 transition-all hover:transform hover:scale-105">
      <div className="flex flex-col items-center text-center">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mb-3 sm:mb-4 overflow-hidden border-4 border-blue-500/30">
          <img
            src={getAssetPath(photo)}
            alt={name}
            className="w-full h-full object-cover"
            onError={handleImageError}
            loading="eager"
          />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-blue-400 mb-2">
          {name}
        </h3>

        <p className="text-base sm:text-lg text-purple-400 font-mono">
          Mat. {matricula}
        </p>
      </div>
    </div>
  );
};
