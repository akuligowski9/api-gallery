import fs from "fs";
import path from "path";

const BASE_URL = "https://public-apis-explorer.vercel.app";
const catalogPath = path.join(process.cwd(), "data", "catalog.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const today = new Date().toISOString().split("T")[0];

const urls = [
  `  <url>\n    <loc>${BASE_URL}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>`,
];

for (const entry of catalog.entries) {
  const slug = slugify(entry.API);
  urls.push(
    `  <url>\n    <loc>${BASE_URL}/${slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
  );
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

const outPath = path.join(process.cwd(), "public", "sitemap.xml");
fs.writeFileSync(outPath, sitemap);
console.log(`Sitemap generated: ${urls.length} URLs → public/sitemap.xml`);
