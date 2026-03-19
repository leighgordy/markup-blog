import assert from "node:assert";
import { type PostInfo } from "./types.ts";
import { describe, test, mock } from "node:test";

describe("Test app.ts", async () => {
  const posts: PostInfo[] = [
    {
      fileName: "Post.html",
      creationDate: new Date(),
      name: "Post",
      blogDirectory: "2012-12-12/post",
      dateDirectory: "2012-12-12",
      directory: "2012-12-12/post",
      blogPage: "2012-12-12/post/post.thml",
    },
  ];

  const deleteDirContentsMock = mock.fn();
  const deleteDirContentsExports =
    await import("./delete-dir-contents.ts").then(
      ({ default: _, ...rest }) => rest,
    );
  mock.module("./delete-dir-contents.ts", {
    defaultExport: deleteDirContentsMock,
    namedExports: deleteDirContentsExports,
  });

  const copyFolderContentsMock = mock.fn();
  const copyFolderContentsExports =
    await import("./copy-folder-contents.ts").then(
      ({ default: _, ...rest }) => rest,
    );
  mock.module("./copy-folder-contents.ts", {
    defaultExport: copyFolderContentsMock,
    namedExports: copyFolderContentsExports,
  });

  const generatePostInfoMock = mock.fn(() => []);
  const generatePostInfoExports = await import("./generate-post-info.ts").then(
    ({ default: _, ...rest }) => rest,
  );
  mock.module("./generate-post-info.ts", {
    defaultExport: generatePostInfoMock,
    namedExports: generatePostInfoExports,
  });

  const generatePostPagesMock = mock.fn();
  const generatePostPagesExports =
    await import("./generate-post-pages.ts").then(
      ({ default: _, ...rest }) => rest,
    );
  mock.module("./generate-post-pages.ts", {
    defaultExport: generatePostPagesMock,
    namedExports: generatePostPagesExports,
  });

  const generateIndexesMock = mock.fn();
  const generateIndexesExports = await import("./generate-indexes.ts").then(
    ({ default: _, ...rest }) => rest,
  );
  mock.module("./generate-indexes.ts", {
    defaultExport: generateIndexesMock,
    namedExports: generateIndexesExports,
  });

  test("Ensure app calls the correct mocked methods", async () => {
    deleteDirContentsMock.mock.mockImplementation(() => {});
    copyFolderContentsMock.mock.mockImplementation(() => {});
    generatePostInfoMock.mock.mockImplementation(() => posts);
    generatePostPagesMock.mock.mockImplementation(() => {});
    generateIndexesMock.mock.mockImplementation(() => {});

    await import("./app.ts");
    assert.strictEqual(deleteDirContentsMock.mock.callCount(), 2);
    assert.strictEqual(copyFolderContentsMock.mock.callCount(), 1);
    assert.strictEqual(generatePostInfoMock.mock.callCount(), 1);
    assert.strictEqual(generatePostPagesMock.mock.callCount(), 1);
    assert.strictEqual(generateIndexesMock.mock.callCount(), 1);

    // confirms postInfo array is passed to page generators
    assert.strictEqual(generatePostPagesMock.mock.calls[0].arguments[0], posts);
    assert.strictEqual(generateIndexesMock.mock.calls[0].arguments[0], posts);
  });
});
