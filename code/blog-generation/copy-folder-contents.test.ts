import assert from "node:assert";
import {
  describe,
  test,
  mock,
  beforeEach,
  afterEach,
  type Mock,
} from "node:test";

describe("Test copy-folder-contents.ts", async () => {
  const mkdirMock = mock.fn() as Mock<() => Promise<void>>;
  const readdirMock = mock.fn() as Mock<() => Promise<String[]>>;
  const statMock = mock.fn() as Mock<() => Promise<{}>>;
  const copyFileMock = mock.fn() as Mock<() => Promise<void>>;

  let fsContext: any;

  beforeEach(async () => {
    fsContext = mock.module("fs", {
      namedExports: {
        promises: {
          mkdir: mkdirMock,
          readdir: readdirMock,
          stat: statMock,
          copyFile: copyFileMock,
        },
      },
    });
  });

  afterEach(() => {
    mkdirMock.mock.resetCalls();
    readdirMock.mock.resetCalls();
    statMock.mock.resetCalls();
    copyFileMock.mock.resetCalls();

    fsContext?.restore();
  });

  test("Ensure folder contents are copied correctly for files", async () => {
    readdirMock.mock.mockImplementation(() =>
      Promise.resolve(["file1.txt", "file2.txt"]),
    );
    statMock.mock.mockImplementation(() =>
      Promise.resolve({
        isDirectory: () => false,
      }),
    );
    mkdirMock.mock.mockImplementation(() => Promise.resolve());
    copyFileMock.mock.mockImplementation(() => Promise.resolve());

    const testee = await import("./copy-folder-contents.ts");
    await testee.default("./src", "./dest");

    assert.strictEqual(mkdirMock.mock.callCount(), 1);
    //@ts-ignore
    assert.strictEqual(mkdirMock.mock.calls[0].arguments[0], "./dest");
    //@ts-ignore
    assert.strictEqual(mkdirMock.mock.calls[0].arguments[1].recursive, true);

    assert.strictEqual(readdirMock.mock.callCount(), 1);
    //@ts-ignore
    assert.strictEqual(readdirMock.mock.calls[0].arguments[0], "./src");

    assert.strictEqual(statMock.mock.callCount(), 2);
    assert.strictEqual(copyFileMock.mock.callCount(), 2);
    assert.deepStrictEqual(copyFileMock.mock.calls[0].arguments, [
      "src/file1.txt",
      "dest/file1.txt",
    ]);
    assert.deepStrictEqual(copyFileMock.mock.calls[1].arguments, [
      "src/file2.txt",
      "dest/file2.txt",
    ]);
  });

  test("Ensure subdirectories are copied recursively", async () => {
    readdirMock.mock.mockImplementationOnce(
      () => Promise.resolve(["subdir"]),
      0,
    );
    readdirMock.mock.mockImplementationOnce(
      () => Promise.resolve(["file3.txt"]),
      1,
    );
    statMock.mock.mockImplementationOnce(
      () =>
        Promise.resolve({
          isDirectory: () => true,
        }),
      0,
    );
    statMock.mock.mockImplementationOnce(
      () =>
        Promise.resolve({
          isDirectory: () => false,
        }),
      1,
    );
    mkdirMock.mock.mockImplementation(() => Promise.resolve());
    copyFileMock.mock.mockImplementation(() => Promise.resolve());

    const testee = await import("./copy-folder-contents.ts");
    await testee.default("./src", "./dest");

    assert.strictEqual(mkdirMock.mock.callCount(), 2);
    assert.strictEqual(readdirMock.mock.callCount(), 2);
    assert.strictEqual(statMock.mock.callCount(), 2);
    assert.strictEqual(copyFileMock.mock.callCount(), 1);
    assert.deepStrictEqual(copyFileMock.mock.calls[0].arguments, [
      "src/subdir/file3.txt",
      "dest/subdir/file3.txt",
    ]);
  });
});
