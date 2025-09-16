export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const downloadBase64Image = (base64Image: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = base64Image;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const base64ToBlob = async (base64: string): Promise<Blob> => {
    const response = await fetch(base64);
    const blob = await response.blob();
    return blob;
};

export const shareImage = async (base64Image: string, fileName: string): Promise<{ success: boolean; message: string }> => {
    try {
        const blob = await base64ToBlob(base64Image);
        const file = new File([blob], fileName, { type: blob.type });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: 'AI Colorized Photo',
                text: 'Check out this photo I colorized with this amazing AI app!',
                files: [file],
            });
            return { success: true, message: 'Image shared successfully!' };
        } else {
            // Fallback for browsers that don't support sharing, could open a new tab with the image
            // Or just inform the user. For now, we'll inform.
            return { success: false, message: 'Web Share is not supported on your browser.' };
        }
    } catch (error) {
        console.error('Error sharing image:', error);
        // User cancellation is not an error, so we check for it.
        if (error instanceof Error && error.name === 'AbortError') {
             return { success: false, message: 'Sharing cancelled.' };
        }
        return { success: false, message: 'An error occurred while trying to share the image.' };
    }
};