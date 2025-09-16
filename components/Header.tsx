import React from 'react';

interface HeaderProps {
  hasImage: boolean;
}

export const Header: React.FC<HeaderProps> = ({ hasImage }) => {
  return (
    <header className="py-6">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          AI Photo Colorizer
        </h1>
        <p className="text-slate-300 mt-2 text-lg transition-opacity duration-500">
          {hasImage ? "Customize your creation below" : "Bring your black & white memories to life with Ai photo colorize"}
        </p>
      </div>
    </header>
  );
};