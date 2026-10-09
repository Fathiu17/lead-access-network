# LEAD ACCESS Network (LAN)

> The trusted media and information network for Free Fire esports across Africa.

A fast, static, production‑ready blog built with **Eleventy (11ty)**, **Nunjucks**,
**vanilla CSS** and **vanilla JavaScript**. Deployed on **Netlify** with a
Git‑based CMS at `/admin`.

---

## ✨ Features

| Feature | Details |
| --- | --- |
| Static site generator | Eleventy 2.x |
| Templating | Nunjucks |
| Styling | Hand‑written mobile‑first CSS (no framework) |
| Scripting | Vanilla JS — zero dependencies |
| Content | Markdown with front matter |
| Categories | News, Rosters, Tournaments, Rankings, Interviews, Insights |
| Category filtering | Client‑side, deep‑linkable via `?category=` |
| Live search | Filters posts by title / excerpt / body text in real time |
| Pagination | 6 posts per page (server‑rendered by Eleventy) |
| CMS | Sveltia / Decap CMS at `/admin` (Git‑based) |
| Responsive | Mobile → tablet → desktop breakpoints at 480px / 768px / 1024px |

---

## 🎨 Brand

| Token | Value | Usage |
| --- | --- | --- |
| `--yellow` | `#FFD700` | Primary accent, buttons, badges, links |
| `--white` | `#FFFFFF` | Base text |
| `--black` | `#0A0A0A` | Base background |
| `--deep-blue` | `#0A1F44` | Cards, borders, gradients |
| `--gray` | `#1A1A1A` | Secondary surfaces |

Fonts: **Chakra Petch** (headings) + **Inter** (body), loaded from Google Fonts.

---

## 📁 Project structure

```
lead-access-network/
├── .eleventy.js              # Eleventy configuration
├── netlify.toml              # Netlify build, redirects and headers
├── package.json
├── README.md
├── admin/
│   ├── index.html            # CMS entry point → /admin
│   └── config.yml            # CMS collections, fields, media paths
└── src/
    ├── _data/
    │   └── site.json         # Global site data (nav, socials, categories)
    ├── _includes/
    │   ├── base.njk          # HTML shell
    │   ├── header.njk        # Sticky header + hamburger
    │   ├── footer.njk        # Footer
    │   ├── icons.njk         # Inline SVG icon macro
    │   ├── post-card.njk     # Reusable post card
    │   └── post.njk          # ⚠️ Single post layout (must live in _includes)
    ├── images/uploads/       # CMS media library
    ├── css/style.css
    ├── js/main.js
    ├── posts/
    │   ├── posts.json        # Directory data (layout, tags, permalink)
    │   └── sample-post.md
    ├── index.njk             # Homepage (hero + latest posts)
    ├── posts.njk             # Paginated listing + search + filters
    └── 404.njk               # 404 page
```

> ### ⚠️ Note on `post.njk`
> The single‑post layout lives at **`src/_includes/post.njk`**, not `src/post.njk`.
> Eleventy resolves `layout: post.njk` against the **includes directory**
> (`src/_includes`). Putting it anywhere else will cause a
> `TemplateLayoutPathResolver` error at build time.

---

## 🚀 Quick start (local)

### Requirements
- **Node.js 18 or 20** (`node -v`)
- npm 9+

### Install & run

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server with live reload
npm run dev
# → http://localhost:8080

# 3. Build for production
npm run build
# → outputs to _site/
```

The CMS is available locally at <http://localhost:8080/admin/> (it will ask for
a GitHub login — that is expected).

---

## 📝 Writing a post

Create a Markdown file in `src/posts/`. Only these front‑matter fields are
required — `layout`, `tags` and `permalink` are injected automatically by
`src/posts/posts.json`.

```markdown
---
title: "Free Fire Continental Series: African Qualifier Brackets Revealed"
date: 2026-02-03T14:30:00.000Z
category: "Tournaments"
cover: "/images/uploads/bracket.jpg"
excerpt: "Sixteen teams. Four slots. Here is the full bracket for the African qualifier."
---

