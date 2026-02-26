# Brimair — Architecture Blueprint v4.5 (Final Locked)

---

> **Model:** Document-First · Patch-Based · Local-First · Framer-Class UI · Mobile-Native · RTL-Native · Multi-Source CMS · Invite-Only · RBAC
>
> **Status:** Execution Blueprint — No Feature Drift Allowed
>
> **Consolidates:** v4.0 + v4.2 (CMS) + v4.3 (Auth) + Mobile Design System

---

## 1) Project Vision

Brimair is a professional visual creation platform combining:

- **Studio** — Canva-class typography-first design editor
- **Builder** — Framer-class responsive website builder
- **CMS** — Multi-source content system
- **Static Publishing** — Astro-first export system
- **Access Control** — Invite-only with role-based permissions

The web application delivers Framer-class visual identity with a dedicated mobile-native experience — not a responsive adaptation.

---

## 2) Core Principles

1. Document is the single source of truth
2. All edits are Patch-based
3. Local-first persistence
4. Supabase cloud authority
5. Mobile is a native UI mode — not responsive CSS
6. RTL-native from day one
7. Brand-first styling
8. Strict engine isolation
9. Framer-class visual identity
10. Design tokens are the only source for visual values
11. CMS is source-agnostic — content lives where users want it
12. Registration is invite-only — no public sign-up
13. Every file and feature is gated by a Role
14. Permissions enforced at both UI and API layers

---

## 3) Complete Monorepo Structure

