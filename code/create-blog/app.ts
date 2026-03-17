import createDir from "../blog-generation/create-dir.ts";
import createFile from "../blog-generation/create-file.ts";

const THUMBNAIL_TEMPLATE = `
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" fill="#ffcc00" />
    <circle cx="35" cy="40" r="5" fill="#000" />
    <circle cx="65" cy="40" r="5" fill="#000" />
    <path d="M30 60 Q50 80, 70 60" stroke="#000" stroke-width="3" fill="none" />
</svg>
`;

const postTemplate = (name: string) => `
  # ${name}

  Enter some post content here
`;

process.stdin.resume();
process.stdin.setEncoding("utf8");

console.log("What is the name of the post?");

// Read from stdin
process.stdin.on("data", (data) => {
  const name = (data as string).trim().replaceAll(" ", "-");
  process.stdin.pause();

  const timestamp = Date.now();

  const postPath = `./src/blog/post/${timestamp}_${name}`;

  createDir(postPath);

  createFile(`${postPath}/thumbnail.svg`, THUMBNAIL_TEMPLATE);
  createFile(`${postPath}/content.md`, postTemplate(name));
});
