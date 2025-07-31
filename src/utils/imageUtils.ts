// Utility function to get the correct image path for the current environment
export const getImagePath = (imageName: string): string => {
  // Get the base path from the current location
  const basePath = import.meta.env.BASE_URL || '/';
  
  // Remove trailing slash if present
  const cleanBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  
  // Construct the full image path
  const imagePath = `${cleanBasePath}/tarot-images/${imageName.toLowerCase().replace(/\s+/g, '_')}.jpg`;
  
  // Debug logging (only in development)
  if (import.meta.env.DEV) {
    console.log(`Image path for "${imageName}": ${imagePath}`);
  }
  
  return imagePath;
};

// Utility function to check if an image exists
export const checkImageExists = async (imageName: string): Promise<boolean> => {
  try {
    const imagePath = getImagePath(imageName);
    const response = await fetch(imagePath, { method: 'HEAD' });
    
    // Debug logging (only in development)
    if (import.meta.env.DEV) {
      console.log(`Image exists check for "${imageName}": ${response.ok ? 'YES' : 'NO'}`);
    }
    
    return response.ok;
  } catch (error) {
    // Debug logging (only in development)
    if (import.meta.env.DEV) {
      console.log(`Image exists check failed for "${imageName}":`, error);
    }
    return false;
  }
}; 