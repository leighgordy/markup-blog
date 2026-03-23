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

describe("Test generate-indexes.ts", async () => {
  const readFileMock = mock.fn() as Mock<(path: string) => String>;
  const createFileMock = mock.fn() as Mock<
    (path: string, content: string) => void
  >;
  const createIndexPageMock = mock.fn() as Mock<
    (
      template: string,
      posts: PostInfo[],
      pageNo: number,
      maxPage: number,
    ) => String
  >;

  beforeEach(async () => {
    readFileMock.mock.mockImplementation(() => "<html>Template</html>");
    createFileMock.mock.mockImplementation(() => {});
    createIndexPageMock.mock.mockImplementation(() => "<html>Page</html>");

    mock.module("./read-file.ts", {
      defaultExport: readFileMock,
    });
    mock.module("./create-file.ts", {
      defaultExport: createFileMock,
    });
    mock.module("./create-index-page.ts", {
      defaultExport: createIndexPageMock,
    });
    mock.module("./app-config.ts", {
      namedExports: {
        blogProductionPath: "./dist/blog",
        blogIndexPageTemplate: "./src/blog/page1.html",
        postsPerPage: 2,
      },
    });
  });

  afterEach(() => {
    readFileMock.mock.resetCalls();
    createFileMock.mock.resetCalls();
    createIndexPageMock.mock.resetCalls();

    mock.restoreAll();
  });

  test("Ensure indexes are generated for single page", async () => {
    const posts: PostInfo[] = [
      {
        name: "Post 1",
        fileName: "",
        creationDate: new Date("2023-01-01"),
        blogDirectory: "",
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
      },
      {
        name: "Post 2",
        fileName: "",
        creationDate: new Date("2023-01-02"),
        blogDirectory: "",
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
      },
    ];

    const testee = await import("./generate-indexes.ts");
    await testee.default(posts);

    assert.strictEqual(readFileMock.mock.callCount(), 1);
    assert.strictEqual(
      readFileMock.mock.calls[0].arguments[0],
      "./src/blog/page1.html",
    );

    assert.strictEqual(createIndexPageMock.mock.callCount(), 1);
    assert.strictEqual(
      createIndexPageMock.mock.calls[0].arguments[1].length,
      2,
    );
    assert.strictEqual(createIndexPageMock.mock.calls[0].arguments[2], 0);
    assert.strictEqual(createIndexPageMock.mock.calls[0].arguments[3], 1);

    assert.strictEqual(createFileMock.mock.callCount(), 1);
    assert.strictEqual(
      createFileMock.mock.calls[0].arguments[0],
      "./dist/blog/page1.html",
    );
  });

  test("Ensure indexes are generated for multiple pages", async () => {
    const posts: PostInfo[] = [
      {
        name: "Post 1",
        fileName: "",
        creationDate: new Date("2023-01-01"),
        blogDirectory: "",
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
      },
      {
        name: "Post 2",
        fileName: "",
        creationDate: new Date("2023-01-02"),
        blogDirectory: "",
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
      },
      {
        name: "Post 3",
        fileName: "",
        creationDate: new Date("2023-01-03"),
        blogDirectory: "",
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
      },
    ];

    const testee = await import("./generate-indexes.ts");
    await testee.default(posts);

    assert.strictEqual(createIndexPageMock.mock.callCount(), 2);
    assert.strictEqual(createFileMock.mock.callCount(), 2);
    assert.strictEqual(
      createFileMock.mock.calls[0].arguments[0],
      "./dist/blog/page1.html",
    );
    assert.strictEqual(
      createFileMock.mock.calls[1].arguments[0],
      "./dist/blog/page2.html",
    );
  });

  test("Ensure posts are sorted by creation date descending", async () => {
    const posts: PostInfo[] = [
      {
        name: "Post 1",
        fileName: "",
        creationDate: new Date("2023-01-01"),
        blogDirectory: "",
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
      },
      {
        name: "Post 3",
        fileName: "",
        creationDate: new Date("2023-01-03"),
        blogDirectory: "",
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
      },
      {
        name: "Post 2",
        fileName: "",
        creationDate: new Date("2023-01-02"),
        blogDirectory: "",
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
      },
    ];

    const testee = await import("./generate-indexes.ts");
    await testee.default(posts);

    // Check that createIndexPage is called with sorted posts
    const calledPosts = createIndexPageMock.mock.calls[0].arguments[1];
    assert.strictEqual(calledPosts[0].name, "Post 3");
    assert.strictEqual(calledPosts[1].name, "Post 2");

    const calledPostsTwo = createIndexPageMock.mock.calls[1].arguments[1];
    assert.strictEqual(calledPostsTwo[0].name, "Post 1");
  });
});
