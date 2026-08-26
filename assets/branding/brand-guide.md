# rankER brand

Three rank bars, tightening left to right. Height and weight increase. The third bar **is** the stem of the R. The bowl and leg open from that stem like a door and lock.

## Mark

- Bars: same width, bottom-aligned, gap 0.9, inset 2.3
- Bar 1 short / light. Bar 2 mid. Bar 3 full height / darkest — the R stem
- Bowl + leg stroke off the stem (not a drawn letter, not a typeset R sitting beside the bars)
- Primary: navy tile `#070B12`, bars `#8B9BB4` → `#C5D0DC` → ice `#E8EEF7`
- Inverse (chrome): ice tile, navy bars 34% → 66% → 100%
- Clear space: none inside the tile. Minimum display 24px

## Motion

One-shot on first paint (header only). `prefers-reduced-motion` skips to the locked mark.

1. Bars grow from the baseline, stagger `--motion-stagger`
2. Bar 3 hits peak
3. Bowl and leg scaleX from the stem and overshoot 5%, then lock

## Type

- Display: Newsreader. Common ligatures on (`fi` `fl` `ff`)
- UI / wordmark: Figtree. **ER** ligature (R tucked −0.12em)
- Figtree has no `liga` table

## Color

| Token | Hex | Use |
|---|---|---|
| Navy | `#070B12` | tile, inverse ink |
| Ice | `#E8EEF7` | type, inverse tile, peak bar |
| Steel | `#C5D0DC` / `#8B9BB4` | rank bars |
| OK / warn / crit | `#7DBA9A` / `#C4A574` / `#C48A86` | score states |
