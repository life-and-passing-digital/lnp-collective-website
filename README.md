# LnP Collective — one-page website

A single-page marketing site for **LnP Collective**, a digital product studio that
designs and builds websites, apps, and digital products across industries. The visual
direction takes after the confident, premium minimalism of bendingspoons.com, with an
original identity built for LnP.

## View it

It's a single self-contained file — just open it:

```bash
open index.html          # macOS
# or serve it:
python3 -m http.server 3000   # then visit http://localhost:3000
```

No build step, no network calls. Fonts are embedded, so it renders identically
offline and behind restrictive proxies.

## Design system

- **Palette — Ink · Paper · Bronze.** Cool greige paper (`#EAE8E1`), near-black ink
  (`#15161A`) for the full-bleed gallery sections, and a restrained metallic bronze
  (`#B07D45`) used only for hairlines, index numerals, the signature word, and focus rings.
- **Type.** Space Grotesk (display) · Inter (body) · JetBrains Mono (labels) — embedded as
  latin WOFF2 subsets.
- **Signature.** A hero word that cycles through industries (fintech · healthcare · retail ·
  media · climate …) — content-true motion that says "across industries" without a paragraph.
- **Structure.** Sticky nav → hero → capability marquee → scale stats → capabilities index →
  dark portfolio gallery → process → closing CTA → footer.

## Accessibility & craft

- Responsive from 390px up; mobile nav collapses to a menu.
- Visible keyboard focus, skip link, semantic landmarks, `aria` on interactive bits.
- `prefers-reduced-motion` respected (marquee, reveals, and the word cycler all stand down).
- Only `transform`/`opacity` are animated.

## Notes on placeholders

Copy, stats, project names, and the portfolio artwork are realistic placeholders. The work
thumbnails are generated in pure CSS (on-brand abstract panels) so there are no broken-image
dependencies — swap in real case-study imagery when available.
