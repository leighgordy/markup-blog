import assert from "node:assert";
import { describe, test, mock, beforeEach, afterEach } from "node:test";

describe("Test create-file.ts", async () => {
  const writeFileSyncMock = mock.fn();

  beforeEach(async () => {
    const fsExports = await import("fs").then(({ default: _, ...rest }) => ({
      ...rest,
      writeFileSync: writeFileSyncMock,
    }));
    mock.module("fs", {
      namedExports: fsExports,
    });
  });

  afterEach(() => {
    writeFileSyncMock.mock.resetCalls();
    mock.restoreAll();
  });

  test("Ensure fs.writeFileSync is called with correct arguments", async () => {
    const testee = await import("./create-file.ts");
    testee.default("./test-file.txt", "Hello World");
    assert.strictEqual(writeFileSyncMock.mock.callCount(), 1);
    assert.strictEqual(
      writeFileSyncMock.mock.calls[0].arguments[0],
      "./test-file.txt",
    );
    assert.strictEqual(
      writeFileSyncMock.mock.calls[0].arguments[1],
      "Hello World",
    );
    assert.deepStrictEqual(writeFileSyncMock.mock.calls[0].arguments[2], {
      encoding: "utf8",
    });
  });
});
