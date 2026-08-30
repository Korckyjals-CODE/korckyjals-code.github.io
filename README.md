# Korckyjals-CODE portfolio

Public site for **Korckyjals-CODE**, an El Salvador consultancy (est. 2018). Hosted on GitHub Pages at [korckyjals-code.com](https://korckyjals-code.com) from the `main` branch, repository root.

## How to update content

1. Edit [`content.json`](content.json) — the single source of truth for copy, projects, skills, and contact.
2. Follow the field reference in [`CONTENT.md`](CONTENT.md).
3. Commit and push to `main`. GitHub Pages publishes automatically (no build step, no Actions required).

Keep the site anonymous: brand identity only — no personal names, photos, phone numbers, home addresses, or personal LinkedIn.

Public contact: `info@korckyjals-code.com`  
GitHub organization: [github.com/Korckyjals-CODE](https://github.com/Korckyjals-CODE)

## Local preview

Serve the repo root over HTTP so `fetch('content.json')` works (opening `index.html` as a file URL will not load content):

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Stack

- Vanilla `index.html` + `css/styles.css` + `js/app.js`
- Bilingual EN/ES toggle (persisted in `localStorage`)
- Dark/light theme toggle
- `CNAME` → `korckyjals-code.com`
- Noscript fallback with brand, short pitch, and contact email

## GitHub Pages

Source: branch `main`, folder `/` (site root). Custom domain: `korckyjals-code.com`.
