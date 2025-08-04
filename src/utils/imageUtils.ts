// Utility function to get the correct image path for the current environment
export const getImagePath = (imageName: string): string => {
  const imagePath = `/tarot-images/${imageName.toLowerCase().replace(/\s+/g, '_')}.jpg`;
  return imagePath;
};

// Utility function to check if an image exists
export const checkImageExists = async (imageName: string): Promise<boolean> => {
  try {
    const imagePath = getImagePath(imageName);
    const response = await fetch(imagePath, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}; 