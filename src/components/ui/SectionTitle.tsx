import React from "react";

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  className = "",
}) => {
  return (
    <h2
      className={`text-3xl font-bold text-center mb-8 text-blue-400 ${className}`}
    >
      {children}
    </h2>
  );
};
