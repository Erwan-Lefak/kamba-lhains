const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
  'DSC_1459-Modifier.jpg',
  'DSC_1462.jpg',
  'DSC_1465.jpg',
  'DSC_1467.jpg',
  'DSC_1469.jpg',
  'DSC_1473.jpg',
  'DSC_1478.jpg',
  'DSC_1482.jpg',
  'DSC_1483.jpg',
  'DSC_1484.jpg'
];

async function cropImage(filename) {
  const inputPath = path.join(__dirname, 'public/images', filename);
  const outputPath = path.join(__dirname, 'public/images', `cropped_${filename}`);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Trim white/light gray borders (fuzz threshold for near-white colors)
    await image
      .trim({ threshold: 30 }) // Remove borders with colors close to white
      .toFile(outputPath);

    console.log(`✓ Cropped ${filename}`);
  } catch (error) {
    console.error(`✗ Error cropping ${filename}:`, error.message);
  }
}

async function cropAllImages() {
  console.log('Starting image cropping...\n');

  for (const image of images) {
    await cropImage(image);
  }

  console.log('\n✓ All images processed!');
}

cropAllImages();
