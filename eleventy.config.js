const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
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
  // Cache-busts static assets (CSS, JS) so browsers pick up new content on
  // deploy without needing a hard refresh: the query string changes only
  // when the file's contents actually change.
  eleventyConfig.addFilter("fileHash", (relPath) => {
    const filePath = path.join(__dirname, "src", relPath);
    const content = fs.readFileSync(filePath);
    return crypto.createHash("md5").update(content).digest("hex").slice(0, 8);
  });

  // Walks the eleventyNavigation tree in depth-first reading order and returns
  // this page's neighbours plus the top-level section it belongs to. The pager
  // is how a mobile reader moves through the manual without opening the drawer;
  // the section name is the breadcrumb in the mobile top bar.
  //
  // Depth-0 entries are skipped as pager stops: every one of them is a
  // `redirect:` stub that bounces to its first child, so landing on one would
  // send the reader straight back out again.
  eleventyConfig.addFilter("navPager", (tree, currentUrl) => {
    const stops = [];
    (function walk(entries, section) {
      for (const entry of entries || []) {
        const top = section || entry.title;
        if (section) stops.push({ url: entry.url, title: entry.title, section: top });
        walk(entry.children, top);
      }
    })(tree, null);

    const i = stops.findIndex((s) => s.url === currentUrl);
    if (i === -1) return { prev: null, next: null, section: null };
    return {
      prev: i > 0 ? stops[i - 1] : null,
      next: i < stops.length - 1 ? stops[i + 1] : null,
      section: stops[i].section,
    };
  });

  // Indexes _site after every build, including each --serve rebuild, so dev and
  // production search behave identically. addDirectory() re-reads the whole
  // output directory, so an incremental rebuild still yields a complete index.
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const pagefind = await import("pagefind");
    const { index } = await pagefind.createIndex();
    const { page_count } = await index.addDirectory({ path: dir.output });
    // Fragment filenames are content-hashed, so editing a page leaves the old
    // fragment behind. Harmless but it accumulates across a long --serve run.
    const outputPath = path.join(dir.output, "pagefind");
    fs.rmSync(outputPath, { recursive: true, force: true });
    await index.writeFiles({ outputPath });
    await pagefind.close();
    console.log(`[pagefind] indexed ${page_count} pages`);
  });

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
