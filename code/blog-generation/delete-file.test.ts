import assert from "node:assert";
import { describe, test, mock, beforeEach, afterEach } from "node:test";

describe("Test delete-file.ts", async () => {
  const unlinkSyncMock = mock.fn();
  const consoleErrorMock = mock.fn();

  beforeEach(async () => {
    const fsExports = await import("fs").then(({ default: _, ...rest }) => ({
      ...rest,
      unlinkSync: unlinkSyncMock,
    }));
    mock.module("fs", {
      namedExports: fsExports,
    });
    mock.method(console, "error", consoleErrorMock);
  });

  afterEach(() => {
    unlinkSyncMock.mock.resetCalls();
    consoleErrorMock.mock.resetCalls();
    mock.restoreAll();
  });

  test("Ensure fs.unlinkSync is called with correct arguments", async () => {
    const testee = await import("./delete-file.ts");
    testee.default("./test-file.txt");
    assert.strictEqual(unlinkSyncMock.mock.callCount(), 1);
    assert.strictEqual(
      unlinkSyncMock.mock.calls[0].arguments[0],
      "./test-file.txt",
    );
  });

  test("Ensure console.error is called when fs.unlinkSync throws an error", async () => {
    unlinkSyncMock.mock.mockImplementation(() => {
      throw new Error("File not found");
    });
    const testee = await import("./delete-file.ts");
    testee.default("./nonexistent-file.txt");
    assert.strictEqual(consoleErrorMock.mock.callCount(), 1);
    assert(
      consoleErrorMock.mock.calls[0].arguments[0].includes(
        "Error deleting file",
      ),
    );
  });
});
