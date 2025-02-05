// utils/getImagePaths.ts
import fs from 'fs';
import path from 'path';

export default function getImagePaths(dir: string): string[] {
  const directoryPath = path.join(process.cwd(), dir);
  const filenames = fs.readdirSync(directoryPath);
  return filenames.map(filename => path.join(dir, filename));
}