Your article body goes here.
```

### Front matter reference

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `title` | string | ✅ | Post headline |
| `date` | datetime | ✅ | Drives ordering + display |
| `category` | string | ✅ | One of the six categories |
| `cover` | string | ✅ | `/images/uploads/<file>` |
| `excerpt` | string | ✅ | Shown on cards and previews |
| `author` | string | — | Optional byline |

Images are served from `/images/uploads/…` because `src/images` is
passthrough‑copied to `/images`.

---

## 🌐 Deploy to GitHub + Netlify

### 1. Push to GitHub

```bash
# Replace YOUR_GITHUB_USERNAME with your GitHub username
git init
git add .
git commit -m "Initial commit: LEAD ACCESS Network"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/lead-access-network.git
git push -u origin main
```

### 2. Create the Netlify site

1. Go to <https://app.netlify.com> → **Add new site** → **Import an existing project**.
2. Choose **GitHub** → authorise → select `YOUR_GITHUB_USERNAME/lead-access-network`.
3. Netlify reads `netlify.toml` automatically. Confirm:
   - **Build command:** `npx @11ty/eleventy`
   - **Publish directory:** `_site`
   - **Node version:** `20`
4. Click **Deploy site**.

### 3. Update your site URL

Once deployed, copy your Netlify URL (e.g. `https://lan-media.netlify.app`) and
update it in **two** places:

- `src/_data/site.json` → `"url"`
- `admin/config.yml` → `site_url` and `display_url`

Then commit and push.

---

## 🔐 CMS authentication (Netlify Identity + Git Gateway)

1. In Netlify, open your site → **Site configuration** → **Identity** → **Enable Identity**.
2. Under **Identity → Registration**, set **Registration preferences** to
   **Invite only** (recommended for a private editorial team).
3. Scroll to **Services → Git Gateway** and click **Enable Git Gateway**.
4. Go to the **Identity** tab → **Invite users** → enter your email address.
5. Open the invite email → click the link → set a password.
6. Visit `https://YOUR-SITE-NAME.netlify.app/admin/` and log in.

You can now create posts, upload cover images and publish — every change is
committed straight to your GitHub repository as a Markdown file, and Netlify
rebuilds the site automatically.

### Using GitHub OAuth instead (no Netlify Identity)

Edit `admin/config.yml`:

```yaml
backend:
  name: github
  repo: YOUR_GITHUB_USERNAME/lead-access-network
  branch: main
```

Then follow the Netlify docs to register an OAuth app and set the
`GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` environment variables.

### Using Pages CMS instead (no OAuth at all)

1. Delete or keep `admin/config.yml` (harmless either way).
2. Ensure the `.pages.yml` file at the repo root is present (see the
   “Pages CMS alternative” section above).
3. Go to <https://app.pagescms.org>, sign in with GitHub and select your
   repository. Your Posts collection will appear immediately.

---

## 🧩 How the client‑side filtering works

`src/js/main.js` powers three things:

1. **Mobile menu** — toggles `.is-open` on `#primary-nav`.
2. **Category filter** — reads `data-category` from each `.post-card`, and
   `data-filter` from each `.filter-btn`. Clicking a button also updates the URL
   (`?category=Rosters`) with `history.replaceState`, so links are shareable.
3. **Live search** — matches the search box value against each card's text
   content (title, category, date and excerpt).

Because pagination is server‑rendered by Eleventy, filtering applies to the
posts **currently on screen**. When a filter or search is active, the pagination
control is hidden so results are never ambiguous. For a fully global search,
either lower `size` to a large number or add an Eleventy‑generated JSON index.

Deep links such as `/posts/?category=Interviews` are read on page load and the
matching filter button is activated automatically — this is how the header
navigation links work.

---

## 🛠 Troubleshooting

| Problem | Fix |
| --- | --- |
| `TemplateLayoutPathResolver: Could not find layout post.njk` | Make sure `src/_includes/post.njk` exists. |
| Images 404 after upload | Check that `media_folder` is `src/images/uploads` and `public_folder` is `/images/uploads`. |
| `/admin` shows a blank page | Confirm `admin/index.html` and `admin/config.yml` were copied — `admin` is passthrough‑copied in `.eleventy.js`. |
| Posts appear in the wrong order | Ensure `date` in front matter is a full ISO timestamp (`2026-01-15T09:00:00.000Z`). |
| Build fails on Netlify with an old Node version | `NODE_VERSION = "20"` is set in `netlify.toml` — clear the build cache and redeploy. |
| Category filter does nothing | Confirm each card rendered from `post-card.njk` has a `data-category` attribute. |

---

## 📄 License

© 2026 LEAD ACCESS Network. All rights reserved.
Content and brand assets may not be reproduced without permission.
