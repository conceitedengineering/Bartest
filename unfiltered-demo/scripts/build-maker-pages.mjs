#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const dataPath = path.join(projectRoot, "data", "makers.json");
const makersRoot = path.join(projectRoot, "makers");

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) || "maker";
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function websiteLabel(url) {
  if (!url) {
    return "";
  }

  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return String(url);
  }
}

function buildMakerPage(maker) {
  const name = escapeHtml(maker.name || "Unnamed Maker");
  const region = escapeHtml(maker.region || "Region TBD");
  const varietals = escapeHtml(maker.varietals || "Varietals TBD");
  const bio = escapeHtml(maker.bio || "Bio coming soon.");
  const photo = maker.photoUrl ? `<img class="maker-hero-image" src="${maker.photoUrl}" alt="Photo of ${name}" loading="lazy" />` : '<div class="maker-hero-image" aria-hidden="true"></div>';
  const website = maker.website ? `<a href="${maker.website}" target="_blank" rel="noreferrer">${escapeHtml(websiteLabel(maker.website))}</a>` : "";
  const instagram = maker.instagram ? `<a href="${maker.instagram}" target="_blank" rel="noreferrer">Instagram</a>` : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name} • Unfiltered</title>
    <link rel="icon" href="../../favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="../../styles.css" />
  </head>
  <body class="maker-detail-page">
    <main class="shell maker-detail">
      <p><a class="back-link" href="../../#makers">← Back to makers</a></p>
      <section class="maker-hero">
        ${photo}
        <div class="maker-hero-copy">
          <h1>${name}</h1>
          <p class="maker-meta">${region} • ${varietals}</p>
          <p class="maker-bio-long">${bio}</p>
          <p class="maker-links">${website} ${instagram}</p>
        </div>
      </section>
    </main>
  </body>
</html>
`;
}

async function main() {
  const raw = await fs.readFile(dataPath, "utf8");
  const payload = JSON.parse(raw);
  const makers = Array.isArray(payload.makers) ? payload.makers : [];

  await fs.rm(makersRoot, { recursive: true, force: true });
  await fs.mkdir(makersRoot, { recursive: true });

  for (const maker of makers) {
    const slug = slugify(maker.slug || maker.name);
    const pageDir = path.join(makersRoot, slug);
    await fs.mkdir(pageDir, { recursive: true });
    await fs.writeFile(path.join(pageDir, "index.html"), buildMakerPage({ ...maker, slug }), "utf8");
  }

  console.log(`Generated ${makers.length} maker detail page(s).`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
