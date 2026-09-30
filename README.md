<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/uxKero/terrane/main/.github/assets/hero-dark.png">
  <img alt="Terrane: every territory, one icon set" src="https://raw.githubusercontent.com/uxKero/terrane/main/.github/assets/hero-light.png" width="100%">
</picture>

<br>

**SVG silhouettes of all 230 countries, 545 regions of 21 countries, 8 continents and national symbols for 189 countries.**
<br>
React components, raw SVG and path strings. One path per icon, 24×24 grid, `currentColor`.

<br>

[Browse the icons](https://terrane.vercel.app) · [npm](https://www.npmjs.com/package/terrane) · [Play Terrane Daily](https://terrane.vercel.app/?daily=1)

</div>

<br>

## Install

```sh
npm i terrane
```

Works with React 18 and 19, ESM and CommonJS, TypeScript included. Each icon is its own export, so bundlers ship only the ones you import.

## Use

```tsx
import { Argentina, Japan, SouthAmerica } from 'terrane'

<Argentina />
<Japan size={32} color="#0a0a0a" />
<SouthAmerica variant="contorno" strokeWidth={2} title="South America" />
```

| prop | default | |
|---|---|---|
| `size` | `24` | width and height |
| `color` | `currentColor` | takes the color of the text around it |
| `variant` | `relleno` | one of the seven variants below |
| `strokeWidth` | `1.5` | outline width in screen pixels, 0.5 to 3, for `contorno` and `duotono` |
| `title` | | accessible label; without it the icon is `aria-hidden` |
| `relieveSrc` | jsDelivr | image for `relieve` and `isometrica`, to self-host |

Any other prop goes to the `<svg>`.

## Seven ways to draw it

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/uxKero/terrane/main/.github/assets/variants-dark.png">
  <img alt="The United States in the seven variants: fill, relief, outline, duotone, badge, hatch and isometric" src="https://raw.githubusercontent.com/uxKero/terrane/main/.github/assets/variants-light.png" width="100%">
</picture>

```tsx
<Brazil variant="insignia" />
<Italy variant="isometrica" />
```

`relieve` and `isometrica` use a 512 px shaded relief image of the territory and ignore `color`. Symbols have no terrain, so those two draw them solid.

## What's inside

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/uxKero/terrane/main/.github/assets/collections-dark.png">
  <img alt="Countries 230, regions 545, symbols 189, continents 8" src="https://raw.githubusercontent.com/uxKero/terrane/main/.github/assets/collections-light.png" width="100%">
</picture>

| category | what | example |
|---|---|---|
| `paises` | 230 countries and territories | `<Argentina />` |
| `provincias-xx` | regions of 21 countries, one category per ISO code: `ar` `au` `bo` `br` `ca` `cl` `cn` `co` `de` `es` `fr` `gb` `in` `it` `jp` `mx` `pe` `py` `ru` `us` `uy` | `<Texas />` |
| `simbolos` | a pictogram of something typical of 189 countries | `<Mate />` |
| `continentes` | 8 continents | `<SouthAmerica />` |

Names that repeat across countries carry the country as a suffix: `GeorgiaUnitedStates`, `AmazonasBrazil`.

## Optical size

Below 20 px every icon switches to a drawing made for small sizes, with fewer points and without specks of tiny islands. It happens on its own when `size` is a number under 20. `formaPara(shape, size)` from `terrane/svg` returns the shape that would be drawn.

## Without React

```js
import { svgDe } from 'terrane/svg'
import { icons, paths } from 'terrane/paths'

const ar = icons.find((i) => i.iso2 === 'AR')
svgDe({ ...ar, d: paths.paises.argentina }, { variante: 'insignia', size: 48 })
```

`icons` carries the metadata of every icon: `slug`, `name`, `categoria`, `grupo`, `iso2`, `iso3`, `centro` and, for regions, `pais`. `paths[categoria][slug]` is the path data.

Raw files, ready for any stack:

```js
import argentina from 'terrane/icons/paises/argentina.svg'
import relief from 'terrane/relieve/paises/argentina.webp'
```

## With your agent

Paste this into Claude Code, Cursor, Codex or any coding agent:

```text
Install terrane (npm i terrane) and use it for country, region and continent icons. Read https://terrane.vercel.app/llms.txt for the component names.
```

## License

MIT. The shapes come from public domain and attribution-licensed datasets (Natural Earth, national mapping agencies through geoBoundaries, IGN Argentina). None is share-alike. Sources and attributions are in [`DATA-LICENSES.md`](./DATA-LICENSES.md).

<br>

<div align="center">

Made by [Kero](https://x.com/uxKero)

</div>
