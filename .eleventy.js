module.exports = function (eleventyConfig) {
    // Add a date filter for Nunjucks
    eleventyConfig.addFilter("date", function (date, format) {
        const d = date === "now" ? new Date() : new Date(date);
        if (format === "YYYY") {
            return d.getFullYear();
        }
        return d.toLocaleDateString();
    });
    eleventyConfig.addPassthroughCopy("src/css");
    return {
        dir: {
            input: "src",
            output: "public"
        }
    }
}