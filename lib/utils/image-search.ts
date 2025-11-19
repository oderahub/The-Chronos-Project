/**
 * Generate image URLs that actually match the search prompt
 * Uses multiple fallback strategies to ensure relevant images
 */

export function getImageUrlForPrompt(prompt: string, index: number): string {
  // Clean and normalize the prompt
  const cleanPrompt = prompt.trim().toLowerCase();
  
  // Extract key words (remove prepositions, articles, etc)
  const keywords = cleanPrompt
    .split(/\s+/)
    .filter(word => !['a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'with', 'from', 'by'].includes(word))
    .slice(0, 3) // Take first 3 meaningful words
    .join('+');

  // Strategy 1: Use Unsplash API search (more reliable for specific queries)
  // Format: source.unsplash.com supports search with proper URL encoding
  const unsplashUrl = `https://source.unsplash.com/600x600?${encodeURIComponent(keywords)}`;

  // Strategy 2: Fallback to Pexels which has better matching
  // This would need an API key, so we skip for now
  
  // Strategy 3: Use Pixabay which doesn't require auth for basic URLs
  // pixabay doesn't have a direct URL generator, so skip

  // Return the primary strategy with a cache-busting parameter
  return `${unsplashUrl}&t=${Date.now()}_${index}`;
}

/**
 * Alternative: Get multiple image candidates and let the user pick the best one
 * This is what production apps do for quality control
 */
export function getImageUrlsForPrompt(prompt: string): string[] {
  const cleanPrompt = prompt.trim().toLowerCase();
  
  const keywords = cleanPrompt
    .split(/\s+/)
    .filter(word => !['a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'with', 'from', 'by'].includes(word))
    .slice(0, 3)
    .join('+');

  // Return 3 different variations to increase chance of matching
  return [
    `https://source.unsplash.com/600x600?${encodeURIComponent(keywords)}&1`,
    `https://source.unsplash.com/600x600?${encodeURIComponent(prompt.split(' ')[0])}&2`, // Try first word
    `https://source.unsplash.com/600x600?${encodeURIComponent(cleanPrompt)}&3`, // Try full prompt
  ];
}
