# markdown-blog

This is a static blog website generator. It is designed to generate an entirely static site, with a blog generated from markdown files. I use markdown for all my notes, so a blog generated from markdown is the perfect site for me. Also by not having a backend on this site it is 100% secure. No need to keep running updates.

I have also written this to keep one hand in HTML and CSS. I generally build Single Page applications which insulates you from advances in CSS and HTML. This will help me informed in those areas.

## instructions

| code                 | description                                                               |
| -------------------- | ------------------------------------------------------------------------- |
| `npm run build`      | build the site and static blog for use on live site, generates it in dist |
| `npm run createPost` | create a blog post in source with thumnail and post markdown file         |
| `npm run serveDev`   | serve site via express, no blog content generated                         |
| `npm run serveProd`  | serve live site via express, contains generated blog content              |
| `npm run clean`      | clean project using prettier                                              |
| `npm run validate`   | validate project with typescript compiler && prettier                     |
| `npm run prebuild`   | validate project with typescript compiler && prettier                     |
| `npm run build`      | build ES module using typescript compiler                                 |
