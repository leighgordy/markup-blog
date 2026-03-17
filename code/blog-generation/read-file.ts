import * as fs from "fs";

const readFile = (filePath: string): string => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return data;
  } catch (error) {
    console.error("Error reading file:", error);
    return "";
  }
};

export default readFile;
