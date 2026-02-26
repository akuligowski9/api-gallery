import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUTPUT = path.join(ROOT, "public", "og-image.png");
const BASE_URL = process.argv[2] || "http://localhost:3000";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 640 },
    colorScheme: "dark",
  });

  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  // Switch to 3-column layout
  const colBtn = page.locator('button[aria-label="3 column layout"]');
  await colBtn.click();
  await new Promise((r) => setTimeout(r, 800));

  await page.screenshot({ path: OUTPUT, type: "png" });
  await browser.close();

  console.log(`Saved: ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
