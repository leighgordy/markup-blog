const markdownHtmlConvertor = (markup: string): string => {
  return markup
    .split(/\r?\n/)
    .filter((item) => item.trim() !== "")
    .map((paragraph) =>
      paragraph
        .trim()
        .replace(/_(.+?)_/g, "<u>$1</u>")
        .replace(/^(?!#)(?!\*|\d+\.|\s*-\s)([^\n]+)$/gm, "<p>$1</p>")
        .replace(/\*\*(.*?)\*\*|__(.*?)__/g, (match, bold1, bold2) => {
          const content = bold1 || bold2;
          return `<strong>${content}</strong>`;
        })
        .replace(/\*(.*?)\*|_(.*?)_/g, (match, italic1, italic2) => {
          const content = italic1 || italic2;
          return `<em>${content}</em>`;
        })
        .replace(/^(#+)\s+(.*)$/gm, (match, hashes, content) => {
          const level = hashes.length;
          return `<h${level}>${content}</h${level}>`;
        })
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>'),
    )
    .join("");
};

export default markdownHtmlConvertor;
