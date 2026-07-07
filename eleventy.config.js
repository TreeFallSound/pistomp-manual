const fs = require("fs");
const markdownItAnchor = require("markdown-it-anchor");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPassthroughCopy("src/.nojekyll");
  eleventyConfig.addPassthroughCopy("src/assets");

  // Add id anchors to headings so they can be deep-linked (e.g. #editing-this-manual),
  // with a clickable pilcrow that appears on hover.
  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib.use(markdownItAnchor, {
      level: [2, 3, 4, 5, 6],
      slugify: (s) =>
        s
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-"),
      permalink: markdownItAnchor.permalink.headerLink({
        class: "heading-anchor",
      }),
    });
  });

  // Tag every block-level element with its source line so the
  // "suggest edit" widget can deep-link into GitHub's editor.
  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib.core.ruler.push("source_line_attrs", (state) => {
      state.tokens.forEach((token) => {
        if (token.type.endsWith("_open") && token.map) {
          token.attrSet("data-line", String(token.map[0] + 1));
        }
      });
    });
  });

  // Frontmatter isn't seen by markdown-it, so its line numbers start
  // at 1 within the content only. This filter returns how many lines
  // of frontmatter precede the content, so callers can offset by it.
  eleventyConfig.addFilter("frontMatterLineCount", (inputPath) => {
    const raw = fs.readFileSync(inputPath, "utf8");
    const lines = raw.split("\n");
    if (lines[0] !== "---") return 0;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === "---") return i + 1;
    }
    return 0;
  });

  return {
    pathPrefix: process.env.ELEVENTY_ENV === "production" ? "/pistomp-manual/" : "/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    markdownTemplateEngine: "njk",
  };
};
