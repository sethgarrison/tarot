#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Mapping from RWS1909 filenames to our naming convention
const renameMap = {
    // Cups
    'RWS1909_-_Cups_01.jpeg': 'ace_of_cups.jpg',
    'RWS1909_-_Cups_02.jpeg': 'two_of_cups.jpg',
    'RWS1909_-_Cups_03.jpeg': 'three_of_cups.jpg',
    'RWS1909_-_Cups_04.jpeg': 'four_of_cups.jpg',
    'RWS1909_-_Cups_05.jpeg': 'five_of_cups.jpg',
    'RWS1909_-_Cups_06.jpeg': 'six_of_cups.jpg',
    'RWS1909_-_Cups_07.jpeg': 'seven_of_cups.jpg',
    'RWS1909_-_Cups_08.jpeg': 'eight_of_cups.jpg',
    'RWS1909_-_Cups_09.jpeg': 'nine_of_cups.jpg',
    'RWS1909_-_Cups_10.jpeg': 'ten_of_cups.jpg',
    'RWS1909_-_Cups_11.jpeg': 'page_of_cups.jpg',
    'RWS1909_-_Cups_12.jpeg': 'knight_of_cups.jpg',
    'RWS1909_-_Cups_12 (1).jpeg': 'knight_of_cups.jpg', // Duplicate, will be skipped
    'RWS1909_-_Cups_13.jpeg': 'queen_of_cups.jpg',
    'RWS1909_-_Cups_14.jpeg': 'king_of_cups.jpg',
    
    // Pentacles
    'RWS1909_-_Pentacles_01.jpeg': 'ace_of_pentacles.jpg',
    'RWS1909_-_Pentacles_02.jpeg': 'two_of_pentacles.jpg',
    'RWS1909_-_Pentacles_03.jpeg': 'three_of_pentacles.jpg',
};

function renameImages() {
    const imagesDir = path.join(__dirname, '..', 'public', 'tarot-images');
    
    console.log('🔄 Starting to rename tarot images...\n');
    
    let renamedCount = 0;
    let skippedCount = 0;
    
    for (const [oldName, newName] of Object.entries(renameMap)) {
        const oldPath = path.join(imagesDir, oldName);
        const newPath = path.join(imagesDir, newName);
        
        if (fs.existsSync(oldPath)) {
            // Check if target file already exists
            if (fs.existsSync(newPath)) {
                console.log(`⏭️  Skipping ${oldName} -> ${newName} (target already exists)`);
                skippedCount++;
                continue;
            }
            
            try {
                fs.renameSync(oldPath, newPath);
                console.log(`✅ Renamed: ${oldName} -> ${newName}`);
                renamedCount++;
            } catch (error) {
                console.error(`❌ Failed to rename ${oldName}: ${error.message}`);
            }
        } else {
            console.log(`⚠️  File not found: ${oldName}`);
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 RENAME SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successfully renamed: ${renamedCount} files`);
    console.log(`⏭️  Skipped (already exists): ${skippedCount} files`);
    console.log('\n🎉 Rename process completed!');
}

if (require.main === module) {
    renameImages();
}

module.exports = { renameImages }; 