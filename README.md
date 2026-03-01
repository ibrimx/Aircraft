# Aircraft — Architecture Blueprint v4.5 (Final Locked)

---

> **Model:** Document-First · Patch-Based · Local-First · Framer-Class UI · Mobile-Native · RTL-Native · Multi-Source CMS · Invite-Only · RBAC
>
> **Status:** Execution Blueprint — No Feature Drift Allowed
>
> **Consolidates:** v4.0 + v4.2 (CMS) + v4.3 (Auth) + Mobile Design System

---

## 1) Project Vision

Aircraft is a professional visual creation platform combining:

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
aircraft/
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

### 5.2–25) [Remaining sections identical with Brimair → Aircraft]

---

**END — Aircraft Architecture Blueprint v4.5 Final Locked**

**343 files · 16 weeks · Zero drift**

**Document-First · Patch-Based · Local-First · Framer-Class UI · Mobile-Native · RTL-Native · Multi-Source CMS · Invite-Only · RBAC**

**Every pixel. Every gesture. Every haptic. Every permission. Defined.**
