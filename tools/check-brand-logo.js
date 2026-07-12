const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const skipDirs = new Set([".git", "node_modules", ".wrangler"]);
const failures = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) walk(path.join(dir, entry.name));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".html")) {
      checkFile(path.join(dir, entry.name));
    }
  }
}

function checkFile(file) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file);
  const brandLinks = html.match(/<a\b[^>]*class=["'][^"']*\bbrand\b[^"']*["'][^>]*>[\s\S]*?<\/a>/gi) || [];

  for (const link of brandLinks) {
    if (!/SplashLens/i.test(link)) continue;
    if (/>SL\s*</.test(link)) {
      failures.push(`${rel}: brand link still uses text-only SL badge`);
    }
    if (!/<svg\b/i.test(link)) {
      failures.push(`${rel}: brand link is missing inline SplashLens logo SVG`);
    }
  }
}

walk(root);

if (failures.length) {
  console.error(`Brand logo check failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Brand logo check passed.");
