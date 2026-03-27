const MAKERS_URL = "./data/makers.json";
const grid = document.getElementById("makers-grid");

if (!grid) {
  throw new Error("Missing #makers-grid container");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderState(message) {
  grid.innerHTML = `<p class="state">${escapeHtml(message)}</p>`;
}

function makerCard(maker) {
  const name = escapeHtml(maker.name || "Unnamed Maker");
  const region = escapeHtml(maker.region || "Region TBD");
  const varietals = escapeHtml(maker.varietals || "Varietals TBD");
  const bio = escapeHtml(maker.bio || "Bio coming soon.");
  const website = maker.website ? `<a href="${maker.website}" target="_blank" rel="noreferrer">Website</a>` : "";
  const instagram = maker.instagram ? `<a href="${maker.instagram}" target="_blank" rel="noreferrer">Instagram</a>` : "";
  const photo = maker.photoUrl || "";

  return `
    <article class="maker-card">
      ${photo ? `<img class="maker-image" src="${photo}" alt="Photo of ${name}" loading="lazy" />` : '<div class="maker-image" aria-hidden="true"></div>'}
      <div class="maker-content">
        <h3>${name}</h3>
        <p class="maker-meta">${region} • ${varietals}</p>
        <p class="maker-bio">${bio}</p>
        <p class="maker-links">${website} ${instagram}</p>
      </div>
    </article>
  `;
}

async function loadMakers() {
  try {
    const response = await fetch(MAKERS_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load makers data (${response.status})`);
    }

    const payload = await response.json();
    const makers = Array.isArray(payload.makers) ? payload.makers : [];

    if (!makers.length) {
      renderState("No makers published yet. Update Airtable and run the sync workflow.");
      return;
    }

    grid.innerHTML = makers
      .sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999))
      .map(makerCard)
      .join("\n");
  } catch (error) {
    console.error(error);
    renderState("Could not load maker data. Check data/makers.json or run Airtable sync.");
  }
}

loadMakers();
