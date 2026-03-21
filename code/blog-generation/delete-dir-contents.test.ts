import assert from "node:assert";
import {
  describe,
  test,
  mock,
  beforeEach,
  afterEach,
  type Mock,
} from "node:test";

describe("Test delete-dir-contents.ts", async () => {
  const readdirMock = mock.fn() as Mock<() => Promise<String[]>>;
  const statMock = mock.fn() as Mock<() => Promise<{}>>;
  const unlinkMock = mock.fn() as Mock<() => Promise<void>>;
  const rmdirMock = mock.fn() as Mock<() => Promise<void>>;

  let fsContext: any;

  beforeEach(async () => {
    fsContext = mock.module("fs", {
      namedExports: {
        promises: {
          readdir: readdirMock,
          stat: statMock,
          unlink: unlinkMock,
          rmdir: rmdirMock,
        },
      },
    });
  });

  afterEach(() => {
    fsContext?.restore();
    readdirMock.mock.resetCalls();
    statMock.mock.resetCalls();
    unlinkMock.mock.resetCalls();
    rmdirMock.mock.resetCalls();
  });

  test("Ensure files in directory are deleted", async () => {
    readdirMock.mock.mockImplementation(() =>
      Promise.resolve(["file1.txt", "file2.txt"]),
    );
    statMock.mock.mockImplementation(() =>
      Promise.resolve({ isDirectory: () => false }),
    );
    unlinkMock.mock.mockImplementation(() => Promise.resolve() as any);

    const testee = await import("./delete-dir-contents.ts");
    await testee.default("./test-dir");

    assert.strictEqual(readdirMock.mock.callCount(), 1);
    assert.strictEqual(statMock.mock.callCount(), 2);
    assert.strictEqual(unlinkMock.mock.callCount(), 2);
    assert.strictEqual(rmdirMock.mock.callCount(), 0);
  });

  test("Ensure subdirectories are deleted recursively", async () => {
    readdirMock.mock.mockImplementationOnce(
      () => Promise.resolve(["subdir"]),
      0,
    );
    readdirMock.mock.mockImplementationOnce(
      () => Promise.resolve(["file.txt"]),
      1,
    );
    statMock.mock.mockImplementationOnce(
      () => Promise.resolve({ isDirectory: () => true }),
      0,
    );
    statMock.mock.mockImplementationOnce(
      () => Promise.resolve({ isDirectory: () => false }),
      1,
    );
    unlinkMock.mock.mockImplementation(() => Promise.resolve());
    rmdirMock.mock.mockImplementation(() => Promise.resolve());

    const testee = await import("./delete-dir-contents.ts");
    await testee.default("./test-dir");

    assert.strictEqual(readdirMock.mock.callCount(), 2);
    assert.strictEqual(statMock.mock.callCount(), 2);
    assert.strictEqual(unlinkMock.mock.callCount(), 1);
    assert.strictEqual(rmdirMock.mock.callCount(), 1);
  });
});
