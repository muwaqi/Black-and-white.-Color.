import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { Controls } from './components/Controls';
import { ImagePreview } from './components/ImagePreview';
import { Footer } from './components/Footer';
import { ErrorDisplay } from './components/ErrorDisplay';
import { colorizeImageWithGemini } from './services/geminiService';
import type { RenderQuality } from './types';
import { RENDER_QUALITIES } from './constants';
import { fileToBase64, shareImage } from './utils/fileUtils';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<{ file: File; base64: string } | null>(null);
  const [colorizedImage, setColorizedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [renderQuality, setRenderQuality] = useState<RenderQuality>(RENDER_QUALITIES[0]);

  const handleImageUpload = async (file: File) => {
    setError(null);
    setColorizedImage(null);
    try {
      const base64 = await fileToBase64(file);
      setOriginalImage({ file, base64 });
    } catch (err) {
      setError('Failed to read the image file. Please try another one.');
      setOriginalImage(null);
    }
  };

  const handleColorize = useCallback(async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);
    // Keep previous colorized image during loading for a smoother experience if re-colorizing
    // setColorizedImage(null); 

    try {
      const result = await colorizeImageWithGemini(originalImage.base64, renderQuality.prompt);
      setColorizedImage(result);
    } catch (err) {
      console.error(err);
      setError('Failed to colorize image. The AI may be busy, or the image format might not be supported. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, renderQuality]);

  const handleShare = useCallback(async () => {
    if (!colorizedImage) return;
    setError(null);
    const result = await shareImage(colorizedImage, `colorized-photo-${Date.now()}.png`);
    if (!result.success && result.message !== 'Sharing cancelled.') {
        setError(result.message); // Use the existing error display for share errors
    }
  }, [colorizedImage]);

  const handleClear = () => {
    setOriginalImage(null);
    setColorizedImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header hasImage={!!originalImage} />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex items-center justify-center">
        <div 
          className="w-full max-w-5xl bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-purple-500/10 p-6 md:p-10 space-y-8 animate-intro-fade-in-up" 
          style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
        >
          {!originalImage ? (
            <ImageUploader onImageUpload={handleImageUpload} />
          ) : (
            <>
              <ImagePreview 
                originalImage={originalImage.base64} 
                colorizedImage={colorizedImage} 
                isLoading={isLoading}
                onShare={handleShare}
              />
              <ErrorDisplay message={error} />
              <Controls 
                onColorize={handleColorize}
                onClear={handleClear}
                isLoading={isLoading}
                isColorized={!!colorizedImage}
                renderQuality={renderQuality}
                setRenderQuality={setRenderQuality}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;