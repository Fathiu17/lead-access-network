/**
 * LEAD ACCESS Network (LAN)
 * Eleventy configuration
 */
module.exports = function (eleventyConfig) {
  /* ------------------------------------------------------------------
   * 1. Passthrough copy (static assets)
   * ------------------------------------------------------------------ */
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ admin: "admin" });

  /* Rebuild when CSS/JS change during `--serve` */
  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.addWatchTarget("src/js/");

  /* ------------------------------------------------------------------
   * 2. Filters
   * ------------------------------------------------------------------ */

  /** "15 January 2026" */
  eleventyConfig.addFilter("readableDate", function (dateObj) {
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    });
  });

  /** "2026-01-15" (for <time datetime="...">) */
  eleventyConfig.addFilter("htmlDateString", function (dateObj) {
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  });

  /** Short "15 Jan 2026" */
  eleventyConfig.addFilter("shortDate", function (dateObj) {
    const d = dateObj instanceof Date ? dateObj : new Date(dateObj);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    });
  });

  /** Pagination / previews: limit an array to N items */
  eleventyConfig.addFilter("limit", function (array, limit) {
    if (!Array.isArray(array)) return [];
    return array.slice(0, Number(limit) || 0);
  });

  /** Skip the first N items */
  eleventyConfig.addFilter("skip", function (array, count) {
    if (!Array.isArray(array)) return [];
    return array.slice(Number(count) || 0);
  });

  /** Uppercase-safe slug for classes / query strings */
  eleventyConfig.addFilter("slugify", function (value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  });

  /* ------------------------------------------------------------------
   * 3. Collections
   * ------------------------------------------------------------------ */
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => b.date - a.date);
  });

  /* Posts grouped by category (handy for future category pages) */
  eleventyConfig.addCollection("postsByCategory", function (collectionApi) {
    const map = {};
    collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => b.date - a.date)
      .forEach((item) => {
        const cat = item.data.category || "Uncategorised";
        if (!map[cat]) map[cat] = [];
        map[cat].push(item);
      });
    return map;
  });

  /* ------------------------------------------------------------------
   * 4. Misc
   * ------------------------------------------------------------------ */
  eleventyConfig.setQuietMode(true);
  eleventyConfig.addShortcode("currentYear", () => new Date().getFullYear());

  /* ------------------------------------------------------------------
   * 5. Directory configuration
   * ------------------------------------------------------------------ */
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
