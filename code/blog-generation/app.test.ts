import assert from "node:assert";
import { type PostInfo } from "./types.ts";
import { describe, test, mock, beforeEach, afterEach } from "node:test";

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
  const copyFolderContentsMock = mock.fn();
  const generatePostInfoMock = mock.fn(() => []);
  const generatePostPagesMock = mock.fn();
  const generateIndexesMock = mock.fn();

  beforeEach(async () => {
    mock.module("./delete-dir-contents.ts", {
      defaultExport: deleteDirContentsMock,
    });
    mock.module("./copy-folder-contents.ts", {
      defaultExport: copyFolderContentsMock,
    });
    mock.module("./generate-post-info.ts", {
      defaultExport: generatePostInfoMock,
    });
    mock.module("./generate-post-pages.ts", {
      defaultExport: generatePostPagesMock,
    });
    mock.module("./generate-indexes.ts", {
      defaultExport: generateIndexesMock,
    });
  });

  afterEach(() => {
    deleteDirContentsMock.mock.resetCalls();
    copyFolderContentsMock.mock.resetCalls();
    generatePostInfoMock.mock.resetCalls();
    generatePostPagesMock.mock.resetCalls();
    generateIndexesMock.mock.resetCalls();

    mock.restoreAll();
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
