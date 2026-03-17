import * as fs from "fs";

const createDir = (directoryPath: string) =>
  fs.mkdirSync(directoryPath, { recursive: true });

export default createDir;
