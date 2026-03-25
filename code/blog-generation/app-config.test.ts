import { describe, test } from "node:test";
import assert from "node:assert";
import * as testee from "./app-config.ts";

describe("Test app-config.ts", () => {
  test("Count exported attributes, confirm each returns correct paramater", () => {
    assert.strictEqual(Object.keys(testee).length, 9);

    assert.strictEqual(testee.sourcePath, "./src");
    assert.strictEqual(testee.productionPath, "./dist");
    assert.strictEqual(testee.blogProductionPath, "./dist/blog");
    assert.strictEqual(testee.blogSourcePath, "./src/blog");
    assert.strictEqual(testee.postSourcePath, "./src/blog/post");
    assert.strictEqual(testee.blogIndexPageTemplate, "./src/blog/page1.html");
    assert.strictEqual(testee.postPageTemplate, "./src/blog/post/post.html");
    assert.strictEqual(testee.postsPerPage, 5);
    assert.strictEqual(testee.postUrlPath, "/blog");
  });
});