```
brimair/
├── apps/
│   ├── web/
│   │   └── src/
│   │       ├── design-system/
│   │       │   ├── tokens/
│   │       │   │   ├── colors.ts
│   │       │   │   ├── colors-semantic.ts
│   │       │   │   ├── spacing.ts
│   │       │   │   ├── radius.ts
│   │       │   │   ├── shadows.ts
│   │       │   │   ├── blur.ts
│   │       │   │   ├── typography-tokens.ts
│   │       │   │   ├── z-index.ts
│   │       │   │   ├── breakpoints.ts
│   │       │   │   ├── motion-tokens.ts
│   │       │   │   └── mobile-overrides.ts
│   │       │   ├── themes/
│   │       │   │   ├── dark-theme.ts
│   │       │   │   ├── light-theme.ts
│   │       │   │   └── theme-provider.tsx
│   │       │   └── css/
│   │       │       ├── reset.css
│   │       │       ├── variables.css
│   │       │       ├── rtl-overrides.css
│   │       │       └── mobile-overrides.css
│   │       ├── components/
│   │       │   ├── ui/
│   │       │   │   ├── surface.tsx
│   │       │   │   ├── glass-panel.tsx
│   │       │   │   ├── floating-panel.tsx
│   │       │   │   ├── icon-button.tsx
│   │       │   │   ├── button.tsx
│   │       │   │   ├── input.tsx
│   │       │   │   ├── slider.tsx
│   │       │   │   ├── toggle.tsx
│   │       │   │   ├── select.tsx
│   │       │   │   ├── color-swatch.tsx
│   │       │   │   ├── tooltip.tsx
│   │       │   │   ├── dropdown-menu.tsx
│   │       │   │   ├── context-menu.tsx
│   │       │   │   ├── separator.tsx
│   │       │   │   ├── badge.tsx
│   │       │   │   ├── kbd.tsx
│   │       │   │   ├── progress.tsx
│   │       │   │   ├── skeleton.tsx
│   │       │   │   ├── scroll-area.tsx
│   │       │   │   └── index.ts
│   │       │   ├── motion/
│   │       │   │   ├── animated-presence.tsx
│   │       │   │   ├── slide-panel.tsx
│   │       │   │   ├── fade-scale.tsx
│   │       │   │   ├── spring-drag.tsx
│   │       │   │   ├── stagger-list.tsx
│   │       │   │   ├── gesture-wrapper.tsx
│   │       │   │   ├── layout-transition.tsx
│   │       │   │   └── presets.ts
│   │       │   ├── shell/
│   │       │   │   ├── app-shell.tsx
│   │       │   │   ├── desktop-layout.tsx
│   │       │   │   ├── mobile-layout.tsx
│   │       │   │   ├── sidebar.tsx
│   │       │   │   ├── sidebar-rail.tsx
│   │       │   │   ├── inspector.tsx
│   │       │   │   ├── workspace.tsx
│   │       │   │   ├── toolbar.tsx
│   │       │   │   ├── status-bar.tsx
│   │       │   │   └── command-palette.tsx
│   │       │   ├── mobile/
│   │       │   │   ├── bottom-sheet.tsx
│   │       │   │   ├── bottom-sheet-handle.tsx
│   │       │   │   ├── bottom-sheet-backdrop.tsx
│   │       │   │   ├── bottom-sheet-scroll-lock.tsx
│   │       │   │   ├── bottom-rail.tsx
│   │       │   │   ├── bottom-rail-indicator.tsx
│   │       │   │   ├── mobile-toolbar.tsx
│   │       │   │   ├── mobile-toolbar-autohide.tsx
│   │       │   │   ├── mobile-inspector.tsx
│   │       │   │   ├── mobile-inspector-tabs.tsx
│   │       │   │   ├── mobile-inspector-stepper.tsx
│   │       │   │   ├── mobile-layers.tsx
│   │       │   │   ├── mobile-layers-swipe.tsx
│   │       │   │   ├── mobile-layers-reorder.tsx
│   │       │   │   ├── mobile-color-picker.tsx
│   │       │   │   ├── mobile-color-picker-sliders.tsx
│   │       │   │   ├── mobile-font-picker.tsx
│   │       │   │   ├── mobile-font-picker-search.tsx
│   │       │   │   ├── mobile-context-menu.tsx
│   │       │   │   ├── mobile-toast.tsx
│   │       │   │   ├── mobile-toast-stack.tsx
│   │       │   │   ├── swipe-panel.tsx
│   │       │   │   ├── pull-to-action.tsx
│   │       │   │   ├── pull-to-action-indicator.tsx
│   │       │   │   ├── adaptive-input.tsx
│   │       │   │   ├── adaptive-input-toolbar.tsx
│   │       │   │   ├── haptic-feedback.ts
│   │       │   │   ├── safe-area-provider.tsx
│   │       │   │   ├── orientation-handler.tsx
│   │       │   │   ├── orientation-layout.tsx
│   │       │   │   ├── keyboard-handler.tsx
│   │       │   │   └── index.ts
│   │       │   ├── panels/
│   │       │   │   ├── layers-panel.tsx
│   │       │   │   ├── history-panel.tsx
│   │       │   │   ├── assets-panel.tsx
│   │       │   │   ├── components-panel.tsx
│   │       │   │   ├── brand-panel.tsx
│   │       │   │   └── cms-panel.tsx
│   │       │   ├── cms/
│   │       │   │   ├── source-picker.tsx
│   │       │   │   ├── collection-browser.tsx
│   │       │   │   ├── record-list.tsx
│   │       │   │   ├── record-card.tsx
│   │       │   │   ├── field-mapper.tsx
│   │       │   │   ├── sync-status.tsx
│   │       │   │   ├── source-settings.tsx
│   │       │   │   └── content-binding.tsx
│   │       │   ├── auth/
│   │       │   │   ├── invite-gate.tsx
│   │       │   │   ├── invite-manager.tsx
│   │       │   │   ├── invite-form.tsx
│   │       │   │   ├── role-picker.tsx
│   │       │   │   ├── permission-editor.tsx
│   │       │   │   ├── permission-badge.tsx
│   │       │   │   ├── member-list.tsx
│   │       │   │   ├── access-denied.tsx
│   │       │   │   └── route-guard.tsx
│   │       │   └── system/
│   │       │       ├── offline-indicator.tsx
│   │       │       ├── error-fallback.tsx
│   │       │       └── recovery-prompt.tsx
│   │       ├── hooks/
│   │       │   ├── use-breakpoint.ts
│   │       │   ├── use-platform.ts
│   │       │   ├── use-theme.ts
│   │       │   ├── use-direction.ts
│   │       │   ├── use-keyboard-visible.ts
│   │       │   ├── use-online-status.ts
│   │       │   ├── use-reduced-motion.ts
│   │       │   ├── use-cms-source.ts
│   │       │   ├── use-collection.ts
│   │       │   ├── use-auth.ts
│   │       │   ├── use-permissions.ts
│   │       │   ├── use-bottom-sheet.ts
│   │       │   ├── use-gesture-state.ts
│   │       │   ├── use-haptic.ts
│   │       │   ├── use-safe-area.ts
│   │       │   ├── use-orientation.ts
│   │       │   ├── use-touch-device.ts
│   │       │   ├── use-thumb-zone.ts
│   │       │   └── use-visual-viewport.ts
│   │       ├── i18n/
│   │       │   ├── ar.json
│   │       │   ├── en.json
│   │       │   └── provider.tsx
│   │       ├── layouts/
│   │       │   ├── studio-layout.tsx
│   │       │   └── builder-layout.tsx
│   │       ├── pages/
│   │       │   ├── join.tsx
│   │       │   ├── login.tsx
│   │       │   ├── dashboard.tsx
│   │       │   ├── studio.tsx
│   │       │   ├── builder.tsx
│   │       │   └── cms.tsx
│   │       └── styles/
│   │           └── global.css
│   ├── api/
│   │   ├── routes/
│   │   │   ├── projects.ts
│   │   │   ├── documents.ts
│   │   │   ├── assets.ts
│   │   │   ├── publish.ts
│   │   │   ├── auth/
│   │   │   │   ├── invite.ts
│   │   │   │   ├── accept.ts
│   │   │   │   ├── session.ts
│   │   │   │   └── members.ts
│   │   │   └── cms/
│   │   │       ├── sources.ts
│   │   │       ├── sync.ts
│   │   │       └── webhooks.ts
│   │   └── services/
│   │       ├── snapshot-service.ts
│   │       ├── publish-service.ts
│   │       └── cms-sync-service.ts
│   └── worker/
│       ├── render-job.ts
│       ├── transform-job.ts
│       └── cms-sync-job.ts
├── packages/
│   ├── shared-types/
│   │   ├── ids.ts
│   │   ├── common.ts
│   │   ├── design-document.ts
│   │   ├── page-document.ts
│   │   ├── patch-types.ts
│   │   ├── component-spec.ts
│   │   ├── site-manifest.ts
│   │   ├── errors.ts
│   │   ├── performance-budget.ts
│   │   ├── ui-types.ts
│   │   ├── cms-types.ts
│   │   └── auth-types.ts
│   ├── studio-engine/
│   │   ├── document/
│   │   │   ├── document-manager.ts
│   │   │   ├── document-validator.ts
│   │   │   └── document-snapshot.ts
│   │   ├── patch/
│   │   │   ├── patch-apply.ts
│   │   │   ├── patch-validate.ts
│   │   │   └── patch-optimize.ts
│   │   ├── history/
│   │   │   ├── history-manager.ts
│   │   │   └── history-types.ts
│   │   ├── interaction/
│   │   │   ├── snap-engine.ts
│   │   │   ├── guide-engine.ts
│   │   │   └── transform-engine.ts
│   │   ├── typography/
│   │   │   ├── font-registry.ts
│   │   │   ├── font-loader.ts
│   │   │   ├── font-metrics.ts
│   │   │   ├── rtl-engine.ts
│   │   │   ├── fallback-system.ts
│   │   │   └── adapters/
│   │   │       └── google-fonts.ts
│   │   └── export/
│   │       ├── png-exporter.ts
│   │       └── svg-exporter.ts
│   ├── builder-engine/
│   │   ├── document/
│   │   │   ├── page-manager.ts
│   │   │   └── page-validator.ts
│   │   ├── layout/
│   │   │   ├── flex-engine.ts
│   │   │   └── grid-engine.ts
│   │   ├── responsive/
│   │   │   ├── breakpoint-manager.ts
│   │   │   └── responsive-resolver.ts
│   │   ├── components/
│   │   │   ├── component-registry.ts
│   │   │   └── component-renderer.ts
│   │   ├── bindings/
│   │   │   ├── binding-resolver.ts
│   │   │   └── binding-types.ts
│   │   └── patch/
│   │       ├── builder-patch-apply.ts
│   │       └── builder-patch-validate.ts
│   ├── cms-engine/
│   │   ├── core/
│   │   │   ├── source-registry.ts
│   │   │   ├── collection-manager.ts
│   │   │   ├── record-normalizer.ts
│   │   │   ├── schema-inferrer.ts
│   │   │   ├── field-types.ts
│   │   │   └── query-builder.ts
│   │   ├── adapters/
│   │   │   ├── adapter-interface.ts
│   │   │   ├── notion-adapter.ts
│   │   │   ├── airtable-adapter.ts
│   │   │   ├── google-sheets-adapter.ts
│   │   │   ├── supabase-adapter.ts
│   │   │   ├── markdown-adapter.ts
│   │   │   ├── json-adapter.ts
│   │   │   └── rest-api-adapter.ts
│   │   ├── sync/
│   │   │   ├── sync-scheduler.ts
│   │   │   ├── sync-strategy.ts
│   │   │   ├── diff-engine.ts
│   │   │   ├── conflict-handler.ts
│   │   │   └── webhook-handler.ts
│   │   ├── cache/
│   │   │   ├── content-cache.ts
│   │   │   ├── cache-invalidation.ts
│   │   │   └── offline-content.ts
│   │   └── transform/
│   │       ├── content-transformer.ts
│   │       ├── rich-text-parser.ts
│   │       ├── media-resolver.ts
│   │       └── relation-resolver.ts
│   ├── auth-engine/
│   │   ├── core/
│   │   │   ├── invite-service.ts
│   │   │   ├── invite-validator.ts
│   │   │   ├── role-engine.ts
│   │   │   ├── permission-resolver.ts
│   │   │   └── permission-types.ts
│   │   ├── session/
│   │   │   ├── session-manager.ts
│   │   │   ├── token-service.ts
│   │   │   └── session-types.ts
│   │   ├── guards/
│   │   │   ├── route-guard.ts
│   │   │   ├── resource-guard.ts
│   │   │   └── api-guard.ts
│   │   └── index.ts
│   ├── fabric-adapter/
│   │   ├── runtime.ts
│   │   ├── document-to-fabric.ts
│   │   ├── fabric-to-patch.ts
│   │   └── object-metadata.ts
│   ├── mobile-runtime/
│   │   ├── input-controller.ts
│   │   ├── gesture-recognizer.ts
│   │   ├── viewport-controller.ts
│   │   ├── zoom-manager.ts
│   │   ├── kinetic-scroll.ts
│   │   ├── memory-guard.ts
│   │   └── mobile-history-throttle.ts
│   ├── brand-kit/
│   │   ├── brand-types.ts
│   │   ├── brand-manager.ts
│   │   ├── brand-apply-engine.ts
│   │   ├── brand-storage.ts
│   │   └── token-mapper.ts
│   ├── state-bridge/
│   │   ├── document-store.ts
│   │   ├── selection-store.ts
│   │   ├── ui-store.ts
│   │   ├── tool-store.ts
│   │   ├── viewport-store.ts
│   │   ├── cms-store.ts
│   │   ├── auth-store.ts
│   │   ├── derived-state.ts
│   │   ├── subscriptions.ts
│   │   └── store-types.ts
│   ├── local-draft/
│   │   ├── draft-store.ts
│   │   ├── draft-recovery.ts
│   │   └── draft-cleanup.ts
│   ├── sync-engine/
│   │   ├── sync-protocol.ts
│   │   ├── conflict-resolver.ts
│   │   ├── operation-log.ts
│   │   └── merge-strategy.ts
│   ├── error-boundary/
│   │   ├── error-types.ts
│   │   ├── recovery-strategies.ts
│   │   └── crash-reporter.ts
│   ├── storage-adapter/
│   │   ├── upload-pipeline.ts
│   │   ├── image-optimizer.ts
│   │   ├── asset-cache.ts
│   │   ├── cdn-resolver.ts
│   │   ├── upload-queue.ts
│   │   └── limits.ts
│   ├── publish-adapters/
│   │   ├── astro-adapter/
│   │   │   ├── page-to-astro.ts
│   │   │   ├── collection-to-astro.ts
│   │   │   └── style-generator.ts
│   │   └── static-adapter/
│   │       ├── html-generator.ts
│   │       └── asset-bundler.ts
│   └── a11y/
│       ├── keyboard-shortcuts.ts
│       ├── focus-manager.ts
│       ├── aria-labels.ts
│       └── contrast-checker.ts
├── testing/
│   ├── strategy.md
│   ├── fixtures/
│   │   ├── valid-documents/
│   │   ├── corrupt-documents/
│   │   ├── edge-case-patches/
│   │   └── cms-fixtures/
│   │       ├── notion-mock.json
│   │       ├── airtable-mock.json
│   │       └── sheets-mock.json
│   └── utils/
│       ├── patch-validator.ts
│       ├── document-integrity.ts
│       ├── render-helpers.ts
│       └── cms-test-utils.ts
├── docs/
│   ├── ARCHITECTURE_RULES.md
│   ├── CODEX_TASK_TEMPLATE.md
│   ├── MOBILE_UI_CONTRACT.md
│   ├── MOBILE_GESTURE_GUIDE.md
│   ├── MOBILE_PERFORMANCE_GUIDE.md
│   ├── DESIGN_SYSTEM_GUIDE.md
│   ├── FRAMER_UI_GUIDE.md
│   ├── CMS_ADAPTER_GUIDE.md
│   ├── INVITE_SYSTEM_GUIDE.md
│   └── RBAC_GUIDE.md
├── turbo.json
├── tsconfig.base.json
└── pnpm-workspace.yaml
```

