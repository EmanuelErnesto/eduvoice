import React from "react";

interface PageTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({
  children,
  subtitle,
  className = "",
}) => {
  return (
    <section className={`text-center mb-16 mt-8 ${className}`}>
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        {children}
      </h1>
      {subtitle && (
        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </section>
  );
};
