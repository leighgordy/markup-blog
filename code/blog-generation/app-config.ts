const sourcePath = "./src";
const productionPath = "./dist";

const blogProductionPath = `${productionPath}/blog`;
const blogSourcePath = `${sourcePath}/blog`;
const postSourcePath = `${blogSourcePath}/post`;

const blogIndexPageTemplate = `${blogSourcePath}/page1.html`;
const postPageTemplate = `${blogSourcePath}/post/post.html`;

const postsPerPage = 5;

const postUrlPath = "/blog";

export {
  sourcePath,
  productionPath,
  blogProductionPath,
  blogSourcePath,
  postSourcePath,
  blogIndexPageTemplate,
  postPageTemplate,
  postsPerPage,
  postUrlPath,
};
