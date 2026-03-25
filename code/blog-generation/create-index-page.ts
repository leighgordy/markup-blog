import { type PostInfo } from "./types.ts";
import { author } from "./app-config.ts";

const navHtml = (pageNo: number, maxPage: number) => ` 
  ${pageNo == 0 ? "" : `<a href="./page${pageNo}.html">Previous Page </a>`}
  ${pageNo + 1 >= maxPage ? "" : `<a href="./page${pageNo + 2}.html" disabled>Next Page </a>`}
`;

const createIndexPage = (
  pageTemplate: string,
  posts: PostInfo[],
  pageNo: number,
  maxPage: number,
): string =>
  pageTemplate
    .replace(
      /<!--INJECT-POSTS-START-->([\s\S]*?)<!--INJECT-POSTS-END-->/s,
      () =>
        posts
          .map(
            (post) => `
            <article class="post-page-article">
              <div class="post-page-article-thumbnail">
                <img src="${post.dateDirectory}/thumbnail.svg" />
              </div>
              <div class="post-page-article-content">
                <header>
                  <a href="${post.blogUrl}"><h2>${post.name}</h2></a>
                </header>
                <p>
                  Pellentesque habitant morbi tristique senectus et netus et
                  malesuada fames ac turpis egestas. Vestibulum tortor quam,
                  feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
                  libero sit amet quam egestas semper. Aenean ultricies mi vitae
                  est...
                </p>
                <footer class="post-page-article-footer">
                  <div class="post-page-article-footer-item">Author: ${author}}</div>
                  <div class="post-page-article-footer-date">
                    Date: ${post.creationDate.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </div>
                  <div class="post-page-article-footer-time">
                    Time (GMT): ${post.creationDate.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true })}
                  </div>
                </footer>
              </div>
            </article>
        `,
          )
          .join(""),
    )
    .replace(
      /<!--INJECT-POSTS-NAV-START-->([\s\S]*?)<!--INJECT-POSTS-NAV-END-->/s,
      () => navHtml(pageNo, maxPage),
    );

export default createIndexPage;
