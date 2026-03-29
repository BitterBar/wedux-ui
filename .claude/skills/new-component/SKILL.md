---
name: new-component
description: Scaffold a new w-* component following the 5-step workflow. Usage - /new-component <component-name>
disable-model-invocation: true
---

Create a new component named `$ARGUMENTS` following the standard workflow:

## Steps

1. **Create component source** at `src/components/$ARGUMENTS/`:
   - `$ARGUMENTS.js` — Component definition with `properties`, `data`, `methods`. Use ES6+ syntax. If using named slots, add `options: { multipleSlots: true }`.
   - `$ARGUMENTS.json` — Component config with `"component": true` and any `usingComponents`.
   - `$ARGUMENTS.wxml` — Template using BEM class names (`w-$ARGUMENTS__element--modifier`).
   - `$ARGUMENTS.scss` — Styles using design tokens from `var(--weui-*)`. No `cursor: pointer`. If icons needed, add `@import '../../styles/iconfont.scss';` at top.

2. **Register route** in `app.json` → `subPackages[0].pages` array — add `"$ARGUMENTS/$ARGUMENTS"`.

3. **Create demo page** at `packages/docs/$ARGUMENTS/`:
   - `$ARGUMENTS.js` — Include `data.props` array documenting all properties (name/type/default/desc).
   - `$ARGUMENTS.wxml` — Use `comp-header` → Props table → demo sections pattern.
   - `$ARGUMENTS.scss` — Import `@import '../../../src/styles/demo.scss';` only if needed.
   - `$ARGUMENTS.json` — Register the component + set `"disableScroll": true`.

4. **Add navigation entry** in `pages/index/index.wxml` — add a navigator item in the appropriate category.

5. **Update CLAUDE.md** — update the project structure diagram and component relations (if the component has parent/child relations).

## Checklist before finishing

- [ ] All design tokens referenced (no hardcoded colors/sizes)
- [ ] BEM naming convention followed
- [ ] `observers`/`relations` callbacks use `function() {}` not arrow functions
- [ ] Demo page `data.props` array is complete
- [ ] Icon font imported if icons are used
