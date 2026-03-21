import assert from "node:assert";
import { describe, test } from "node:test";
import { type PostInfo } from "./types.ts";

describe("Test create-index-page.ts", async () => {
  const testee = await import("./create-index-page.ts");

  test("Ensure posts are injected correctly", async () => {
    const pageTemplate = `
      <html>
        <!--INJECT-POSTS-START-->
        <!--INJECT-POSTS-END-->
      </html>
    `;
    const posts: PostInfo[] = [
      {
        name: "Post 1",
        fileName: "",
        creationDate: new Date(),
        blogDirectory: "",
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
      },
      {
        name: "Post 2",
        fileName: "",
        creationDate: new Date(),
        blogDirectory: "",
        dateDirectory: "",
        directory: "",
        blogPage: "",
        blogUrl: "",
      },
    ];
    const result = testee.default(pageTemplate, posts, 0, 1);

    assert(result.includes("<h2>Post 1</h2>"));
    assert(result.includes("<h2>Post 2</h2>"));
    assert(result.includes("<article>"));
  });

  test("Ensure navigation is injected correctly for first page", async () => {
    const pageTemplate = `
      <html>
        <!--INJECT-POSTS-NAV-START-->
        <!--INJECT-POSTS-NAV-END-->
      </html>
    `;
    const posts: PostInfo[] = [];
    const result = testee.default(pageTemplate, posts, 0, 2);

    assert(result.includes('<a href="./page2.html" disabled>Next Page </a>'));
    assert(!result.includes("Previous Page"));
  });

  test("Ensure navigation is injected correctly for last page", async () => {
    const pageTemplate = `
      <html>
        <!--INJECT-POSTS-NAV-START-->
        <!--INJECT-POSTS-NAV-END-->
      </html>
    `;
    const posts: PostInfo[] = [];
    const result = testee.default(pageTemplate, posts, 1, 2);

    assert(result.includes('<a href="./page1.html">Previous Page </a>'));
    assert(!result.includes("Next Page"));
  });

  test("Ensure navigation is injected correctly for middle page", async () => {
    const pageTemplate = `
      <html>
        <!--INJECT-POSTS-NAV-START-->
        <!--INJECT-POSTS-NAV-END-->
      </html>
    `;
    const posts: PostInfo[] = [];
    const result = testee.default(pageTemplate, posts, 1, 4);

    assert(result.includes('<a href="./page1.html">Previous Page </a>'));
    assert(result.includes('<a href="./page3.html" disabled>Next Page </a>'));
  });

  test("Ensure empty posts result in no articles", async () => {
    const pageTemplate = `
      <html>
        <!--INJECT-POSTS-START-->
        <!--INJECT-POSTS-END-->
      </html>
    `;
    const posts: PostInfo[] = [];
    const result = testee.default(pageTemplate, posts, 0, 1);

    assert(!result.includes("<article>"));
  });
});
