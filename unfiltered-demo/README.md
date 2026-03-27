# Unfiltered Demo (Airtable CMS + Static Site)

This folder contains a one-page demo that uses Airtable as a lightweight CMS for the **Makers** section.

## Airtable Fields

Create table `Makers` with fields:

- `Name`
- `Region`
- `Varietals`
- `Bio`
- `Website`
- `Instagram` (optional)
- `Photo` (attachment)
- `DisplayOrder`

## GitHub Secrets

Set repository secrets so workflow can sync Airtable data:

- `AIRTABLE_TOKEN`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_TABLE_NAME`

Without these secrets, the workflow deploys using seeded data from `data/makers.json`.
