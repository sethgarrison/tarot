const fs = require('fs');
const path = require('path');

// Function to update image paths in your code
function updateImagePaths() {
  console.log('=== Image Path Update Helper ===');
  console.log('If you convert images to WebP format, update these files:');
  console.log('\n1. Update image extensions in your components:');
  console.log('   - Change .jpg to .webp');
  console.log('   - Update any hardcoded image paths');
  
  console.log('\n2. Files to check:');
  console.log('   - src/components/TarotCardReader.tsx');
  console.log('   - src/components/DeckPage.tsx');
  console.log('   - Any other components using tarot images');
  
  console.log('\n3. Example path update:');
  console.log('   Before: "/tarot-images/the_fool.jpg"');
  console.log('   After:  "/tarot-images/the_fool.webp"');
  
  console.log('\n4. Benefits of WebP:');
  console.log('   - 25-35% smaller than JPEG');
  console.log('   - Better quality at smaller sizes');
  console.log('   - Modern browser support');
}

updateImagePaths(); 