---

## 4) Framer-Class Visual Identity

### 4.1) Design Philosophy

Seven visual characteristics define the Framer-class look:

**Graduated Darkness.**
Not one black. Four to five shades of dark gray. Each layer slightly lighter than the one beneath it. Creates depth without visible borders.

**Glass Morphism.**
Panels and menus are semi-transparent. Content behind them is visible but blurred. Everything feels lightweight and floating.

**Ghost Borders.**
Borders between sections are barely visible. White at 6-10% opacity. Visual separation without harshness.

**Spring Animation.**
Nothing moves at constant speed. Everything uses spring physics — accelerates then decelerates naturally. Buttons compress slightly on press and spring back.

**Generous Whitespace.**
No crowding. Wide spacing between elements. Icons relatively small. Text clearly readable.

**Light Typography.**
Font weight 400-500. Secondary colors subdued. Only important information stands out.

**Brutal Simplicity.**
Minimum visible elements at any moment. Tools appear when needed and disappear. No decorative icons.

---

### 4.2) Design Token System

#### Surfaces

| Token | Purpose |
|-------|---------|
| surface.root | Application background — darkest layer |
| surface.primary | Sidebar and inspector |
| surface.secondary | Panels inside sidebar |
| surface.tertiary | Elements inside panels |
| surface.glass | Dropdowns and sheets — semi-transparent with blur |
| surface.glassMobile | Same as glass but less transparent + stronger blur for mobile readability |
| surface.canvas | Workspace area background |
| surface.overlay | Background behind modals |
| surface.sheet | Bottom sheet on mobile — nearly opaque |
| surface.rail | Bottom Rail on mobile — nearly opaque |
| surface.actionSheet | Action sheet on mobile |
| surface.toolbar | Mobile toolbar |

#### Interactive States

| Token | Purpose |
|-------|---------|
| interactive.hover | Background on mouse hover |
| interactive.active | Background on click |
| interactive.selected | Background of selected element |
| interactive.pressed | Background during sustained press |
| interactive.dragging | Background during drag |

#### Borders

| Token | Purpose |
|-------|---------|
| border.subtle | Default borders between sections |
| border.default | Clearer borders for inputs |
| border.strong | Prominent borders for emphasis |
| border.focus | Focus ring — accent color |
| border.error | Error state border |

#### Text

| Token | Purpose |
|-------|---------|
| text.primary | Headings and primary content |
| text.secondary | Labels and secondary content |
| text.tertiary | Helper text and placeholders |
| text.disabled | Disabled state |
| text.inverse | Text on light backgrounds |
| text.link | Link color |

#### Accent

| Token | Purpose |
|-------|---------|
| accent.primary | Primary buttons, selected elements |
| accent.hover | Hover state of accent |
| accent.pressed | Pressed state of accent |
| accent.subtle | Light accent background |
| accent.glow | Glow around focused elements |

#### Semantic

| Token | Purpose |
|-------|---------|
| semantic.success | Success states |
| semantic.warning | Warning states |
| semantic.error | Error and destructive actions |
| semantic.info | Information states |

#### Spacing — 4px Grid

| Token | Value | Purpose |
|-------|-------|---------|
| spacing.1 | 4px | Smallest — between icon and text |
| spacing.2 | 8px | Between close elements |
| spacing.3 | 12px | Small internal padding |
| spacing.4 | 16px | Default internal padding |
| spacing.5 | 20px | Between sections |
| spacing.6 | 24px | Large internal padding |
| spacing.8 | 32px | Between groups |
| spacing.10 | 40px | Large gap |
| spacing.12 | 48px | Toolbar height |
| spacing.touchTarget | 44px | Minimum touch target — Apple HIG |
| spacing.bottomSafe | env() | Safe area bottom |
| spacing.topSafe | env() | Safe area top |

#### Radius

| Token | Value | Purpose |
|-------|-------|---------|
| radius.sm | 6px | Small buttons |
| radius.md | 10px | Inputs, cards |
| radius.lg | 14px | Panels, dropdowns |
| radius.xl | 18px | Modals |
| radius.sheet | 20px | Bottom sheet top corners |
| radius.full | 9999px | Circles, pills |

#### Shadows — Layered Depth

| Token | Purpose |
|-------|---------|
| shadow.sm | Tooltips |
| shadow.md | Dropdowns |
| shadow.lg | Floating panels |
| shadow.xl | Modals |
| shadow.float | Floating panels with ghost border |
| shadow.sheet | Bottom sheet — rises upward |
| shadow.glow | Focused elements — accent color |
| shadow.inner | Pressed inputs |
| shadow.rail | Bottom Rail — subtle |
| shadow.toolbar | Mobile toolbar |
| shadow.fab | Floating action button |
| shadow.dragElevated | Element being dragged |

#### Blur

| Token | Desktop | Mobile | Purpose |
|-------|---------|--------|---------|
| blur.sm | 8px | 8px | Light effect |
| blur.md | 16px | 16px | Menus |
| blur.lg | 24px | 24px | Modals |
| blur.glass | 20px | 28px | Glass panels |
| blur.sheet | 24px | 32px | Bottom sheet |
| blur.rail | — | 20px | Bottom Rail |
| blur.actionSheet | — | 28px | Action sheet |

#### Typography

| Token | Desktop | Mobile | Purpose |
|-------|---------|--------|---------|
| heading.page | 24px/600 | 20px/600 | Page title |
| heading.section | 16px/600 | 16px/600 | Section title |
| body.primary | 14px/400 | 16px/400 | Primary text |
| body.secondary | 13px/400 | 14px/400 | Secondary text |
| caption | 12px/400 | 14px/400 | Captions |
| label | 11px/500 | 13px/500 | Field labels |
| sheetTitle | — | 17px/600 | Sheet title |
| actionItem | — | 17px/400 | Action sheet items |
| toolLabel | — | 10px/500 | Bottom Rail labels (exception) |

**Strict rule:** No interactive text below 14px on mobile. Only exception: Bottom Rail tool labels at 10px.

#### Z-Index Layer Stack

| Token | Value | Purpose |
|-------|-------|---------|
| z.canvas | 1 | Drawing area |
| z.guides | 10 | Guide lines |
| z.selection | 20 | Selection handles |
| z.toolbar | 100 | Top toolbar |
| z.sidebar | 200 | Sidebar |
| z.inspector | 200 | Properties panel |
| z.panel | 300 | Floating panels |
| z.dropdown | 400 | Dropdown menus |
| z.bottomRail | 500 | Mobile bottom rail |
| z.sheet | 600 | Bottom sheet |
| z.modal | 700 | Dialogs |
| z.toast | 800 | Notifications |
| z.tooltip | 900 | Tooltips |
| z.commandPalette | 950 | Command palette |

#### Motion — Springs and Durations

**Springs:**

| Token | Purpose | Feel |
|-------|---------|------|
| spring.snappy | Buttons, toggles | Fast and precise |
| spring.smooth | Panels, sidebars | Smooth and natural |
| spring.bouncy | Notifications, badges | Slightly playful |
| spring.gentle | Backgrounds, shadows | Slow and calm |
| spring.sheet | Bottom sheet | Balanced for drag |
| spring.drag | Draggable elements | Immediate response |
| spring.tap | Mobile tap feedback | Instant |
| spring.rubberBand | Over-scroll resistance | Elastic resistance |
| spring.settle | After drop/release | Soft landing |

**Durations:**

| Token | Value | Purpose |
|-------|-------|---------|
| duration.instant | 100ms | Hover states |
| duration.fast | 150ms | Quick fade |
| duration.normal | 200ms | Standard transitions |
| duration.smooth | 300ms | Panel slides |
| duration.slow | 450ms | Large transitions |
| duration.sheet | 350ms | Sheet movement |
| duration.sheetSnap | 300ms | Snap point transition |
| duration.toolSwitch | 100ms | Tool change — instant |

---

### 4.3) Dark Mode and Light Mode

Dark Mode is the default. All tokens above describe Dark Mode.

Light Mode inverts surfaces and text while keeping accent colors unchanged. Glass blur values remain the same. Theme switches without page reload via CSS custom properties.

---

## 5) Desktop UI Experience

