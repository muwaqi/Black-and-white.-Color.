import type { RenderQuality } from './types';

export const RENDER_QUALITIES: RenderQuality[] = [
  {
    id: 'natural',
    name: 'Natural',
    description: 'Realistic and subtle colors.',
    prompt: 'Colorize this black and white photo with natural, realistic colors. Aim for a faithful representation of how the scene would look in real life.'
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Rich and saturated colors.',
    prompt: 'Colorize this black and white photo with vibrant, rich, and slightly saturated colors. Make the image pop while maintaining a sense of realism.'
  },
  {
    id: 'enhance',
    name: 'AI Enhance',
    description: 'Improve quality and colorize.',
    prompt: 'Colorize this black and white photo with natural, realistic colors. At the same time, enhance the image quality by sharpening details, reducing noise and compression artifacts, and subtly improving the lighting and contrast. Aim for a faithful but higher-quality representation.'
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Artistic, movie-like tones.',
    prompt: 'Colorize this black and white photo with a cinematic feel. Apply artistic color grading, perhaps with warm highlights and cool shadows, to give it a dramatic, film-like quality.'
  },
  {
    id: 'surprise',
    name: 'Surprise Me!',
    description: 'Let the AI get creative.',
    prompt: 'Colorize this black and white photo with a surprising and artistic style. Be creative! You could choose a vintage look, a dreamy pastel palette, a dramatic cinematic tone, or something entirely unique. The goal is to create a beautiful and unexpected result.'
  }
];