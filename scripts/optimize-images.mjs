import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function findImages(dir, fileList = []) {
  // Skip low and medium folders to avoid infinite loops and re-processing
  if (dir.endsWith(path.sep + 'low') || dir.endsWith(path.sep + 'medium')) {
    return fileList;
  }

  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      await findImages(fullPath, fileList);
    } else {
      const ext = path.extname(file.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        fileList.push(fullPath);
      }
    }
  }

  return fileList;
}

async function processImages() {
  const images = await findImages(PUBLIC_DIR);
  console.log(`Found ${images.length} images to process in public directory.`);

  for (const sourcePath of images) {
    const dir = path.dirname(sourcePath);
    const fileName = path.basename(sourcePath);
    const fileNameWithoutExt = path.parse(fileName).name;
    const destName = `${fileNameWithoutExt}.webp`;

    const lowDir = path.join(dir, 'low');
    const mediumDir = path.join(dir, 'medium');

    await ensureDir(lowDir);
    await ensureDir(mediumDir);

    const lowPath = path.join(lowDir, destName);
    const mediumPath = path.join(mediumDir, destName);

    // Skip if they already exist to save time
    try {
        await fs.access(lowPath);
        await fs.access(mediumPath);
        console.log(`Skipping (already optimized): ${fileName}`);
        continue;
    } catch {
        // One or both files missing, proceed to process
    }

    console.log(`Processing: ${sourcePath}`);

    try {
      // Generate Low Quality (Mobile) - 640px wide
      await sharp(sourcePath, { failOn: 'none' })
        .resize(640, null, { withoutEnlargement: true })
        .webp({ quality: 60 })
        .toFile(lowPath);
        
      // Generate Medium Quality (Laptop) - 1200px wide
      await sharp(sourcePath, { failOn: 'none' })
        .resize(1200, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(mediumPath);
    } catch (e) {
      console.error(`Failed to process ${sourcePath}`, e);
    }
  }

  console.log('All images processed successfully.');
}

processImages().catch(console.error);
