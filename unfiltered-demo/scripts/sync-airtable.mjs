#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function normalizeUrl(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
    return "";
  } catch {
    return "";
  }
}

function mapRecord(record) {
  const fields = record.fields || {};
  const name = String(fields.Name || "").trim();

  if (!name) {
    return null;
  }

  const photoAttachment = Array.isArray(fields.Photo) && fields.Photo.length
    ? fields.Photo[0]
    : null;

  return {
    name,
    region: String(fields.Region || "").trim(),
    varietals: String(fields.Varietals || "").trim(),
    bio: String(fields.Bio || "").trim(),
    website: normalizeUrl(String(fields.Website || "")),
    instagram: normalizeUrl(String(fields.Instagram || "")),
    photoUrl: normalizeUrl(String(photoAttachment?.url || "")),
    displayOrder: Number.isFinite(Number(fields.DisplayOrder))
      ? Number(fields.DisplayOrder)
      : 9999,
  };
}

async function fetchAirtableRecords() {
  const token = requiredEnv("AIRTABLE_TOKEN");
  const baseId = requiredEnv("AIRTABLE_BASE_ID");
  const tableName = requiredEnv("AIRTABLE_TABLE_NAME");

  const records = [];
  let offset = "";

  do {
    const url = new URL(`https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableName)}`);
    url.searchParams.set("pageSize", "100");
    url.searchParams.set("sort[0][field]", "DisplayOrder");
    url.searchParams.set("sort[0][direction]", "asc");
    if (offset) {
      url.searchParams.set("offset", offset);
    }

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Airtable request failed (${response.status}): ${body}`);
    }

    const page = await response.json();
    if (Array.isArray(page.records)) {
      records.push(...page.records);
    }

    offset = page.offset || "";
  } while (offset);

  return records;
}

async function main() {
  const sourceRecords = await fetchAirtableRecords();
  const makers = sourceRecords
    .map(mapRecord)
    .filter(Boolean)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const payload = {
    festival: "Unfiltered",
    updatedAt: new Date().toISOString(),
    makers,
  };

  const output = path.join(projectRoot, "data", "makers.json");
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(`Wrote ${makers.length} makers to ${output}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
