import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '../src/lib/prisma';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadFile(filePath: string, folder: string): Promise<string> {
  const fileName = path.basename(filePath, path.extname(filePath));
  console.log(`Uploading ${fileName} to Cloudinary folder ${folder}...`);

  const result = await cloudinary.uploader.upload(filePath, {
    folder: `blue-commerce/${folder}`,
    public_id: fileName,
    overwrite: true,
    resource_type: 'image',
  });

  console.log(`Uploaded: ${result.secure_url}`);
  return result.secure_url;
}

async function main() {
  console.log('--- Starting Cloudinary Upload ---');
  const urlMap: Record<string, string> = {};

  // 1. Upload Products
  const productsDir = path.join(process.cwd(), 'public', 'assets', 'products');
  if (fs.existsSync(productsDir)) {
    const files = fs.readdirSync(productsDir);
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
        const fullPath = path.join(productsDir, file);
        const url = await uploadFile(fullPath, 'products');
        urlMap[`/assets/products/${file}`] = url;
      }
    }
  }

  // 2. Upload Categories
  const categoriesDir = path.join(process.cwd(), 'public', 'assets', 'categories');
  if (fs.existsSync(categoriesDir)) {
    const files = fs.readdirSync(categoriesDir);
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
        const fullPath = path.join(categoriesDir, file);
        const url = await uploadFile(fullPath, 'categories');
        urlMap[`/assets/categories/${file}`] = url;
      }
    }
  }

  // 3. Upload Banners & Placeholder
  const placeholderPath = path.join(process.cwd(), 'public', 'assets', 'placeholder-product.jpg');
  if (fs.existsSync(placeholderPath)) {
    const url = await uploadFile(placeholderPath, 'placeholders');
    urlMap['/assets/placeholder-product.jpg'] = url;
  }

  console.log('\n--- Upload Completed. Generated URL Map: ---');
  console.log(JSON.stringify(urlMap, null, 2));

  // 4. Update Database records matching relative URLs
  console.log('\n--- Updating Database Product and Category Image URLs ---');
  for (const [localUrl, remoteUrl] of Object.entries(urlMap)) {
    const productUpdate = await prisma.product.updateMany({
      where: { imageUrl: localUrl },
      data: { imageUrl: remoteUrl }
    });
    if (productUpdate.count > 0) {
      console.log(`Updated ${productUpdate.count} products from ${localUrl} -> ${remoteUrl}`);
    }

    const categoryUpdate = await prisma.category.updateMany({
      where: { imageUrl: localUrl },
      data: { imageUrl: remoteUrl }
    });
    if (categoryUpdate.count > 0) {
      console.log(`Updated ${categoryUpdate.count} categories from ${localUrl} -> ${remoteUrl}`);
    }
  }

  // Save url map to a json file for updating seed.ts
  fs.writeFileSync(
    path.join(process.cwd(), 'scripts', 'cloudinary-map.json'),
    JSON.stringify(urlMap, null, 2),
    'utf-8'
  );

  console.log('\nSaved cloudinary-map.json successfully!');
}

main()
  .catch((e) => {
    console.error('Error during upload:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
