# markup-blog

This is a static blog website generator. It is designed to allow for the gerneation of a static site with a blog generated from markup files. I've written this so my portfolio site can be 100% accessible and not require any backend. No backend means less security issues, and less cost to run.

I have also written this to keep one hand in HTML and CSS. I generally build Single Page applications which insulates you from advances in CSS and HTML. This will help me informed in those areas.

## instructions

| code                | description                                                               |
| ------------------- | ------------------------------------------------------------------------- |
| `npm run build`     | build the site and static blog for use on live site, generates it in dist |
| `npm run createPost`| create a blog post in source with thumnail and post markup file           |
| `npm run serveDev`  | serve site via express, no blog content generated                         |
| `npm run serveProd` | serve live site via express, contains generated blog content              |
| `npm run clean`     | clean project using prettier                                              |
| `npm run build`     | build ES module using typescript compiler                                 |
