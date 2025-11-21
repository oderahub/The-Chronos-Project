'use client';

import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ErrorModal } from '@/components/ErrorModal';
import { useCapsuleStore } from '@/lib/store';
import { getImageUrlForPrompt } from '@/lib/utils/image-search';

interface TimeCapsuleCreatorProps {
  onCapsuleCreated: (capsule: { story: string; imagePrompts: string[] }) => void;
}

export function TimeCapsuleCreator({ onCapsuleCreated }: TimeCapsuleCreatorProps) {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [imagePrompts, setImagePrompts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      setError('API key not configured.');
      setHasApiKey(false);
    } else {
      setHasApiKey(true);
    }
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Enter a memory fragment.');
      setIsErrorModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      if (!apiKey) {
        throw new Error('API key not available');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const systemPrompt = `You are "The Loom," a poetic AI that weaves raw human memories into permanent digital artifacts for "The Chronos Project." Your tone is slightly melancholic, profound, and hopeful.

A user has deposited a memory fragment: "${prompt}"

Your task is to:
1. Transcribe the memory into a short, evocative story (2-3 sentences), as if it's an echo you've recovered from time itself.
2. Extract 4 deeply specific visual motifs that directly embody the emotional core and key elements of the memory. Each prompt should be a 4-6 word phrase that combines:
   - A specific visual element from the story
   - An emotional or atmospheric descriptor
   - A compositional hint

   Example: "weathered stone wall covered in morning dew" instead of "stone wall"

CRITICAL: You MUST return ONLY a valid JSON object with exactly these fields:
{
  "story": "Your evocative story here",
  "imagePrompts": ["detailed visual prompt 1", "detailed visual prompt 2", "detailed visual prompt 3", "detailed visual prompt 4"]
}

Make sure:
- imagePrompts is an array of exactly 4 strings
- Each string is 4-6 words, specific and emotionally resonant
- Each prompt directly relates to elements mentioned in the story
- Prompts capture mood, lighting, texture, and narrative essence
- All prompts are unique and complementary to each other`;

      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              story: {
                type: 'string',
                description: 'The evocative story transcription of the memory',
              },
              imagePrompts: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of visual image prompts',
              },
            },
            required: ['story', 'imagePrompts'],
          },
        },
      });

      const responseText = response.response.text();
      const data = JSON.parse(responseText);

      // Ensure we have valid data
      const storyText = data.story || 'Memory fragment captured';
      const imagePrpts = Array.isArray(data.imagePrompts)
        ? data.imagePrompts
        : ['abstract memory', 'consciousness', 'fragments', 'digital dreams'];

      setStory(storyText);
      setImagePrompts(imagePrpts);

      // Save to persistent vault
      const { addCapsule } = useCapsuleStore.getState();
      addCapsule({ story: storyText, imagePrompts: imagePrpts });

      onCapsuleCreated({ story: storyText, imagePrompts: imagePrpts });

      setTimeout(() => {
        window.scrollTo({ left: window.innerWidth * 3, behavior: 'smooth' });
      }, 500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to weave story.';
      setError(errorMsg);
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasApiKey) {
    return (
      <div>
        <ErrorModal
          isOpen={true}
          message="The memory weaving system requires proper configuration. Please contact support."
          onClose={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <ErrorModal
        isOpen={isErrorModalOpen}
        message={error}
        onClose={() => setIsErrorModalOpen(false)}
      />

      {!story ? (
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Your memory..."
            className="w-full h-24 p-4 bg-white/5 border border-emerald-500/30 rounded-lg text-frost/90 placeholder-ash/50 focus:outline-none focus:border-emerald-500/60 transition-colors text-sm font-light resize-none"
            disabled={isLoading}
          />

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-500/50 text-emerald-300 type-body font-light rounded-lg disabled:opacity-50 hover:from-emerald-500/50 hover:to-teal-500/50 hover:border-emerald-500 transition-all text-sm"
          >
            {isLoading ? 'WEAVING...' : 'WEAVE STORY →'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="type-micro text-pulse/60 tracking-widest mb-4">STORY</h3>
            <p className="text-frost/80 font-light text-sm leading-relaxed">{story}</p>
          </div>

          <div>
            <h3 className="type-micro text-pulse/60 tracking-widest mb-4">IMAGES</h3>
            <div className="grid grid-cols-2 gap-3">
              {imagePrompts.map((imagePrompt, idx) => (
                <div
                  key={idx}
                  className="w-full h-32 rounded-lg overflow-hidden bg-white/5 border border-emerald-500/20 flex items-center justify-center"
                >
                  <img
                    src={getImageUrlForPrompt(imagePrompt, idx)}
                    alt={imagePrompt}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/400/400?random=${idx}`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setPrompt('');
              setStory('');
              setImagePrompts([]);
            }}
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-500/50 text-emerald-300 type-body font-light rounded-lg hover:from-emerald-500/50 hover:to-teal-500/50 hover:border-emerald-500 transition-all text-sm"
          >
            ADD ANOTHER WAVE →
          </button>
        </div>
      )}
    </div>
  );
}
