const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../public/tarot-images');
const outputDir = path.join(__dirname, '../public/tarot-images-optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
  try {
    const files = fs.readdirSync(inputDir);
    const imageFiles = files.filter(file => 
      file.match(/\.(jpg|jpeg|png|webp)$/i)
    );

    console.log(`Found ${imageFiles.length} images to optimize...`);

    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;

    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
      
      const stats = fs.statSync(inputPath);
      totalOriginalSize += stats.size;

      console.log(`Optimizing ${file}...`);

      await sharp(inputPath)
        .resize(400, 600, { // Resize to reasonable dimensions
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ 
          quality: 80, // Good balance of quality and size
          effort: 6    // Higher compression effort
        })
        .toFile(outputPath);

      const optimizedStats = fs.statSync(outputPath);
      totalOptimizedSize += optimizedStats.size;

      const savings = ((stats.size - optimizedStats.size) / stats.size * 100).toFixed(1);
      console.log(`  ${file}: ${(stats.size / 1024).toFixed(1)}KB → ${(optimizedStats.size / 1024).toFixed(1)}KB (${savings}% smaller)`);
    }

    console.log('\n=== Optimization Summary ===');
    console.log(`Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(1)}MB`);
    console.log(`Total optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(1)}MB`);
    console.log(`Overall savings: ${((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1)}%`);
    console.log(`\nOptimized images saved to: ${outputDir}`);

  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages(); 