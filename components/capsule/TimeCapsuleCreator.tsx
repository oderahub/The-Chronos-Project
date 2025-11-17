'use client';

import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface TimeCapsuleCreatorProps {
  onCapsuleCreated: (capsule: { story: string; imagePrompts: string[] }) => void;
}

export function TimeCapsuleCreator({ onCapsuleCreated }: TimeCapsuleCreatorProps) {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('');
  const [imagePrompts, setImagePrompts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      setError('API key not configured. Please set NEXT_PUBLIC_API_KEY.');
      setHasApiKey(false);
    } else {
      setHasApiKey(true);
    }
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Enter a memory fragment to preserve.');
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

      const systemPrompt = `You are "The Loom," a poetic AI that weaves raw human memories into permanent digital artifacts for "The Chronos Project." Your tone is slightly melancholic, profound, and hopeful. A user has deposited a memory fragment. Your task is to: 1. Transcribe the memory into a short, evocative story, as if it's an echo you've recovered. 2. Extract 3-4 key visual motifs and output them as concise image prompts. User's memory fragment: "${prompt}". Return your response in this JSON format: { "story": "evocative story text here", "imagePrompts": ["prompt 1", "prompt 2", "prompt 3", "prompt 4"] }`;

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

      setStory(data.story);
      setImagePrompts(data.imagePrompts);
      onCapsuleCreated(data);

      // Scroll to the final section
      setTimeout(() => {
        window.scrollTo({ left: window.innerWidth * 3, behavior: 'smooth' });
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to weave story. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasApiKey) {
    return (
      <div className="text-center p-8">
        <p className="text-danger type-body font-light">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!story ? (
        <div className="space-y-6">
          <div className="relative group">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Your memory fragment..."
              className="w-full h-32 p-5 bg-white/5 border border-pulse/30 rounded-lg text-frost/90 type-body placeholder-ash/50 focus:outline-none focus:border-pulse/60 focus:bg-white/10 transition-all duration-300 resize-none font-light"
              disabled={isLoading}
            />
            <div className="absolute inset-0 border border-pulse/0 rounded-lg pointer-events-none group-hover:border-pulse/30 transition-colors duration-300" />
          </div>

          {error && (
            <div className="p-4 bg-danger/10 border border-danger/40 rounded-lg">
              <p className="text-danger/90 type-body text-sm font-light">{error}</p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full px-6 py-4 bg-gradient-to-r from-pulse to-pulse-dim text-frost type-body font-light rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group relative overflow-hidden hover:shadow-2xl hover:shadow-pulse/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <span className="relative flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <span className="animate-spin inline-block">◆</span> WEAVING...
                </>
              ) : (
                'WEAVE STORY →'
              )}
            </span>
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="type-micro text-pulse/80 tracking-widest">CAPSULE ENTRY</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-pulse/40 to-transparent" />
            </div>
            <p className="type-body text-frost/90 leading-relaxed text-sm font-light">{story}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="type-micro text-pulse/80 tracking-widest">VISUAL ESSENCE</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-pulse/40 to-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {imagePrompts.map((imagePrompt, idx) => (
                <div key={idx} className="group/image relative overflow-hidden rounded-lg aspect-square animate-float" style={{ animationDelay: `${idx * 100}ms` }}>
                  <img
                    src={`https://source.unsplash.com/random/400x400/?${encodeURIComponent(imagePrompt)}`}
                    alt={imagePrompt}
                    className="w-full h-full object-cover opacity-75 group-hover/image:opacity-100 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 border border-pulse/30 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
