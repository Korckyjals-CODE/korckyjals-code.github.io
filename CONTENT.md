# content.json schema

`content.json` is the single source of truth for the Korckyjals-CODE portfolio. Edit that file, commit, and push to `main` — GitHub Pages serves the updated site with no build step.

## Privacy rules

Do **not** put a person’s name, photo, phone number, home address, government ID, personal LinkedIn, or other personal identifying information in this file (or anywhere else in the repo). The public identity is the brand **Korckyjals-CODE** only. Prefer placeholders like `[Project title]` or `[Year]` when real non-personal data is not ready.

## Top-level keys

| Key | Purpose |
| --- | --- |
| `site` | Brand, tagline, languages, contact email, org-level social links, theme default |
| `ui` | Chrome copy (nav labels, theme/language controls, loading/error strings) |
| `hero` | First viewport headline, subhead, CTAs |
| `about` | Consultancy overview (not a personal bio) |
| `learningPath` | Timeline of skills/topics |
| `experience` | Consultancy roles/engagements without client PII |
| `projects` | Public projects with optional URLs |
| `skills` | Grouped skill lists |
| `contact` | Contact section copy |
| `footer` | Footer note and copyright (`{year}` is replaced at render time) |

## Bilingual fields

Most user-facing strings are objects with `en` and `es` keys:

```json
{ "en": "About the consultancy", "es": "Acerca de la consultora" }
```

Plain strings are allowed where language does not matter (brand name, email, stack tags, project titles that are product/repo names).

## `site`

- `brand` (string): public brand name
- `tagline` (i18n): short positioning line
- `languages` (string[]): supported codes, typically `["en","es"]`
- `defaultLanguage` (string): used when no `localStorage` preference exists
- `email` (string): public inbox only — `info@korckyjals-code.com`
- `social` (array): `{ id, label (i18n), url }` — org-level only (GitHub org is fine)
- `productLinks` (array, optional): `{ match: string[], url }` — first-occurrence inline links in **About paragraphs only**
- `themeDefault` (`"dark"` | `"light"`)
- `foundedYear` (number, optional metadata)
- `location` (i18n, optional)

## Section item shapes

**learningPath.items**

- `period`, `title` (i18n), `description` (i18n), `topics` (string[])

**experience.items**

- `role` (i18n), `org`, `period`, `stack` (string[]), `outcomes` (i18n[])

**projects.items**

- `title`, `blurb` (i18n), `tags` (string[]), `url` (string, optional), `status` (i18n, optional)

**skills.groups**

- `name` (i18n), `items` (string[])

## Persistence in the browser

- Language: `localStorage` key `kc-lang`
- Theme: `localStorage` key `kc-theme`

The page fetches `/content.json` (or `content.json` relative to the site root) and renders the full layout in `js/app.js`.
