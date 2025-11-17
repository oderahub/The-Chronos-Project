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
      setError('Please enter a memory fragment.');
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
        window.scrollTo({ left: window.innerWidth * 2, behavior: 'smooth' });
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to weave story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasApiKey) {
    return (
      <div className="text-center p-8">
        <p className="text-danger type-body">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {!story ? (
        <div className="space-y-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Deposit your memory fragment here..."
            className="w-full h-32 p-4 bg-white/5 border border-frost/20 rounded-lg text-frost type-body placeholder-ash focus:outline-none focus:border-frost/50 transition-colors"
            disabled={isLoading}
          />
          {error && <p className="text-danger type-body">{error}</p>}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-pulse text-pure type-body font-medium rounded-lg hover:bg-pulse-dim disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">◆</span> Weaving...
              </span>
            ) : (
              'Weave Story →'
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="type-micro text-pulse mb-3">CAPSULE ENTRY</h3>
            <p className="type-body text-frost leading-relaxed">{story}</p>
          </div>

          <div>
            <h3 className="type-micro text-pulse mb-4">VISUAL TAPESTRY</h3>
            <div className="grid grid-cols-2 gap-3">
              {imagePrompts.map((imagePrompt, idx) => (
                <img
                  key={idx}
                  src={`https://source.unsplash.com/random/400x400/?${encodeURIComponent(imagePrompt)}`}
                  alt={imagePrompt}
                  className="w-full h-40 object-cover rounded-lg opacity-90 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
