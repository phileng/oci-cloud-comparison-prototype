# Design QA

final result: passed

source visual truth path: `/Users/pheng/Codex/oci-cloud-comparison-prototype/qa/reference-option-3-migration-lens.png`
implementation screenshot path: `/Users/pheng/Codex/oci-cloud-comparison-prototype/qa/implementation-browser-599x897.png`
local URL: `http://127.0.0.1:5173/`
viewport: `599 x 897` in the available in-app Browser surface

## Findings

- No P0/P1/P2 blockers found in the verified local prototype.

- [P3] Available Browser viewport is narrower than the 1440 x 1024 source concept.
  Location: verification environment.
  Evidence: the selected mock is a desktop dashboard concept; the available in-app Browser surface reported `599 x 897`.
  Impact: desktop proportions cannot be captured in a single Browser screenshot here, but the implementation uses the same dark shell, light workspace, provider comparison columns, central architecture stack, filters, metrics, and inspector pattern. The comparison board remains horizontally scrollable in the narrow viewport.
  Fix: open `http://127.0.0.1:5173/` in a wider browser window for full desktop review.

## Checked Surfaces

- Fonts and typography: system UI stack, compact dashboard type scale, uppercase layer labels, readable body copy, no negative letter spacing.
- Spacing and layout rhythm: dark global shell, light workspace, provider columns, architecture stack, metrics dock, and responsive horizontal board behavior.
- Colors and visual tokens: graphite shell, white workspace, OCI red accent, provider accent colors, green/blue/yellow equivalence states, and severity colors.
- Image quality and asset fidelity: no external image assets were required for the prototype implementation; provider identities are text-based to avoid fake logos.
- Copy and content: UI labels, service mappings, and disclaimer are present. The dataset is explicitly marked as representative and not authoritative.

## Interaction Checks

- Search for `cache` filters the board to the Cache layer and provider cache services.
- Inspector opens from `Inspect layer` and shows provider mappings plus catalog source links.
- Selecting `Web (Containers)` updates the active stack layer and the metrics panel.
- `Show gaps` toggle changes checked state off and back on.
- Production build succeeds with `npm run build`.

## Open Questions

- The service mapping dataset is intentionally a representative seed. A real "all services" comparison should be generated from current official provider catalogs and reviewed by cloud-domain owners before use in architecture decisions.

## Implementation Checklist

- Keep the local server running for review.
- Replace the representative service dataset with authoritative catalog data when moving beyond demo scope.
- Add desktop screenshots from a wide browser window during the next design review pass.
