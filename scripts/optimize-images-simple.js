const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../public/tarot-images');

function analyzeImages() {
  try {
    const files = fs.readdirSync(inputDir);
    const imageFiles = files.filter(file => 
      file.match(/\.(jpg|jpeg|png|webp)$/i)
    );

    console.log(`Found ${imageFiles.length} images to analyze...\n`);

    let totalSize = 0;
    const imageStats = [];

    for (const file of imageFiles) {
      const filePath = path.join(inputDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      totalSize += stats.size;
      
      imageStats.push({
        name: file,
        size: stats.size,
        sizeKB: sizeKB
      });
    }

    // Sort by size (largest first)
    imageStats.sort((a, b) => b.size - a.size);

    console.log('=== Image Analysis ===');
    console.log(`Total images: ${imageStats.length}`);
    console.log(`Total size: ${(totalSize / 1024 / 1024).toFixed(1)}MB`);
    console.log(`Average size: ${(totalSize / imageStats.length / 1024).toFixed(1)}KB\n`);

    console.log('=== Largest Images (Optimize These First) ===');
    imageStats.slice(0, 10).forEach((img, index) => {
      console.log(`${index + 1}. ${img.name}: ${img.sizeKB}KB`);
    });

    console.log('\n=== Optimization Recommendations ===');
    console.log('1. Use TinyPNG (https://tinypng.com/) to compress images');
    console.log('2. Convert to WebP format for better compression');
    console.log('3. Resize images to 400x600px maximum');
    console.log('4. Target file size: 50-100KB per image');
    console.log('5. Expected savings: 60-80% reduction in file size');

    console.log('\n=== Manual Steps ===');
    console.log('1. Go to https://tinypng.com/');
    console.log('2. Upload your tarot-images folder');
    console.log('3. Download the compressed images');
    console.log('4. Replace the original images with compressed versions');
    console.log('5. Consider converting to WebP format for even better compression');

  } catch (error) {
    console.error('Error analyzing images:', error);
  }
}

analyzeImages(); 