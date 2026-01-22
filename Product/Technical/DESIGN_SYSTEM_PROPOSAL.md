# Design System Proposal: shadcn/ui Migration

> **Status**: DEFERRED (Post-MVP)  
> **Proposed by**: Front-end Engineering  
> **Decision date**: 2026-01-22  
> **Reviewed by**: CTO/PM  

---

## Executive Summary

Proposal to adopt **shadcn/ui** as the component foundation for Career Studio, combined with **Atomic Design** methodology for component organization. Deferred until post-MVP due to timing and risk considerations.

---

## Current Pain Points

### Files with Hardcoded Theme Values (Fixed for MVP)

| Component | Issue | Status |
|-----------|-------|--------|
| `BackgroundShell.tsx` | CSS `dark:hidden` unreliable, switched to React state | ✅ Fixed |
| `CareersLibraryClient.tsx` | Hardcoded `text-white/70` colors | ✅ Fixed |
| `MajorsLibraryClient.tsx` | Hardcoded `text-white/70` colors | ✅ Fixed |
| `MajorProfileClient.tsx` | Extensive hardcoded white text | ✅ Fixed |
| `CareerProfileClient.tsx` | Extensive hardcoded white text | ✅ Fixed |
| `SectionCard.tsx` | Hardcoded `border-white/15` | ✅ Fixed |
| `IntroSection.tsx` | Hardcoded `text-white/70` | ✅ Fixed |
| All profile sections | Various hardcoded colors | ✅ Fixed |

### Root Causes (For Future Reference)

1. **No enforced design tokens** - Developers can use any color value
2. **Missing Tailwind linting** - No warnings for `text-white` instead of `text-foreground`
3. **Inconsistent patterns** - Some components use CSS classes (`dark:hidden`), others use React state

---

## Proposed Solution

### Phase 1: Adopt Atomic Design Structure

Reorganize components into atomic hierarchy:

```
src/components/
├── atoms/           # Buttons, badges, inputs, icons
├── molecules/       # Cards, form groups, nav items
├── organisms/       # Headers, profile cards, library grids
└── templates/       # Page layouts (currently in site/)
```

**Effort**: Low (file moves + imports)  
**Risk**: Low  
**Benefit**: Better organization, clearer component boundaries

### Phase 2: Install shadcn/ui

Components to adopt:

| shadcn/ui Component | Replaces | Priority |
|---------------------|----------|----------|
| `Button` | Custom buttons | High |
| `Card` | `LibraryCard`, `SectionCard` | High |
| `Badge` | Pill components | Medium |
| `Tabs` | Section navigation | Medium |
| `Dialog` | Future modals | Low |
| `Dropdown` | `MobileBucketPillSelect` | Low |
| `Skeleton` | Loading states | Low |

**Effort**: Medium (1-2 days)  
**Risk**: Medium (visual changes require testing)  
**Benefit**: Rock-solid theming, accessibility, TypeScript types

---

## Migration Effort Estimate

| Task | Time | Dependencies |
|------|------|--------------|
| Install & configure shadcn/ui | 1 hour | None |
| Migrate Button components | 2 hours | Config done |
| Migrate Card components | 3 hours | Config done |
| Migrate Tabs/navigation | 2 hours | Config done |
| Update theme variables | 1 hour | All migrations |
| Visual regression testing | 4 hours | All migrations |
| **Total** | **~13 hours** | - |

---

## Risk Mitigation

1. **Visual regression**: Use browser screenshots before/after each component
2. **Incremental migration**: One component type at a time, not big-bang
3. **Feature flags**: Could keep old components during transition
4. **Rollback plan**: Git branches per component migration

---

## When to Trigger This Work

Revisit this proposal if:

- [ ] Theme bugs become recurring (3+ incidents post-launch)
- [ ] New feature requires complex components (modals, dropdowns, date pickers)
- [ ] Dedicated refactoring sprint scheduled
- [ ] Accessibility audit requires compliant components

---

## References

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)

---

## Appendix: Current Theme Token System

```css
/* globals.css - Current implementation */
:root {
  --background: #E2DDBE;     /* Sandy beige */
  --foreground: #1a1a2e;     /* Dark navy */
  --card: #f5f3e7;           /* Light cream */
  --muted-foreground: #64748b;
  --border: #d4d0b8;
}

.dark {
  --background: #071B33;     /* Deep navy */
  --foreground: #ffffff;
  --card: #0d2847;
  --muted-foreground: #94a3b8;
  --border: #1e3a5f;
}
```

This system works but requires discipline. shadcn/ui would enforce it automatically.
