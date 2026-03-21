import assert from "node:assert";
import { describe, test } from "node:test";
import markdownHtmlConvertor from "./markdown_html_convertor.ts";

describe("Test markdown_html_convertor.ts", () => {
  test("Convert underline markup _text_ to <u>text</u>", () => {
    const input = "_underlined text_";
    const expected = "<p><u>underlined text</u></p>";
    const result = markdownHtmlConvertor(input);
    assert.strictEqual(result, expected);
  });

  test("Convert plain text to paragraph <p>text</p>", () => {
    const input = "This is a plain paragraph.";
    const expected = "<p>This is a plain paragraph.</p>";
    const result = markdownHtmlConvertor(input);
    assert.strictEqual(result, expected);
  });

  test("Convert bold markup **text** to <strong>text</strong>", () => {
    const input = "**bold text**";
    const expected = "<p><strong>bold text</strong></p>";
    const result = markdownHtmlConvertor(input);
    assert.strictEqual(result, expected);
  });

  test("Convert bold markup __text__ to <strong>text</strong>", () => {
    const input = "__bold text__";
    const expected = "<p><strong>bold text</strong></p>";
    const result = markdownHtmlConvertor(input);
    assert.strictEqual(result, expected);
  });

  test("Convert italic markup *text* to <em>text</em>", () => {
    const input = "*italic text*";
    const expected = "<p><em>italic text</em></p>";
    const result = markdownHtmlConvertor(input);
    assert.strictEqual(result, expected);
  });

  test("Convert italic markup _text_ to <em>text</em> (after underline)", () => {
    const input = "*italic text*";
    const expected = "<p><em>italic text</em></p>";
    const result = markdownHtmlConvertor(input);
    assert.strictEqual(result, expected);
  });

  test("Convert header # Header to <h1>Header</h1>", () => {
    const input = "# Header";
    const expected = "<h1>Header</h1>";
    const result = markdownHtmlConvertor(input);
    assert.strictEqual(result, expected);
  });

  test("Convert header ## Subheader to <h2>Subheader</h2>", () => {
    const input = "## Subheader";
    const expected = "<h2>Subheader</h2>";
    const result = markdownHtmlConvertor(input);
    assert.strictEqual(result, expected);
  });

  test('Convert link [text](url) to <a href="url">text</a>', () => {
    const input = "[link text](http://example.com)";
    const expected = '<p><a href="http://example.com">link text</a></p>';
    const result = markdownHtmlConvertor(input);
    assert.strictEqual(result, expected);
  });

  test("Handle multiple lines and combinations", () => {
    const input = `# Title

This is a **bold** paragraph with *italic* text.

[Link](url) and _underline_.`;
    const expected =
      '<h1>Title</h1><p>This is a <strong>bold</strong> paragraph with <em>italic</em> text.</p><p><a href="url">Link</a> and <u>underline</u>.</p>';
    const result = markdownHtmlConvertor(input);
    assert.strictEqual(result, expected);
  });
});
