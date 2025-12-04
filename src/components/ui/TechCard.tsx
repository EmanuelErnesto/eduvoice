import React from "react";

interface TechCardProps {
  name: string;
  description: string;
}

export const TechCard: React.FC<TechCardProps> = ({ name, description }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-blue-500 transition-colors">
      <h3 className="font-semibold text-blue-400 mb-1">{name}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
};
