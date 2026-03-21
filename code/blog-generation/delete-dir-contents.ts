import { promises as fs } from "fs";
import * as path from "path";

async function deleteDirContents(dirPath: string): Promise<void> {
  const files = await fs.readdir(dirPath);
  await Promise.all(
    files.map(async (file) => {
      const currentPath = path.join(dirPath, file);
      const stats = await fs.stat(currentPath);
      if (stats.isDirectory()) {
        await deleteDirContents(currentPath);
        await fs.rmdir(currentPath);
      } else {
        await fs.unlink(currentPath);
      }
    }),
  );
}

export default deleteDirContents;
