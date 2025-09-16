import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-400 animate-pulse-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const triggerFileInput = () => {
    document.getElementById('file-input')?.click();
  };
  
  return (
    <div 
        className={`group flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl transition-all duration-300 ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-white/20 bg-white/5'} hover:border-purple-400 hover:bg-purple-500/5 cursor-pointer`}
        style={{ transformStyle: 'preserve-3d' }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={triggerFileInput}
    >
      <div className="transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2" style={{ transform: 'translateZ(20px)' }}>
        <input
          id="file-input"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
        <UploadIcon />
      </div>
      <p className="mt-4 text-xl font-semibold text-slate-200" style={{ transform: 'translateZ(10px)' }}>Drag & drop your photo here</p>
      <p className="text-slate-400" style={{ transform: 'translateZ(10px)' }}>or</p>
      <button 
        type="button" 
        className="mt-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all transform hover:scale-105"
        style={{ transform: 'translateZ(10px)' }}
      >
        Browse Files
      </button>
      <p className="mt-4 text-xs text-slate-500" style={{ transform: 'translateZ(10px)' }}>Supports PNG, JPG, WEBP</p>
    </div>
  );
};