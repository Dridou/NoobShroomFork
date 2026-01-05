# Scripts Overview

This document describes each script under `scripts/` and how to use it.

## Functional View (Why These Scripts Exist)
These scripts are part of the content pipeline, not the runtime app.

Flow:
1) Source content lives in the DB as HTML sections or shop descriptions.
2) Conversion/export scripts turn that content into Markdown files in Git.
3) Publishing scripts send Git content back to the API and DB.
4) The app renders those content blocks consistently on the frontend.

In practice:
- You run conversion/export scripts only when migrating or updating posts.
- The app does not call these scripts at runtime.

## publish.js
Purpose: Send a publish payload to the admin publish API.

Inputs:
- `--file <path>` (required) JSON payload file.
- `--url <url>` (optional) API URL. Default: `http://localhost:3000/api/admin/publish`.
- `--token <token>` (required) Bearer token.
- Env vars: `PUBLISH_FILE`, `PUBLISH_API_URL`, `PUBLISH_TOKEN`.

Behavior:
- Reads the JSON payload file, POSTs it to the API with `Authorization: Bearer <token>`.
- Prints JSON response if possible; otherwise prints raw text.
- Exits with code 1 on error.

Example:
```
node scripts/publish.js --file ./payload.json --token YOUR_TOKEN
```

## preview.js
Purpose: Send a publish payload in preview mode.

Inputs:
- Same flags and env vars as `publish.js`.

Behavior:
- Adds `preview: true` to the payload and POSTs to `.../api/admin/publish?preview=true`.
- Prints JSON response if possible; otherwise prints raw text.
- Exits with code 1 on error.

Example:
```
node scripts/preview.js --file ./payload.json --token YOUR_TOKEN
```

## publish-post-from-files.js
Purpose: Publish a single post from `content/posts/<slug>` files.

Inputs:
- `<slug>` (optional) Post slug if using the default folder layout.
- `--dir <path>` (optional) Custom post directory path.
- `--url <url>` (optional) API URL. Default: `http://localhost:3000/api/admin/publish`.
- `--token <token>` (required) Bearer token.
- `--preview` (optional) Preview mode (no DB writes).
- `--dry-run` (optional) Print payload without calling the API.

Behavior:
- Reads `post.json` and `sections/*.md`.
- Builds a publish payload with section `contentBlocks` as Markdown or HTML.
- Sends the payload to the publish API.

Example:
```
node scripts/publish-post-from-files.js what-to-buy-in-shops --token YOUR_TOKEN
```

## export-posts-to-files.js
Purpose: Export posts + sections from the DB into Markdown files under `content/posts/`.

Inputs:
- `<slug>` (optional) Post slug.
- `--all` (optional) Export all posts.
- `--output <dir>` (optional) Output folder. Default: `content/posts`.
- `--overwrite` (optional) Overwrite existing files.
- `--dry-run` (optional) Print summary without writing.

Behavior:
- Loads `.env.local` and `.env` for Prisma connection.
- Writes `post.json` and ordered `sections/*.md` with front matter.
- Converts HTML or content blocks into Markdown where possible.

Example:
```
node scripts/export-posts-to-files.js --all --output content/posts
```

## convert-sections-to-content-blocks.js
Purpose: Convert Section HTML content into Markdown content blocks.

Inputs:
- `<postId|slug>` (required) Post id or slug.
- `--overwrite` (optional) Rebuild content blocks even if they already exist.
- `--dry-run` (optional) Print a summary without writing updates.

Behavior:
- Loads `.env.local` and `.env` for Prisma connection.
- Converts each section `content` into `contentBlocks` using Markdown blocks.
- Updates sections in the database.

Example:
```
node scripts/convert-sections-to-content-blocks.js arrowgod-class-guide --overwrite
```

## convert-shops-to-sections.js
Purpose: Convert Shop descriptions into Section content blocks and link shops to sections.

Inputs:
- `<postId|slug>` (required) Post id or slug.
- `--overwrite` (optional) Rebuild linked sections even if they already exist.

Behavior:
- Loads `.env.local` and `.env` for Prisma connection.
- For each shop, creates or updates a Section (type `shop`) with Markdown blocks.
- Links each shop to its section via `sectionId`.

Example:
```
node scripts/convert-shops-to-sections.js what-to-buy-in-shops --overwrite
```

## convert-codes-post-content-blocks.js
Purpose: Custom converter for the Legend of Mushroom codes post.

Inputs:
- Optional post id as first arg (defaults to the codes post id).

Behavior:
- Loads `.env.local` and `.env` for Prisma connection.
- Targets three known section ids (active/redeem/release).
- Extracts lists/headings/paragraphs from the existing HTML and saves Markdown blocks.
- This is a one-off migration for the codes post structure.

Example:
```
node scripts/convert-codes-post-content-blocks.js
```

## lib/markdownBlocks.js
Purpose: Shared HTML -> Markdown conversion helpers used by the conversion scripts.

Exports:
- `inlineHtmlToMarkdown(input)` for inline conversion.
- `htmlToMarkdownBlocks(input)` for full block conversion.
- `htmlToMarkdownString(input)` for full conversion into Markdown text.
- `blocksToMarkdown(blocks)` for block list -> Markdown text.

Behavior:
- Strips HTML tags, converts inline formatting to Markdown, and produces block objects.
- Handles `p`, `h1-h6`, `ul`, `ol`, and `table` blocks.
- Converts `img` to Markdown image syntax and links to Markdown links.

Note:
- This file is a library, not a standalone script.

## lib/frontMatter.js
Purpose: Parse simple front matter in section files.

Exports:
- `parseFrontMatter(input)` for extracting front matter + body.

Behavior:
- Reads key/value front matter lines (simple YAML format).
- Returns `{ data, body }` for use in publishing.

Note:
- This file is a library, not a standalone script.
