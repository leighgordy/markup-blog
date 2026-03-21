import assert from "node:assert";
import { describe, test, mock, beforeEach, afterEach } from "node:test";

describe("Test read-file.ts", async () => {
  const readFileSyncMock = mock.fn();

  beforeEach(async () => {
    const fsExports = await import("fs").then(({ default: _, ...rest }) => ({
      ...rest,
      readFileSync: readFileSyncMock,
    }));
    mock.module("fs", {
      namedExports: fsExports,
    });
  });

  afterEach(() => {
    readFileSyncMock.mock.resetCalls();
    
    mock.restoreAll();
  });

  test("Ensure fs.readFileSync is called with correct arguments and returns file content", async () => {
    const expectedContent = "Hello, world!";
    readFileSyncMock.mock.mockImplementation(() => expectedContent as any);

    const testee = await import("./read-file.ts");
    const result = testee.default("./test-file.txt");

    assert.strictEqual(readFileSyncMock.mock.callCount(), 1);
    assert.strictEqual(readFileSyncMock.mock.calls[0].arguments[0], "./test-file.txt");
    assert.strictEqual(readFileSyncMock.mock.calls[0].arguments[1], "utf-8");
    assert.strictEqual(result, expectedContent);
  });
});