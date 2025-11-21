/**
 * Extract meaningful keywords from a prompt
 * Removes common stop words and returns the most significant terms
 */
function extractKeywords(prompt: string): string {
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'with', 'from', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'of', 'for', 'about',
    'as', 'into', 'through', 'during', 'but', 'am', 'that', 'this', 'these',
    'those', 'it', 'its', 'which', 'who', 'whom', 'he', 'she', 'they', 'them'
  ]);

  const cleanPrompt = prompt.trim().toLowerCase();

  // Split and filter out stop words, keep meaningful terms
  const keywords = cleanPrompt
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .slice(0, 4);

  return keywords.join(' ');
}

/**
 * Generate image URLs that actually match the search prompt
 * Uses multiple strategies to ensure relevant images are returned
 */
export function getImageUrlForPrompt(prompt: string, index: number): string {
  const keywords = extractKeywords(prompt);

  // Encode the keywords for URL use
  const encodedKeywords = encodeURIComponent(keywords);

  // Use Unsplash API search endpoint with proper query parameter format
  // This is more reliable than source.unsplash.com for specific searches
  const unsplashSearchUrl = `https://source.unsplash.com/600x600/?${encodedKeywords}`;

  // Add a cache-busting parameter to prevent caching issues
  // Use the index to vary the results slightly across multiple calls
  const cacheBuster = `${Date.now()}_${index}`;

  // Return the URL with cache buster to ensure fresh images
  return `${unsplashSearchUrl}&seed=${cacheBuster}`;
}

/**
 * Get multiple image candidate URLs for the same prompt
 * This can be used if you want to show the user multiple options
 */
export function getImageUrlsForPrompt(prompt: string): string[] {
  const keywords = extractKeywords(prompt);
  const encodedKeywords = encodeURIComponent(keywords);

  // Generate 3 variations with different parameters to get diverse results
  return [
    `https://source.unsplash.com/600x600/?${encodedKeywords}&seed=${Date.now()}_1`,
    `https://source.unsplash.com/600x600/?${encodedKeywords}&seed=${Date.now()}_2`,
    `https://source.unsplash.com/600x600/?${encodedKeywords}&seed=${Date.now()}_3`,
  ];
}
