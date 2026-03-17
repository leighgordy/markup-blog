import * as fs from "fs";

const createFile = (path: string, content: string) =>
  fs.writeFileSync(path, content, { encoding: "utf8" });

export default createFile;
