import assert from "node:assert";
import { describe, test, mock, beforeEach, afterEach } from "node:test";

describe("Test generate-post-info.ts", async () => {
  const readDirectoriesMock = mock.fn();

  let readDirectoriesContext: any;
  let appConfigContext: any;

  beforeEach(async () => {
    readDirectoriesMock.mock.mockImplementation(
      () => ["1672531200000_my-post", "1672617600000_another-post"] as any,
    );

    readDirectoriesContext = mock.module("./read-directories.ts", {
      defaultExport: readDirectoriesMock,
    });
    appConfigContext = mock.module("./app-config.ts", {
      namedExports: {
        blogProductionPath: "./dist/blog",
        postSourcePath: "./src/blog/post",
        postUrlPath: "/posts",
      },
    });
  });

  afterEach(() => {
    if (readDirectoriesContext) readDirectoriesContext.restore();
    if (appConfigContext) appConfigContext.restore();
    readDirectoriesMock.mock.resetCalls();
    mock.restoreAll();
  });

  test("Ensure post info is generated correctly", async () => {
    const testee = await import("./generate-post-info.ts");
    const result = testee.default();

    assert.strictEqual(readDirectoriesMock.mock.callCount(), 1);
    assert.strictEqual(
      readDirectoriesMock.mock.calls[0].arguments[0],
      "./src/blog/post",
    );

    assert.strictEqual(result.length, 2);

    const firstPost = result[0];
    assert.strictEqual(firstPost.fileName, "my-post");
    assert.strictEqual(firstPost.name, "my post");
    assert.strictEqual(firstPost.directory, "1672531200000_my-post");
    assert.strictEqual(firstPost.blogDirectory, "./dist/blog/2023-1-1-0-0-0");
    assert.strictEqual(
      firstPost.blogPage,
      "./dist/blog/2023-1-1-0-0-0/my-post.html",
    );
    assert.strictEqual(firstPost.blogUrl, "/posts/2023-1-1-0-0-0/my-post.html");

    const secondPost = result[1];
    assert.strictEqual(secondPost.fileName, "another-post");
    assert.strictEqual(secondPost.name, "another post");
  });

  test("Ensure multiple dashes in filename are converted to spaces", async () => {
    readDirectoriesMock.mock.mockImplementation(
      () => ["1672531200000_my-long-post-title"] as any,
    );

    const testee = await import("./generate-post-info.ts");
    const result = testee.default();

    assert.strictEqual(result[0].name, "my long post title");
  });

  test("Ensure empty directory list returns empty array", async () => {
    readDirectoriesMock.mock.mockImplementation(() => [] as any);

    const testee = await import("./generate-post-info.ts");
    const result = testee.default();

    assert.strictEqual(result.length, 0);
  });
});
