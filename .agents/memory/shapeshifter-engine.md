---
name: Shapeshifter Engine Architecture
description: How the 4-goal layout switching system works in HomeClient.tsx
---

## Rule
Each goal (get-clients, build-brand, launch-product, show-portfolio) renders a completely different JSX component. The outer `<div key={selectedGoal}>` causes React to fully remount the layout on goal change, triggering `layout-enter` CSS animation. Industry changes only re-key the hero text block.

## Why
User explicitly rejected CSS-only variable swapping as "generic agency template". The experience must feel like 16 different websites. Only structural JSX differences achieve this.

## How to apply
- SelectorBar is OUTSIDE the keyed div (stays stable, no flicker on selection)
- Modals are OUTSIDE the keyed div (don't unmount when goal switches)
- `key={selectedGoal}` on main content div → full remount + fade-in animation
- `key={heroKey}` (goal+industry) on hero text → text re-animates on industry change too
- CSS var `--accent` pushed to `document.documentElement` in useEffect → Nav/Footer respond
