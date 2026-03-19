import generatePostPages from "./generate-post-pages.ts";
import generateIndexes from "./generate-indexes.ts";
import deleteDirContents from "./delete-dir-contents.ts";
import copyFolderContents from "./copy-folder-contents.ts";
import generatePostInfo from "./generate-post-info.ts";
import {
  productionPath,
  sourcePath,
  blogProductionPath,
} from "./app-config.ts";

await deleteDirContents(productionPath);
await copyFolderContents(sourcePath, productionPath);
await deleteDirContents(blogProductionPath);

const postInfo = generatePostInfo();
await generatePostPages(postInfo);
await generateIndexes(postInfo);
