import React from 'react';
import type { RenderQuality } from '../types';
import { RENDER_QUALITIES } from '../constants';

interface ControlsProps {
  onColorize: () => void;
  onClear: () => void;
  isLoading: boolean;
  isColorized: boolean;
  renderQuality: RenderQuality;
  setRenderQuality: (quality: RenderQuality) => void;
}

const MagicWandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);


export const Controls: React.FC<ControlsProps> = ({ onColorize, onClear, isLoading, isColorized, renderQuality, setRenderQuality }) => {

  return (
    <div className="space-y-6">
      <div className="text-center">
        <label className="block text-lg font-semibold text-slate-200 mb-3">Choose Colorization Style</label>
        <div className="relative inline-flex flex-wrap justify-center rounded-lg bg-black/20 p-1 border border-white/10">
          {RENDER_QUALITIES.map((quality) => (
            <button
              key={quality.id}
              type="button"
              onClick={() => setRenderQuality(quality)}
              className={`relative z-10 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 ${
                renderQuality.id === quality.id
                  ? 'text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {quality.name}
            </button>
          ))}
           <div 
             className="absolute top-1 bottom-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-md transition-all duration-300"
             style={{
               width: `calc((100% - 8px) / ${RENDER_QUALITIES.length})`,
               left: `calc(4px + ((100% - 8px) / ${RENDER_QUALITIES.length}) * ${RENDER_QUALITIES.findIndex(q => q.id === renderQuality.id)})`,
             }}
           />
        </div>
        <p className="text-sm text-slate-400 mt-2 h-4 transition-all duration-300">{renderQuality.description}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-white/10">
        <button
          onClick={onClear}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:bg-slate-700 hover:border-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Start Over
        </button>

        <button
          onClick={onColorize}
          disabled={isLoading}
          className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 disabled:opacity-60 disabled:cursor-wait transition-all transform hover:scale-105"
        >
          <MagicWandIcon/>
          {isLoading ? 'Colorizing...' : isColorized ? 'Colorize Again' : 'Colorize Photo'}
        </button>
      </div>
    </div>
  );
};