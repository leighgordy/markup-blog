import assert from "node:assert";
import { describe, test, mock, beforeEach, afterEach } from "node:test";

describe("Test copy-file.ts", async () => {
  const copyFileSyncMock = mock.fn();

  beforeEach(async () => {
    const fsExports = await import("fs").then(({ default: _, ...rest }) => ({
      ...rest,
      copyFileSync: copyFileSyncMock,
    }));
    mock.module("fs", {
      namedExports: fsExports,
    });
  });

  afterEach(() => {
    copyFileSyncMock.mock.resetCalls();
    mock.restoreAll();
  });

  test("Ensure fs.copyFileSync is called, with correct arguements", async () => {
    const testee = await import("./copy-file.ts");
    testee.default("./src", "./dist");
    assert.strictEqual(copyFileSyncMock.mock.callCount(), 1);
    assert.strictEqual(copyFileSyncMock.mock.calls[0].arguments[0], "./src");
    assert.strictEqual(copyFileSyncMock.mock.calls[0].arguments[1], "./dist");
  });
});