### 5.1) Desktop Layout

```
┌──────────────────────────────────────────────────────────┐
│                      Toolbar (48px)                       │
│  Logo  │  Tools  │  Title + Save Status  │  Actions      │
├────────┬──────────────────────────────────┬───────────────┤
│Sidebar │                                  │   Inspector   │
│ Rail   │                                  │    Panel      │
│ (48px) │          Workspace               │   (280px)     │
│        │           (Canvas)               │               │
│  Icons │                                  │  Properties   │
│  for:  │        Rulers + Guides           │  per section  │
│ Layers │            Grid                  │               │
│ Assets │                                  │               │
│ Comps  │                                  │               │
│  CMS   │                                  │               │
│ Brand  │                                  │               │
│History │                                  │               │
├────────┴──────────────────────────────────┴───────────────┤
│                    Status Bar (28px)                       │
│  Zoom │ Selection Info │ Grid Toggle │ Online Status      │
└──────────────────────────────────────────────────────────┘
```

### 5.2) Toolbar

Height: 48px fixed. Full width. Background: surface.primary with border.subtle bottom border.

**Left zone:** Logo icon (no text). Creation tools: Select, Frame, Text, Shape, Image, Pen. Each tool: 20px icon inside 36×36px button. Active tool: interactive.selected background with accent color. Tooltip after 500ms hover showing name and shortcut.

**Center zone:** Project name — editable on double-click. Cloud icon: green=saved, orange=saving, gray=offline.

**Right zone:** Share, Preview, Publish buttons. User avatar with Permission Badge.

### 5.3) Sidebar Rail

Width: 48px fixed. Vertical. Icons only: Layers, Assets, Components, CMS, Brand, History.

Click opens 240px panel beside the Rail. Click again closes it. Panel slides from Rail with spring.smooth. Panel pushes Workspace — does not float over it.

### 5.4) Inspector Panel

Width: 280px fixed. Right side in LTR. Left side in RTL.

Sections from top to bottom:
1. Alignment and Distribution — row of alignment buttons
2. Layout (Frame only) — direction, gap, padding, wrap
3. Position and Size — X, Y, W, H, Rotation fields
4. Fill — color swatch + hex value, opens Color Picker popover
5. Stroke — color + width + position
6. Effects — shadow, blur, opacity
7. Typography (text only) — font, weight, size, line height, spacing, alignment, direction

Fields: 28px height, surface.tertiary background, border.subtle border, radius.sm corners. On focus: border.focus with subtle glow. Labels above fields: 11px text.tertiary.

Sections collapsible with arrow rotation animation (spring.snappy). Separators between sections using border.subtle.

### 5.5) Workspace

Fills remaining space. Background: surface.canvas. Dot grid pattern at zoom > 50% using text.tertiary at 20% opacity.

Canvas floats centered with shadow.md. Pan with Space+Drag. Zoom with Ctrl+Scroll.

Selection handles: 8 handles (4 corners + 4 edges), 8×8px with accent.primary border and white background. Selection outline: 1px accent.primary.

Rulers: 20px on top and left. Labels in text.tertiary at 10px. Click and drag from ruler creates Guide. Guides: accent.primary at 50% opacity with pixel position tooltip.

### 5.6) Context Menu

Appears on right-click. Background: surface.glass with blur.glass. Border: border.subtle. Shadow: shadow.float. Radius: radius.lg. Width: 200-240px.

Items: 32px height. Icon + text + keyboard shortcut. Submenus slide with spring.snappy.

Appears with scaleIn (0.95→1.0) + fade. Disappears with fast fade.

### 5.7) Command Palette

Opens with Ctrl+K or Cmd+K. Centered vertically (slightly above center). Width: 560px. Background: surface.glass with blur.xl. Shadow: shadow.xl. Radius: radius.xl.

Search field: 48px height, no border. Results grouped: Recent, Tools, Actions, Files. Arrow key navigation. Selected item: interactive.selected background. Enter executes and closes.

Appears with scaleIn (0.96→1.0) + fade. Results stagger (40ms each). Black backdrop at 40% opacity.

### 5.8) Color Picker

Appears as popover from Inspector.

Structure: Saturation/Brightness gradient square (220×160px). Hue slider horizontal. Alpha slider horizontal. HEX, R, G, B, A fields. Saved colors (Brand + Recent).

Background: surface.secondary. Shadow: shadow.float. Radius: radius.lg. Cursor on gradient: 14px circle with 2px white border.

### 5.9) Tooltips

Background: surface.primary (solid). Border: border.subtle. Shadow: shadow.sm. Radius: radius.sm. Text: body.sm. Shortcut in kbd style.

Appears after 500ms hover. Disappears immediately on leave. Appears with fade + 4px slide. Never appears on touch devices.

---

## 6) Mobile UI Experience

### 6.1) Mobile Design Philosophy

Seven principles:

**Thumb-First.** Bottom of screen is easiest to reach. All primary tools in the bottom. Less important elements at the top.

**Content-First.** Canvas takes maximum screen space. Chrome hides during interaction. Appears only when needed.

**One-Gesture Actions.** Every important action achievable with one gesture. No multi-step navigation.

**No Surprises.** Every motion is predictable. Sheet follows finger exactly. No jumps. No unexpected disappearances.

**Sensory Confirmation.** Every important action has haptic feedback. Every state has a clear visual indicator.

**Instant Recovery.** Every action undoable. No "are you sure" except for permanent deletion. Shake to undo.

**Absolute Fluidity.** 60fps on everything. Spring physics on every motion. No jank. No stutter. No delay.

### 6.2) Mobile Layout

```
Portrait:
┌──────────────────────────┐
│  Mobile Toolbar           │  44px + safe area top
│  ←  Title  ⋯  ↗          │
├──────────────────────────┤
│                          │
│                          │
│       Workspace          │  Full remaining viewport
│       (Canvas)           │
│                          │
│                          │
├──────────────────────────┤
│  Bottom Rail             │  56px + safe area bottom
│  ☐  T  ◇  🖼  ⋯        │
└──────────────────────────┘
   Bottom Sheet (overlay)     Slides up over everything

Landscape:
┌──────────────────────────────────┐
│  Toolbar (36px)                   │
├──────┬───────────────────────────┤
│ Rail │                           │
│ 56px │       Workspace           │
│      │       (Canvas)            │
│  ☐   │                           │
│  T   │                           │
│  ◇   │                           │
│  🖼  │                           │
│  ⋯   │                           │
└──────┴───────────────────────────┘
   Side Sheet (overlay from side)
```

### 6.3) Mobile Toolbar

Height: 44px + safe area top.

Left: Back button (44×44px). Center: Project name (truncated) + save status subtitle. Right: Undo, Redo, More (⋯) buttons.

**Auto-Hide Behavior:**
User starts canvas interaction → after 200ms the toolbar slides up and disappears with spring.smooth → user stops interacting → after 1500ms toolbar slides back → or: tap on empty canvas shows toolbar immediately.

Bottom Rail never hides. Only toolbar.

**More Menu (⋯):** Opens Action Sheet (not dropdown) with: Share, Preview, Publish, Settings, Members, Cancel.

### 6.4) Bottom Rail

Height: 56px + safe area bottom. Always visible. Never hides.

Five tools equally spaced: Select, Text, Shape, Image, More. Each button: 44×44px minimum touch target. Icon: 22px. Label below: 10px.

Active tool: accent.primary color. Inactive: text.tertiary. Active indicator: 4×4px dot or 20×2px line below active tool, moves with layout animation (spring.snappy).

Haptic: light vibration (10ms) on each tool switch.

**"More" button:** Opens Bottom Sheet at half with a grid of additional tools (3 columns): Pen, Component, CMS, Brand, History, Settings. Each: 28px icon + name below. Tap selects tool and closes sheet.

### 6.5) Bottom Sheet

The most important mobile component. Every panel renders inside it.

**Snap Points:**

| State | Screen Height | When |
|-------|---------------|------|
| closed | 0% | Default state |
| peek | 15% | Quick preview (Quick Actions bar) |
| half | 50% | Main content (Inspector) |
| full | 92% | Full content (Color Picker, Font Picker) |

**Appearance:**
Background: surface.sheet with blur.sheet. Top corners: radius.sheet (20px). Shadow: shadow.sheet (rises upward). Handle at top: 36×4px bar in text.tertiary with radius.full.

**Drag Behavior:**

Sheet follows finger 1:1 during drag. No delay. No interpolation. Finger moves 50px → sheet moves 50px.

Rubber band effect when dragging beyond full (above 92%): resistance increases. Dragging 50px → sheet moves 15px only. On release: springs back to full with spring.rubberBand.

