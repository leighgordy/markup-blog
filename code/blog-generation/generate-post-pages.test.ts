import assert from "node:assert";
import {
  describe,
  test,
  mock,
  beforeEach,
  afterEach,
  type Mock,
} from "node:test";
import { type PostInfo } from "./types.ts";

describe("Test generate-post-pages.ts", async () => {
  const readFileMock = mock.fn() as Mock<(path: string) => String>;
  const createDirMock = mock.fn() as Mock<(path: string) => void>;
  const createFileMock = mock.fn() as Mock<(path: string) => void>;
  const deleteFileMock = mock.fn() as Mock<(path: string) => void>;
  const copyFolderContentsMock = mock.fn() as Mock<
    (from: string, too: string) => Promise<void>
  >;
  const createPostPageMock = mock.fn() as Mock<(path: string) => String>;

  let readFileContext: any;
  let createDirContext: any;
  let createFileContext: any;
  let deleteFileContext: any;
  let copyFolderContentsContext: any;
  let createPostPageContext: any;
  let appConfigContext: any;

  beforeEach(async () => {
    readFileMock.mock.mockImplementation((path: string) => {
      if (path.endsWith("page.html")) return "<html>Template</html>";
      if (path.endsWith("content.md")) return "# Post Content";
      return "";
    });
    createDirMock.mock.mockImplementation(() => {});
    createFileMock.mock.mockImplementation(() => {});
    deleteFileMock.mock.mockImplementation(() => {});
    copyFolderContentsMock.mock.mockImplementation(() => Promise.resolve());
    createPostPageMock.mock.mockImplementation(() => "<html>Page</html>");

    readFileContext = mock.module("./read-file.ts", {
      defaultExport: readFileMock,
    });
    createDirContext = mock.module("./create-dir.ts", {
      defaultExport: createDirMock,
    });
    createFileContext = mock.module("./create-file.ts", {
      defaultExport: createFileMock,
    });
    deleteFileContext = mock.module("./delete-file.ts", {
      defaultExport: deleteFileMock,
    });
    copyFolderContentsContext = mock.module("./copy-folder-contents.ts", {
      defaultExport: copyFolderContentsMock,
    });
    createPostPageContext = mock.module("./create-post-page.ts", {
      defaultExport: createPostPageMock,
    });
    appConfigContext = mock.module("./app-config.ts", {
      namedExports: {
        postSourcePath: "./src/blog/post",
        blogProductionPath: "./dist/blog",
        postPageTemplate: "./src/blog/post/post.html",
      },
    });
  });

  afterEach(() => {
    if (readFileContext) readFileContext.restore();
    if (createDirContext) createDirContext.restore();
    if (createFileContext) createFileContext.restore();
    if (deleteFileContext) deleteFileContext.restore();
    if (copyFolderContentsContext) copyFolderContentsContext.restore();
    if (createPostPageContext) createPostPageContext.restore();
    if (appConfigContext) appConfigContext.restore();
    readFileMock.mock.resetCalls();
    createDirMock.mock.resetCalls();
    createFileMock.mock.resetCalls();
    deleteFileMock.mock.resetCalls();
    copyFolderContentsMock.mock.resetCalls();
    createPostPageMock.mock.resetCalls();
    mock.restoreAll();
  });

  test("Ensure post template is read once", async () => {
    const posts: PostInfo[] = [
      {
        name: "Post 1",
        fileName: "post1",
        creationDate: new Date("2023-01-01"),
        blogDirectory: "./dist/blog/2023-1-1-0-0-0",
        dateDirectory: "2023-1-1-0-0-0",
        directory: "1672531200000_post1",
        blogPage: "./dist/blog/2023-1-1-0-0-0/post1.html",
        blogUrl: "/posts/2023-1-1-0-0-0/post1.html",
      },
      {
        name: "Post 2",
        fileName: "post2",
        creationDate: new Date("2023-01-02"),
        blogDirectory: "./dist/blog/2023-1-2-0-0-0",
        dateDirectory: "2023-1-2-0-0-0",
        directory: "1672617600000_post2",
        blogPage: "./dist/blog/2023-1-2-0-0-0/post2.html",
        blogUrl: "/posts/2023-1-2-0-0-0/post2.html",
      },
    ];

    const testee = await import("./generate-post-pages.ts");
    await testee.default(posts);

    assert.strictEqual(readFileMock.mock.callCount(), 3); // template + 2 content.md files
    assert.strictEqual(
      readFileMock.mock.calls[0].arguments[0],
      "./src/blog/post/post.html",
    );
  });

  test("Ensure directories are created for each post", async () => {
    const posts: PostInfo[] = [
      {
        name: "Post 1",
        fileName: "post1",
        creationDate: new Date("2023-01-01"),
        blogDirectory: "./dist/blog/2023-1-1-0-0-0",
        dateDirectory: "2023-1-1-0-0-0",
        directory: "1672531200000_post1",
        blogPage: "./dist/blog/2023-1-1-0-0-0/post1.html",
        blogUrl: "/posts/2023-1-1-0-0-0/post1.html",
      },
    ];

    const testee = await import("./generate-post-pages.ts");
    await testee.default(posts);

    assert.strictEqual(createDirMock.mock.callCount(), 1);
    assert.strictEqual(
      createDirMock.mock.calls[0].arguments[0],
      "./dist/blog/2023-1-1-0-0-0",
    );
  });

  test("Ensure post pages are created for each post", async () => {
    const posts: PostInfo[] = [
      {
        name: "Post 1",
        fileName: "post1",
        creationDate: new Date("2023-01-01"),
        blogDirectory: "./dist/blog/2023-1-1-0-0-0",
        dateDirectory: "2023-1-1-0-0-0",
        directory: "1672531200000_post1",
        blogPage: "./dist/blog/2023-1-1-0-0-0/post1.html",
        blogUrl: "/posts/2023-1-1-0-0-0/post1.html",
      },
    ];

    const testee = await import("./generate-post-pages.ts");
    await testee.default(posts);

    assert.strictEqual(createFileMock.mock.callCount(), 1);
    assert.strictEqual(
      createFileMock.mock.calls[0].arguments[0],
      "./dist/blog/2023-1-1-0-0-0/post1.html",
    );
  });

  test("Ensure folder contents are copied and content.md is deleted", async () => {
    const posts: PostInfo[] = [
      {
        name: "Post 1",
        fileName: "post1",
        creationDate: new Date("2023-01-01"),
        blogDirectory: "./dist/blog/2023-1-1-0-0-0",
        dateDirectory: "2023-1-1-0-0-0",
        directory: "1672531200000_post1",
        blogPage: "./dist/blog/2023-1-1-0-0-0/post1.html",
        blogUrl: "/posts/2023-1-1-0-0-0/post1.html",
      },
    ];

    const testee = await import("./generate-post-pages.ts");
    await testee.default(posts);

    assert.strictEqual(copyFolderContentsMock.mock.callCount(), 1);
    assert.strictEqual(
      copyFolderContentsMock.mock.calls[0].arguments[0],
      "./src/blog/post/1672531200000_post1",
    );
    assert.strictEqual(
      copyFolderContentsMock.mock.calls[0].arguments[1],
      "./dist/blog/2023-1-1-0-0-0",
    );

    assert.strictEqual(deleteFileMock.mock.callCount(), 1);
    assert.strictEqual(
      deleteFileMock.mock.calls[0].arguments[0],
      "./dist/blog/2023-1-1-0-0-0/content.md",
    );
  });
});
