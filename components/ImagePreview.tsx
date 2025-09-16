import React, { useState, useRef, useEffect } from 'react';
import { downloadBase64Image } from '../utils/fileUtils';

interface ImagePreviewProps {
  originalImage: string;
  colorizedImage: string | null;
  isLoading: boolean;
  onShare: () => void;
}

const LOADING_MESSAGES = [
    "Warming up the AI's paintbrushes...",
    "Analyzing shades of grey...",
    "Mixing the perfect digital colors...",
    "This can take a moment, great art needs patience!",
    "Unleashing the color spectrum...",
];

const LoadingSpinner: React.FC = () => {
    const [message, setMessage] = useState(LOADING_MESSAGES[0]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = LOADING_MESSAGES.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
                return LOADING_MESSAGES[nextIndex];
            });
        }, 2500);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center h-full bg-black/70 backdrop-blur-sm rounded-lg">
            <div className="flex space-x-2">
                <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <p className="mt-4 text-slate-300 font-semibold">{message}</p>
        </div>
    );
};

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const ShareIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);

export const ImagePreview: React.FC<ImagePreviewProps> = ({ originalImage, colorizedImage, isLoading, onShare }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSliderPosition(Number(e.target.value));
    };

    const handleMove = (clientX: number) => {
        if (!imageContainerRef.current) return;
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPosition(percent);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.buttons !== 1) return; // Only drag when left mouse button is pressed
        handleMove(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        handleMove(e.touches[0].clientX);
    };

    return (
        <div className="animate-fade-in">
            <div 
                ref={imageContainerRef}
                className="w-full max-w-3xl mx-auto aspect-square bg-black/20 rounded-lg shadow-inner relative overflow-hidden ring-1 ring-white/10 select-none group"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
            >
                {isLoading && <LoadingSpinner />}
                
                <img 
                    src={colorizedImage || originalImage} 
                    alt="Colorized result" 
                    className="w-full h-full object-contain pointer-events-none" 
                    draggable="false"
                />

                {colorizedImage && (
                    <>
                        <div 
                            className="absolute top-0 left-0 h-full w-full pointer-events-none" 
                            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                        >
                            <img 
                                src={originalImage} 
                                alt="Original" 
                                className="w-full h-full object-contain pointer-events-none"
                                draggable="false"
                            />
                        </div>

                        <div 
                            className="absolute top-0 h-full w-1 bg-white/50 group-hover:bg-white transition-colors duration-200 pointer-events-none" 
                            style={{ left: `${sliderPosition}%` }}
                        >
                            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white/50 group-hover:bg-white flex items-center justify-center shadow-lg transition-colors duration-200">
                                <svg className="w-5 h-5 text-gray-800 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
                            </div>
                        </div>

                        <input
                            type="range" min="0" max="100"
                            value={sliderPosition}
                            onChange={handleSliderChange}
                            className="absolute inset-0 w-full h-full cursor-ew-resize opacity-0"
                            aria-label="Before and after image slider"
                        />
                    </>
                )}

                {!isLoading && colorizedImage && (
                    <div className="absolute top-3 right-3 flex gap-2 animate-fade-in">
                        <button
                            onClick={onShare}
                            className="bg-black/50 hover:bg-black/75 text-white p-2 rounded-full shadow-md transition-all duration-200 backdrop-blur-md"
                            title="Share Image"
                            aria-label="Share colorized image"
                        >
                            <ShareIcon />
                        </button>
                        <button
                            onClick={() => downloadBase64Image(colorizedImage, `colorized-photo-${Date.now()}.png`)}
                            className="bg-black/50 hover:bg-black/75 text-white p-2 rounded-full shadow-md transition-all duration-200 backdrop-blur-md"
                            title="Download Image"
                            aria-label="Download colorized image"
                        >
                            <DownloadIcon />
                        </button>
                    </div>
                )}
            </div>
            {colorizedImage && (
                <div className="flex w-full max-w-3xl mx-auto justify-between text-sm font-semibold text-slate-300 mt-2 px-1">
                    <span>Original</span>
                    <span>Colorized</span>
                </div>
            )}
        </div>
    );
};