Velocity-based snap: fast swipe up (velocity > 500px/s) skips one snap point upward. Fast swipe down skips one snap point downward. Slow swipe settles at nearest snap point.

Scroll-to-drag handoff in full state: content scrolls normally. When content is at top (scrollTop = 0) and user drags down: transitions from scroll to sheet drag seamlessly — no jump.

**Backdrop:**
Opacity changes continuously with sheet position. Not a jump at snap points.
Sheet at 25%: backdrop opacity 0.15. At 50%: 0.30. At 92%: 0.60.
Formula: opacity = (sheetHeight / screenHeight) × 0.65.
Tap on backdrop closes sheet.

**Content by state:**
Peek: Quick Actions only (horizontal button row). Half: Main content (Inspector fields). Content not scrollable — drag moves sheet. Full: All content + vertical scroll enabled. Drag on Handle moves sheet. Drag on content scrolls content.

### 6.6) Mobile Inspector

**No selection:** Sheet closed. Nothing visible. Full screen for canvas.

**Element selected:** Sheet slides to peek automatically with spring.sheet. Haptic (light).

**Peek — Quick Actions Bar:**
Horizontal scrollable row: Color, Font, Width, Height, Align, Lock, Delete. Each button: 40×40px with 10px label below. Tap any button: sheet rises to half showing relevant section.

**Half — Property Sections:**
Horizontal tabs at top instead of collapsible sections: Style, Layout, Fill, Effect, Text (appears only for text elements).

Fields: 40px height (not 28px). Radius: 10px. Background: surface.tertiary. Focus: accent.primary border + subtle glow. Labels: 13px text.secondary above field.

Stepper Controls for numeric fields: -/+ buttons (40×40px each) flanking the value. Tap +/- changes value by 1. Long press (after 300ms) changes rapidly with acceleration. Tap the number to open keyboard for manual input. Haptic on each change.

### 6.7) Mobile Color Picker

Opens in Bottom Sheet at full.

Gradient square: full width with padding × 200px height. Cursor: 20px circle (larger than desktop) with 3px white border. Follows finger 1:1.

Hue and Alpha sliders: 44px height each (full touch target). Handle: 28px circle with 3px white border + shadow. Haptic at key values (0°, 60°, 120°, etc. for hue; 0%, 50%, 100% for alpha).

HEX field + R, G, B, A fields below. Brand Colors and Recent Colors as a 6-column grid. Each swatch: 44×44px touch target. Color square: 32×32px with radius.md. Tap applies color + haptic. Long press shows color name.

Done button at top (accent.primary) closes sheet to half.

### 6.8) Mobile Font Picker

Opens in Bottom Sheet at full.

Search field at top: 44px height, sticky on scroll. Keyboard appears — sheet stays at full, content area shrinks.

Font list: Arabic fonts first if language is Arabic. Each item: 52px height, shows font name rendered in its own font. Selected font: checkmark in accent.primary. Kinetic scroll with momentum. Alphabet index on side for quick jumping (A-Z strip).

Search: works on Arabic and English names. Results appear immediately (150ms debounce). No results: suggestion message.

### 6.9) Mobile Layers Panel

Opens in Bottom Sheet at half or full.

Each layer row: 52px height, 20px indent per nesting level. Type icon (20px) + layer name. Selected layer: interactive.selected background.

**Interactions:**
Tap: selects layer on canvas. Double tap: enters name editing mode. Long press (300ms): starts drag-to-reorder mode — haptic (medium), row elevates visually (shadow.dragElevated + scale 1.02), other rows shift with layout animation, haptic (light) on each position change, on release settles with spring.settle.

Swipe left: reveals action buttons (Hide, Lock, Delete) — each 60×52px. Hide: text.secondary. Lock: semantic.warning. Delete: semantic.error. Tap action: executes + row returns. Swipe right: returns row.

### 6.10) Mobile Context Menu (Action Sheet)

Appears on long press on canvas element or More button tap.

Actions in one card: surface.actionSheet with blur.actionSheet. Radius: radius.actionSheet. Cancel in separate card below with spacing.2 gap. Each item: 52px height. Text: actionItem (17px/400). Delete in semantic.error. Separator: border.subtle.

Slides from bottom with spring.sheet. Backdrop: backdrop.actionSheet. Haptic (medium) on appear. Tap item: executes + disappears with fade (duration.fast). Tap Cancel or backdrop: slides down. Swipe down on card: slides down.

### 6.11) Mobile Toast

Position: below Mobile Toolbar (top of screen). Slides from top with spring.smooth. Stays 3 seconds. Disappears with slide up + fade. Swipe up removes manually. Multiple toasts stack (max 2 visible).

Pill shape: radius.toast (22px). Background: surface.glass with blur.glass. Icon 16px + body.primary text.

Types: success (green checkmark), error (red X), warning (yellow triangle), info (blue i), loading (spinner).

### 6.12) Adaptive Input

Solves: keyboard covering active input.

When keyboard appears: active field stays visible always. Sheet shrinks if needed. Bottom Rail rises above keyboard or hides temporarily if space insufficient. On keyboard dismiss: everything returns with spring.smooth. Height calculated via Visual Viewport API — not window.innerHeight (unreliable on iOS).

### 6.13) Pull-to-Action

Pull down from top edge of canvas (not from toolbar). After 80px: "Release for search" indicator appears. Release > 80px: opens Command Palette as Bottom Sheet. Release < 80px: springs back with spring.rubberBand. Spinner circle fills gradually with pull. Haptic (medium) at threshold crossing.

### 6.14) Orientation Handling

Portrait → Landscape: Bottom Rail moves to side (vertical rail, 56px width). Icons switch from horizontal to vertical. Toolbar stays at top but shorter (36px). Bottom Sheet becomes Side Sheet (slides from side). Canvas fills remaining space. Layout transition with spring.smooth. No flicker, no rebuild.

### 6.15) Safe Areas

Top: notch / dynamic island. Bottom: home indicator. Left/Right: in landscape. Rule: no interactive content inside safe area ever. Bottom Rail adds padding-bottom: safe-area-inset-bottom. Mobile Toolbar adds padding-top: safe-area-inset-top.

---

## 7) Animation Patterns

### Panel Open/Close
Desktop: slides horizontally from Rail → 240px. Workspace shrinks. spring.smooth.
Mobile: slides vertically from bottom. Backdrop changes gradually. spring.sheet.

### Tool Switch
Desktop: selected background changes instantly. No animation — tools must be immediate.
Mobile: same + scale tap (0.85→1.0) with spring.snappy + haptic (light).

### Element Selection
Handles appear with fade (duration.fast). Desktop Inspector updates immediately — no visible animation. Mobile Sheet slides to peek with spring.sheet. If element is off-screen: canvas pans smoothly with spring.smooth.

### Drag and Drop
During drag: element follows input without delay. shadow.lg appears (element lifts visually). Snap lines appear with instant fade. Haptic (light) on snap.
On drop: element settles with spring.snappy. Shadow returns to shadow.sm with duration.normal. Snap lines disappear instantly.

### List Stagger
Items appear sequentially: 40ms delay between each. Each item: fade + 8px slide up with spring.smooth. With prefers-reduced-motion: all items appear instantly.

### Toast
Desktop: bottom-left corner (RTL: bottom-right). Slides from bottom + fade. Stays 4s. Stack vertically.
Mobile: below toolbar (top). Slides from top + fade. Stays 3s. Swipe up to dismiss.

### Modal/Dialog
Desktop: center screen. scaleIn (0.95→1.0) + fade. Black backdrop 50%.
Mobile: Bottom Sheet at full. Slides from bottom. No floating modals on mobile. Exception: critical confirm dialog (delete file) appears as centered alert.

---

## 8) Mobile Gesture System

### 8.1) Touch Event Pipeline

Touch Start → Hit Test (what was touched?) → Handle: Transform Mode. Element Body: Potential Drag or Tap. Empty Canvas: Potential Pan or Selection Box. UI Element: UI Interaction → Wait 8px movement or 300ms → Moved > 8px: Drag/Pan/Selection. No movement + < 300ms: Tap. No movement + > 300ms: Long Press. Second finger added: Pinch/Pan.

### 8.2) Gesture State Machine

**IDLE** → tap: SELECT element → IDLE. tap (empty): DESELECT → IDLE. double tap (text): EDIT TEXT → TEXT_EDITING. drag start (element): DRAGGING. drag start (handle): RESIZING. drag start (empty): SELECTION_BOX. long press: CONTEXT_MENU. pinch start: ZOOMING. two finger pan: PANNING.

**DRAGGING** → drag move: update position (preview). drag end: commit patch → IDLE. second finger: cancel drag → ZOOMING. leave canvas: cancel drag → IDLE.

