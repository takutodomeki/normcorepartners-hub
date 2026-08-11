# Normcore Partners — hub

The homepage and the tools index for `normcorepartners.net`. Next.js, no database,
no backend. The hub never calls a tool's code — it only links out.

## Adding a tool

Edit one file: `data/tools.json`. Add an object, push, done.

```json
{
  "id": "dispatch",
  "name": "Dispatch",
  "sentence": "See every press release a campaign has put out, in one place, in order.",
  "url": "https://dispatch.normcorepartners.net",
  "status": "live",
  "launched": "2026-08-01",
  "lastChecked": "2026-08-01"
}
```

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Lowercase slug, no spaces. Becomes the anchor link. |
| `name` | yes | Display name. |
| `sentence` | yes | One sentence. What a person can *do* or *see*. No technology names. |
| `url` | yes | Full subdomain URL. |
| `status` | yes | `live` · `beta` · `archived` · `broken` |
| `launched` | yes | `YYYY-MM-DD` |
| `lastChecked` | yes | `YYYY-MM-DD` |
| `notes` | no | URL to a longer write-up. Omit until written. |
| `retireBy` | no | `YYYY-MM-DD`. Past this date the entry says it may be out of date. |

`data/tools.example.json` is a reference copy, not read by the site. Resist adding
fields — every field is a thing that has to be filled in correctly forever.

## Quarterly check

Open `/tools?audit`. It shows days since `lastChecked` for every tool and flags
anything over 90 days. Not linked from anywhere public; it exposes nothing that
isn't already in the manifest. Open each tool, confirm it does what its sentence
claims, then update `lastChecked` and `status`.

## The typography

Everything is Times New Roman stretched horizontally by 15%. Times has no expanded
width axis, so `font-stretch` does nothing to it. Instead `.stretch` in
`app/globals.css` authors its content box at `100% / 1.15` and scales it back out
with `transform: scaleX(1.15)`. Glyphs end up 15% wider at unchanged height, and
the scaled width resolves to exactly the container width, so there is no overflow.

Four rules keep it well-behaved:

1. **Apply `.stretch` once.** Nesting two compounds to 1.32×. The wrapper lives in
   `app/layout.tsx`; pages should not add their own.
2. **Never add `will-change: transform` or `translateZ(0)` to it.** Promoting it to
   its own compositor layer is what makes scaled text render blurry. Without it,
   every engine rasterises glyphs after the transform and text stays sharp.
3. **No `position: fixed` inside it.** A transform makes the wrapper their
   containing block, which breaks them silently.
4. **Page gutters go on `.page`, outside the transform.** Only content stretches,
   so margins stay true. Horizontal spacing *inside* the wrapper is authored at
   1/1.15 of its rendered size.

`.masthead__mark` counter-scales itself back to 1.0 so the globe stays a circle.
Delete that rule if the mark should stretch with everything else.

Printing reverts to unstretched Times, where transform support across print
engines is still uneven.

## Local development

```bash
npm install && npm run dev
```

Then `http://localhost:3000` and `http://localhost:3000/tools?audit`.
