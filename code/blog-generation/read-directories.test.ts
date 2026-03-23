import assert from "node:assert";
import {
  describe,
  test,
  mock,
  beforeEach,
  afterEach,
  type Mock,
} from "node:test";
import { type Dirent } from "fs";
import type { ObjectEncodingOptions, PathLike } from "node:fs";

describe("Test read-directories.ts", async () => {
  const readdirSyncMock = mock.fn() as Mock<
    (
      path: PathLike,
      options: ObjectEncodingOptions & {
        withFileTypes: true;
        recursive?: boolean | undefined;
      },
    ) => Dirent[]
  >;

  beforeEach(async () => {
    const fsExports = await import("fs").then(({ default: _, ...rest }) => ({
      ...rest,
      readdirSync: readdirSyncMock,
    }));
    mock.module("fs", {
      namedExports: fsExports,
    });
  });

  afterEach(() => {
    readdirSyncMock.mock.resetCalls();

    mock.restoreAll();
  });

  test("Ensure fs.readdirSync is called with correct arguments and returns directory names", async () => {
    const mockFiles = [
      { name: "file1.txt", isDirectory: () => false },
      { name: "dir1", isDirectory: () => true },
      { name: "file2.js", isDirectory: () => false },
      { name: "dir2", isDirectory: () => true },
    ] as Dirent[];
    readdirSyncMock.mock.mockImplementation(() => mockFiles);

    const testee = await import("./read-directories.ts");
    const result = testee.default("./test-dir");

    assert.strictEqual(readdirSyncMock.mock.callCount(), 1);
    assert.strictEqual(
      readdirSyncMock.mock.calls[0].arguments[0],
      "./test-dir",
    );
    assert.deepStrictEqual(readdirSyncMock.mock.calls[0].arguments[1], {
      withFileTypes: true,
    });
    assert.deepStrictEqual(result, ["dir1", "dir2"]);
  });
});