**RESIZING** → drag move: update size (preview). drag end: commit patch → IDLE. second finger: cancel resize → ZOOMING.

**ZOOMING** → pinch move: update viewport zoom. pinch end → IDLE.

**PANNING** → move: update viewport position. end → IDLE. pinch detected → ZOOMING.

**SELECTION_BOX** → drag move: update rectangle. drag end: select enclosed → IDLE. second finger: cancel → PANNING.

**TEXT_EDITING** → tap outside: commit → IDLE. keyboard dismiss: commit → IDLE.

**CONTEXT_MENU** → action selected: execute → IDLE. cancel → IDLE. backdrop tap → IDLE.

### 8.3) Gesture Priority Table

```
Priority 1 (Highest): Pinch Zoom
    Overrides everything. All other gestures cancelled.

Priority 2: Two-Finger Pan
    Overrides drag, selection, long press.

Priority 3: Handle Drag (resize/rotate)
    Entered via handle hit test.

Priority 4: Element Drag (move)
    Entered via element hit test + 8px threshold.

Priority 5: Selection Box
    Entered via empty canvas + 8px threshold.

Priority 6 (Lowest): Long Press
    300ms hold without movement. Cancels if movement > 4px.
```

**Edge Case — Drag to Pinch:**
User drags element with one finger, adds second finger. Drag cancels immediately. Element returns to original position with spring.snappy. Pinch zoom begins. No patch emitted from cancelled drag.

**Edge Case — Long Press vs Drag:**
Movement < 4px: treated as long press after 300ms.
Movement > 4px and < 8px: waits for more.
Movement > 8px: begins drag immediately — no long press.

### 8.4) Patch Emission Strategy (Mobile)

During gesture: no patches emitted. Transient state maintained (preview only). Canvas updated directly via Fabric for performance. Checkpoint saved to memory every 500ms for crash recovery.

On gesture end: single compact patch emitted with final result. Example: instead of 60 patches for finger movement (60fps × 1s), one patch: move(elementId, {x: 120, y: 340}). Enters history stack as single operation. Undo reverts entire movement — not frame by frame.

Checkpoint recovery: if app closes during gesture, last checkpoint applied on reopen.

### 8.5) Haptic Feedback Map

| Event | Type | Pattern |
|-------|------|---------|
| Tool switch | Light | 10ms single |
| Element selected | Light | 10ms single |
| Snap to guide/grid | Light | 10ms single |
| Drag start | Medium | 20ms single |
| Drag end/drop | Light | 10ms single |
| Reorder start | Medium | 20ms single |
| Reorder position change | Light | 10ms single |
| Long press recognized | Medium | 20ms single |
| Action sheet appears | Medium | 20ms single |
| Delete action | Heavy | 30+10+30ms |
| Undo/Redo | Success | 10+30+10ms |
| Error | Error | 50+30+50+30+50ms |
| Publish success | Success | 10+30+10ms |
| Color picker hue snap | Light | 10ms single |
| Slider value snap | Light | 10ms single |
| Sheet snap to point | Light | 10ms single |
| Zoom snap (100%, fit) | Medium | 20ms single |

---

## 9) Mobile Performance Contract

| Metric | Minimum | Target |
|--------|---------|--------|
| Canvas FPS during gesture | 30fps | 60fps |
| Sheet animation FPS | 60fps | 60fps |
| Touch-to-visual latency | < 32ms | < 16ms |
| Sheet snap transition | < 400ms | < 300ms |
| Tool switch response | < 100ms | < 50ms |
| Canvas objects max | 200 | 200 |
| Memory usage max | 256MB | 192MB |
| First canvas render | < 2s | < 1s |
| Texture memory max | 128MB | 96MB |
| Patch commit time | < 50ms | < 16ms |

**Memory Guard Thresholds:**
200MB: warning — reduce texture quality.
240MB: aggressive — hide off-screen objects.
280MB: critical — show "Memory low" toast + reduce canvas quality.
300MB: emergency — auto-save + show recovery prompt.

---

## 10) Responsive Breakpoints

| Name | Width | Behavior |
|------|-------|----------|
| mobile | 0 – 767px | Full Mobile Layout |
| tablet | 768 – 1023px | Mobile Layout with adjustments |
| desktop | 1024 – 1439px | Full Desktop Layout |
| wide | 1440px+ | Desktop Layout with wider Inspector |

Transition between mobile and desktop is not gradual. At 1024px exactly: switches to Desktop Layout immediately.

Platform detection is more important than width: hover:none + pointer:coarse = touch device → Mobile Layout (even iPad Pro at 1024px).

---

## 11) Desktop vs Mobile Behavior Matrix

| Feature | Desktop | Mobile |
|---------|---------|--------|
| Inspector | Right panel (280px) | Bottom Sheet (half) |
| Layers | Sidebar panel | Bottom Sheet (half) |
| Color Picker | Popover | Bottom Sheet (full) |
| Font Picker | Dropdown | Bottom Sheet (full) |
| Context Menu | Right-click | Long press Action Sheet |
| Zoom | Ctrl+Scroll | Pinch |
| Pan | Space+Drag | Two-finger |
| Undo | Ctrl+Z | Shake or toolbar button |
| Tool Switch | Keyboard shortcut | Bottom Rail |
| Properties | Inspector fields | Quick bar + Sheet |
| Command Palette | Ctrl+K | Pull-down gesture |
| History | Sidebar panel | Bottom Sheet (half) |
| Export | Modal dialog | Bottom Sheet (full) |
| Brand Kit | Sidebar panel | Bottom Sheet (half) |
| CMS | Sidebar panel | Bottom Sheet (half) |
| Toolbar | Always visible | Auto-hides during interaction |

---

## 12) CMS Architecture

### 12.1) Source Model

Source has: id (branded), type, name, encrypted credentials, config, syncInterval, lastSync, status, collections.
Supported types: notion, airtable, sheets, supabase, markdown, json, rest.

### 12.2) Collection Model

Collection has: id (branded), sourceId, externalId, name, schema (FieldSchema array), recordCount, lastUpdated, syncEnabled.

### 12.3) Record Model (Normalized)

Record has: id (branded), collectionId, externalId, fields (Map of fieldName to FieldValue), createdAt, updatedAt, _raw (original source data for debugging).

### 12.4) Field Types

Text, RichText, Number, Boolean, Date, DateTime, Image, File, URL, Email, Phone, Select, MultiSelect, Relation, Rollup, Formula (read-only), Person, Location.

### 12.5) Binding Model

Binding has: id (branded), componentId, property (which prop receives data), sourceType (collection/record/field), collectionId, recordId (optional for single record), fieldPath (optional, supports traversal like author.name), transform (optional), fallback (when data unavailable).

**Collection Binding:** Component receives array of records. For lists, grids, repeaters. Supports filter, sort, limit.
**Record Binding:** Component receives single record. For detail pages, cards. Selected by route param, explicit ID, or first match.
**Field Binding:** Component receives single value. For text, image, link.

### 12.6) Adapter Interface

Every adapter implements: connect(credentials), testConnection(), listCollections(), getSchema(collectionId), query(collectionId, query), getRecord(collectionId, recordId), subscribe(collectionId, callback) if supported, getCapabilities().

### 12.7) Data Flow

Source → Adapter.query() → Normalized Records → Content Cache (IndexedDB) → CMS Store (Zustand) → Binding Resolver → Component Props → UI.

### 12.8) Sync Flow

Trigger (schedule/webhook/manual) → Sync Scheduler → Adapter.query() with cursor → Diff Engine (compare with cache) → Cache Update (IndexedDB) → CMS Store Update → UI re-renders.

### 12.9) Supported Sources

| Source | Auth | Real-time | Relations | Rich Text |
|--------|------|-----------|-----------|-----------|
| Notion | OAuth/Token | Polling | Yes | Yes (Blocks) |
| Airtable | API Key/OAuth | Webhooks | Yes | No |
| Google Sheets | OAuth | Polling | No | No |
| Supabase | API Key | Native | Yes | No |
| Markdown/Git | None/Token | Polling | No | Yes (MDX) |
| JSON (URL/File) | None/Token | Polling | No | No |
| REST API | Configurable | Polling | Manual | Manual |

### 12.10) CMS Rules

1. Sources are read-only — Brimair does not write back
2. Credentials stored encrypted
3. All adapters implement same interface
4. Cache is source of truth for UI — source is authority for cache
5. Bindings are part of PageDocument — versioned with document
6. Missing data shows fallback, never crashes
7. Sync errors are recoverable — never block editor
8. Relations resolve lazily with depth limit
9. Rich text normalizes to portable format
10. Media URLs proxy through CDN when needed
11. Schema changes in source trigger user notification
12. Offline mode serves cached content with stale indicator
13. CMS content respects its own text direction per field

---

## 13) Auth and Access Control

### 13.1) Invite-Only Registration

Admin creates invite → specifies Role + Permissions → sends link → invitee opens link → validates → registers (email + password) → permissions apply immediately. No public sign-up endpoint exists.

### 13.2) Invite Token

Contains: inviteId, workspaceId, createdBy, email (optional for open invite), role, permissions, expiresAt (7 days default), status (pending/accepted/expired/revoked).

### 13.3) Registration Flow

Admin POST /api/auth/invite → System sends email with signed link → Invitee opens link → System validates token → If valid: shows register form → Invitee POST /api/auth/accept → System creates user, assigns role and permissions, invalidates token → Returns session.

### 13.4) Roles

| Role | Description |
|------|-------------|
| admin | Full access — manages invites and users |
| editor | View and edit assigned files — no user management |
| viewer | View assigned files only — no editing |
| custom | Admin defines every permission manually |

### 13.5) Permission Dimensions

Resources: studio_file, builder_page, cms_source, cms_collection, brand_kit, asset, publish_target.
Actions: create, read, update, delete, publish, export, share, invite.
System: manage_users, manage_invites, manage_workspace, view_audit_log.

**Default Matrix:**

| Action | Admin | Editor | Viewer |
|--------|-------|--------|--------|
| View Studio files | All | Assigned | Assigned |
| Edit Studio files | All | Assigned | No |
| View Builder pages | All | Assigned | Assigned |
| Edit Builder pages | All | Assigned | No |
| Connect CMS source | Yes | Yes | No |
| View CMS collections | All | Assigned | Assigned |
| Publish | Yes | Assigned | No |
| Export | Yes | Yes | No |
| Manage invites | Yes | No | No |
| Manage users | Yes | No | No |

### 13.6) Permission Resolver

Deny by default. Every resource and action not explicitly granted is denied. Checks in both UI layer and API layer. UI hides inaccessible elements. API rejects unauthorized requests.

### 13.7) Integration with Systems

**Studio:** Viewer sees canvas in read-only mode (tools hidden). Editor sees only assigned files. Admin sees all files.
**Builder:** Viewer sees preview only — no editor access. Editor cannot publish without explicit publish permission.
**CMS:** Viewer sees bound content only — no source settings. Admin only can add/remove CMS sources.
**Routes:** Every route protected by RouteGuard. Unauthorized access shows AccessDenied page.

### 13.8) Security Rules

1. No public sign-up endpoint exists
2. Invite tokens stored as hash only in database
3. Every API route passes through api-guard
4. Permissions read from database per request — not stored in JWT alone
5. Admin cannot assign Admin role to others unless workspace owner
6. Audit log for all: invite created/accepted/revoked + role changes
7. Session expiry: 7 days. Refresh token: 30 days.
8. Rate limiting: 5 attempts/minute on login and accept endpoints
9. Invite tokens are single-use — invalidated after accept

---

## 14) RTL Contract

1. dir attribute set on html element
2. Sidebar renders on right side in RTL
3. Inspector renders on left side in RTL
4. CSS logical properties only — no left/right for layout
5. Directional icons mirror (arrows, chevrons)
6. Slide animations reverse direction
7. Text alignment follows document direction
8. Keyboard shortcuts remain unchanged
9. Numbers always render LTR
10. Canvas content not affected by UI direction
11. CMS content respects its own direction per field
12. Invite emails sent in user locale
13. Permission UI fully RTL-compatible

---

## 15) Mobile UI Contract

1. Every button ≥ 44×44px touch target
2. Every panel opens as Bottom Sheet on mobile
3. Safe area insets respected everywhere
4. No hover-dependent interactions on touch devices
5. Keyboard never covers active input
6. Gestures supported: swipe, pinch, long-press, drag
7. Haptic feedback on all key actions
8. Glass blur stronger on mobile for readability
9. 100dvh not 100vh
10. Canvas scroll does not trigger browser bounce
11. Context menu triggered by long-press only
12. No interactive text below 14px (except Rail labels)
13. Toolbar auto-hides during canvas interaction
14. Bottom Rail always visible — never hides
15. Smooth transition between portrait and landscape

---

## 16) Dependency Rules

1. shared-types depends on nothing
2. Studio and Builder engines fully isolated
3. Fabric.js only inside fabric-adapter
4. All state changes produce patches
5. Document is canonical state
6. No window/document globals inside packages
7. Mobile runtime sits between UI and Fabric adapter
8. Framer Motion only in apps/web — never in packages
9. Stores only in state-bridge
10. UI primitives contain zero business logic
11. Design tokens are the only source for visual values
12. No hardcoded colors, spacing, or shadows in components
13. All interactive elements have accessibility labels
14. CMS adapters isolated — no cross-adapter imports
15. CMS cache is the only data source for UI
16. Bindings stored in document, not separate
17. auth-engine depends only on shared-types
18. Permission checks happen in both UI and API
19. No route or resource accessible without explicit grant
20. Invite tokens single-use
21. Admin role restricted to workspace owner assignment

---

## 17) Architectural Locks (A1-A10)

### A1) Patch Envelope Contract
Every patch carries: patchId (UUID), docId, actorId, baseRevision or baseHash, logicalTimestamp (Lamport or HLC preferred), deps (optional dependency list), type + payload.

### A2) Idempotency and Canonical Ordering
Patch replay is idempotent. Canonical ordering defined and deterministic across devices. Seen-patches set prevents double-apply.

### A3) Conflict Resolution Rules
Per-field merge for metadata/simple fields. Operational merge for transforms where possible. Structural rules for hard conflicts: delete vs modify, reparent vs edit, duplicate IDs. Deterministic winner when merge impossible.

### A4) Snapshot Format and Trigger Policy
Schema: snapshotVersion, docId, revision, createdAt, documentState, oplogCursor. Versioned and migratable. Trigger by: patch count (20-30), oplog size, time window, memory pressure (mobile). Hashable state for integrity.

### A5) Document Versioning and Migrations
Every document has schemaVersion. Migration pipeline: migrate(doc, fromVersion, toVersion). Strict validation pre/post migration. N-1 backward compatibility or force upgrade with safe fallback.

### A6) Drag/Gesture Patch Emission Strategy
Preview locally during gesture. Commit single patch (or compact set) on release. Optional periodic checkpoints for crash safety.

### A7) Gesture Arbitration Table
Priority: pinchZoom > twoFingerPan > objectDrag > selection > longPress. Cancellation rules defined. Hit-testing policy for handles vs body vs empty canvas. Deterministic gesture-to-patch mapping.

### A8) Token/RTL Enforcement via Tooling
Lint: no hardcoded colors/spacing/shadows. Lint: no left/right in CSS/layout — logical properties only. CI: minimum touch target 44×44px. CI: tokens are the only visual source.

### A9) Integrity and Determinism Tests
Applying any valid patch keeps document valid. Replaying patches from oplog produces same state across runs. Corrupt patches rejected before apply. Undo/redo correctness. Snapshot + oplog replay produces exact same hash/state.

### A10) Proof Slice Deliverable
Before expanding features: rectangle + Arabic text element + move/resize/rotate + undo/redo + snapshot + recovery + mobile pinch zoom + two-finger pan + state hash matches after replay.

---

## 18) Execution Phases

### PHASE 0 — Shared Types
Files: 12. Canonical contracts including auth-types and cms-types.
Gate: All types compile with zero errors.

### PHASE 0.5 — Auth Foundation
Files: 14. Invite system, roles, permissions, session management, API routes.
Gate: Create invite → accept → login → permissions loaded.

### PHASE 1 — Web App: Framer-Class UI

**PHASE 1.A — Design System Foundation**
Files: 15. All tokens (including mobile overrides) + themes + CSS.

**PHASE 1.B — UI Primitives**
Files: 20. All atomic components. 44×44px minimum.

**PHASE 1.C — Motion System**
Files: 8. Framer Motion patterns and presets.

**PHASE 1.D — Shell Layout**
Files: 10. Desktop layout + mobile layout + toolbar + sidebar.

**PHASE 1.E — Mobile Components**
Files: 32. Bottom Sheet + Bottom Rail + Mobile Inspector + Color Picker + Font Picker + Layers + Context Menu + Toast + Adaptive Input + Pull-to-Action + Haptic + Safe Area + Orientation + Keyboard.

**PHASE 1.F — Panels**
Files: 6. Layers, History, Assets, Components, Brand, CMS.

**PHASE 1.G — CMS UI**
Files: 8. Source picker, collection browser, record list, field mapper, binding.

**PHASE 1.H — Auth UI**
Files: 9. Invite gate, invite manager, role picker, permission editor, route guard.

**PHASE 1.I — System Components**
Files: 3. Offline indicator, error fallback, recovery prompt.

**PHASE 1.J — Hooks**
Files: 19. Platform + theme + direction + keyboard + online + reduced-motion + CMS + auth + bottom-sheet + gesture + haptic + safe-area + orientation + touch + thumb-zone + visual-viewport.

**PHASE 1.K — i18n**
Files: 3. Arabic, English, provider.

**Phase 1 Total: 133 files.**
Gate: Shell renders on iPhone SE + iPad + Desktop. Dark mode works. RTL works. Bottom Sheet drags smoothly. Every button 44px. Auth UI works. Invite flow works.

### PHASE 2 — Studio Core
Files: 45. Document + Patch + History + Interaction + Export + Fabric Adapter.
Gate: Canvas renders. Undo/redo works. Viewer sees read-only. Editor sees assigned files only.

### PHASE 2.M — Mobile Runtime
Files: 7. Input controller + gestures + viewport + zoom + kinetic scroll + memory guard + history throttle.
Gate: Pinch zoom works. Two-finger pan works. Memory within budget.

### PHASE 2.5 — Typography
Files: 6. Font registry + loader + metrics + RTL engine + fallback + Google Fonts.

### PHASE 3 — Builder Core
Files: 42. Page document + layout engines + responsive + components + bindings + builder patches.
Gate: Builder produces page. Responsive preview. Permission guards active.

### PHASE 3.5 — Brand Kit
Files: 5. Brand types + manager + apply engine + storage + token mapper.

### PHASE 4 — CMS Engine
Files: 22. Core (6) + Adapters (8) + Sync (5) + Cache (3) + Transform (4).
Gate: Connect Notion. See collections. Bind to component. See real content. Sync updates.

### PHASE 5 — State Bridge + Persistence
Files: 25. Stores (10) + Local Draft (3) + Sync Engine (4) + Storage Adapter (6) + Supabase Schema (2).
Gate: Offline editing works. Sync on reconnect. CMS serves from cache offline.

### PHASE 6 — Error + Accessibility + Testing
Files: 20. Error boundary (3) + A11y (4) + Testing infrastructure (13).
Gate: Error recovery works. Tests pass. Permission denial tested.

### PHASE 7 — Publishing
Files: 12. Astro adapter (3) + Static adapter (2) + API routes (4) + Worker jobs (3).
Gate: Static site with CMS content exports and loads in browser.

---

## 19) File Count Summary

| Phase | Description | Files |
|-------|-------------|-------|
| 0 | Shared Types | 12 |
| 0.5 | Auth Engine | 14 |
| 1.A | Design System | 15 |
| 1.B | UI Primitives | 20 |
| 1.C | Motion System | 8 |
| 1.D | Shell Layout | 10 |
| 1.E | Mobile Components | 32 |
| 1.F | Panels | 6 |
| 1.G | CMS UI | 8 |
| 1.H | Auth UI | 9 |
| 1.I | System Components | 3 |
| 1.J | Hooks | 19 |
| 1.K | i18n | 3 |
| 2 | Studio Core + Fabric | 45 |
| 2.M | Mobile Runtime | 7 |
| 2.5 | Typography | 6 |
| 3 | Builder Core | 42 |
| 3.5 | Brand Kit | 5 |
| 4 | CMS Engine | 22 |
| 5 | State + Persistence | 25 |
| 6 | Error + A11y + Testing | 20 |
| 7 | Publishing | 12 |
| **TOTAL** | | **343** |

---

## 20) Execution Timeline

| Weeks | Phase | Deliverable |
|-------|-------|-------------|
| 1-2 | Phase 0 + 0.5 | Types + Auth Engine + Invite System |
| 3 | Phase 1.A-C | Tokens + Themes + Primitives + Motion |
| 4-5 | Phase 1.D-E | Shell + Mobile Components (complete) |
| 6 | Phase 1.F-K | Panels + CMS UI + Auth UI + Hooks + i18n |
| 7-8 | Phase 2 | Studio Core + Fabric Adapter |
| 9 | Phase 2.M + 2.5 | Mobile Runtime + Typography |
| 10-11 | Phase 3 | Builder Core + Bindings |
| 12 | Phase 3.5 + 4 | Brand Kit + CMS Engine |
| 13 | Phase 5 | State + Persistence |
| 14 | Phase 6 | Error + A11y + Testing |
| 15 | Phase 7 | Publishing |
| 16 | QA + Hardening | Full flow: invite → register → create → edit on mobile → publish |

**Total: 16 weeks.**

---

## 21) Quality Gates

| Phase | Gate |
|-------|------|
| 0 | All types compile zero errors |
| 0.5 | Invite → Register → Login → Permissions applied |
| 1 | iPhone SE + iPad + Desktop renders. Dark mode. RTL. Sheet drags smoothly. 44px buttons. Auth flow works. |
| 2 | Canvas renders. Undo/redo works. Viewer read-only. Editor assigned only. |
| 2.M | Pinch zoom. Two-finger pan. Memory within budget. Gesture priorities correct. |
| 3 | Builder produces page. Responsive preview. Permission guards. |
| 4 | Notion connected. Collections visible. Bindings render content. Sync updates. |
| 5 | Offline editing. Sync on reconnect. CMS cache offline. |
| 6 | Error recovery. Tests pass. Permission denial tested. |
| 7 | Static site with CMS content exports and loads. |

---

## 22) Mobile Quality Gate (Detailed)

Tested on iPhone SE (375×667 CSS points) — smallest supported screen.

| Test | Criterion |
|------|-----------|
| Bottom Sheet drag | Smooth without jank |
| Bottom Sheet snap | Settles at nearest snap accurately |
| Bottom Sheet scroll handoff | scroll ↔ drag without jump |
| Bottom Rail | All buttons tappable |
| Toolbar auto-hide | Hides/shows smoothly |
| Color Picker | All sliders draggable |
| Font Picker | Search works + smooth scroll |
| Layers reorder | Long press + drag works |
| Layers swipe | Swipe actions appear |
| Action Sheet | Slides smoothly |
| Toast | Appears and disappears cleanly |
| Keyboard | Never covers active input |
| Safe areas | Notch + Home indicator respected |
| Orientation | Portrait ↔ Landscape smooth |
| RTL | Everything mirrors correctly |
| Haptic | Every event has appropriate feedback |
| Dark mode | Every surface readable |
| Performance | Canvas 30fps minimum |
| Memory | < 256MB at all times |

---

## 23) Documents Required

| Document | Purpose |
|----------|---------|
| ARCHITECTURE_RULES.md | Dependency and isolation rules |
| CODEX_TASK_TEMPLATE.md | Standard task format for contributors |
| MOBILE_UI_CONTRACT.md | Mobile behavior requirements |
| MOBILE_GESTURE_GUIDE.md | Gesture system + state machine + priorities |
| MOBILE_PERFORMANCE_GUIDE.md | Performance budgets + memory guard |
| DESIGN_SYSTEM_GUIDE.md | Token system + theming + usage rules |
| FRAMER_UI_GUIDE.md | Visual identity + animation patterns |
| CMS_ADAPTER_GUIDE.md | How to build a new CMS adapter |
| INVITE_SYSTEM_GUIDE.md | Invite flow end-to-end |
| RBAC_GUIDE.md | Roles, permissions, and enforcement |

---

## 24) What Brimair v4.5 Is

Studio (Canva-class design editor) + Builder (Framer-class website builder) + Multi-Source CMS (Notion, Airtable, Sheets, Supabase, Markdown, JSON, REST) + Static Publishing (Astro-first) + Framer-Class UI (desktop and mobile) + Mobile-Native Experience (not responsive CSS) + RTL-Native (Arabic first-class) + Offline-First (local persistence + sync) + Invite-Only Access (no public registration) + Role-Based Permissions (admin, editor, viewer, custom).

---

## 25) What Brimair v4.5 Is NOT

- Not a CMS builder (does not create schemas — reads from external sources)
- Not a database (content lives in user's existing tools)
- Not a hosting platform (exports static files)
- Not a public platform (no self-registration)
- Not a real-time collaboration tool (single-active-editor)
- Not an e-commerce platform
- Not a form builder
- Not an analytics platform
- Not open to anyone without an explicit invite

---

**END — Brimair Architecture Blueprint v4.5 Final Locked**

**343 files · 16 weeks · Zero drift**

**Document-First · Patch-Based · Local-First · Framer-Class UI · Mobile-Native · RTL-Native · Multi-Source CMS · Invite-Only · RBAC**

**Every pixel. Every gesture. Every haptic. Every permission. Defined.**
