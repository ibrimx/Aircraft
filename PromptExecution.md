# Aircraft — Prompt Execution Map v4.5

> **الغرض:** تقسيم كل مرحلة إلى prompts صغيرة (1-3 ملفات لكل prompt)
>
> **القاعدة:** ملف واحد = الأفضل. ملفين = مترابطين. 3 = الحد الأقصى.

---

## Phase 0 — Shared Types (12 ملف → 6 prompts)

```
Prompt 1  → ids.ts
Prompt 2  → common.ts
Prompt 3  → design-document.ts
Prompt 4  → page-document.ts + component-spec.ts
Prompt 5  → patch-types.ts + errors.ts
Prompt 6  → performance-budget.ts + ui-types.ts + cms-types.ts + auth-types.ts + site-manifest.ts
```

---

## Phase 0.5 — Auth Engine (14 ملف → 7 prompts)

```
Prompt 7  → permission-types.ts
Prompt 8  → invite-service.ts + invite-validator.ts
Prompt 9  → role-engine.ts
Prompt 10 → permission-resolver.ts
Prompt 11 → session-manager.ts + token-service.ts + session-types.ts
Prompt 12 → route-guard.ts + resource-guard.ts
Prompt 13 → api-guard.ts + index.ts
```

---

## Phase 1.A — Design System Tokens (15 ملف → 7 prompts)

```
Prompt 14 → colors.ts + colors-semantic.ts
Prompt 15 → spacing.ts + radius.ts
Prompt 16 → shadows.ts + blur.ts
Prompt 17 → typography-tokens.ts
Prompt 18 → z-index.ts + breakpoints.ts
Prompt 19 → motion-tokens.ts + mobile-overrides.ts
Prompt 20 → dark-theme.ts + light-theme.ts + theme-provider.tsx
```

---

## Phase 1.A (CSS) — (4 ملف → 2 prompts)

```
Prompt 21 → reset.css + variables.css
Prompt 22 → rtl-overrides.css + mobile-overrides.css
```

---

## Phase 1.B — UI Primitives (20 ملف → 12 prompts)

```
Prompt 23 → surface.tsx
Prompt 24 → glass-panel.tsx + floating-panel.tsx
Prompt 25 → button.tsx + icon-button.tsx
Prompt 26 → input.tsx
Prompt 27 → slider.tsx + toggle.tsx
Prompt 28 → select.tsx
Prompt 29 → color-swatch.tsx
Prompt 30 → tooltip.tsx
Prompt 31 → dropdown-menu.tsx + context-menu.tsx
Prompt 32 → separator.tsx + badge.tsx + kbd.tsx
Prompt 33 → progress.tsx + skeleton.tsx
Prompt 34 → scroll-area.tsx + index.ts
```

---

## Phase 1.C — Motion System (8 ملف → 4 prompts)

```
Prompt 35 → presets.ts
Prompt 36 → animated-presence.tsx + fade-scale.tsx
Prompt 37 → slide-panel.tsx + layout-transition.tsx
Prompt 38 → spring-drag.tsx + stagger-list.tsx + gesture-wrapper.tsx
```

---

## Phase 1.D — Shell Layout (10 ملف → 8 prompts)

```
Prompt 39 → app-shell.tsx
Prompt 40 → desktop-layout.tsx
Prompt 41 → mobile-layout.tsx
Prompt 42 → sidebar.tsx + sidebar-rail.tsx
Prompt 43 → toolbar.tsx + status-bar.tsx
Prompt 44 → inspector.tsx
Prompt 45 → workspace.tsx
Prompt 46 → command-palette.tsx
```

---

## Phase 1.E — Mobile Components (32 ملف → 18 prompts)

```
Prompt 47 → bottom-sheet.tsx
Prompt 48 → bottom-sheet-handle.tsx + bottom-sheet-backdrop.tsx
Prompt 49 → bottom-sheet-scroll-lock.tsx
Prompt 50 → bottom-rail.tsx + bottom-rail-indicator.tsx
Prompt 51 → mobile-toolbar.tsx + mobile-toolbar-autohide.tsx
Prompt 52 → mobile-inspector.tsx
Prompt 53 → mobile-inspector-tabs.tsx + mobile-inspector-stepper.tsx
Prompt 54 → mobile-layers.tsx
Prompt 55 → mobile-layers-swipe.tsx + mobile-layers-reorder.tsx
Prompt 56 → mobile-color-picker.tsx
Prompt 57 → mobile-color-picker-sliders.tsx
Prompt 58 → mobile-font-picker.tsx + mobile-font-picker-search.tsx
Prompt 59 → mobile-context-menu.tsx
Prompt 60 → mobile-toast.tsx + mobile-toast-stack.tsx
Prompt 61 → swipe-panel.tsx
Prompt 62 → pull-to-action.tsx + pull-to-action-indicator.tsx
Prompt 63 → adaptive-input.tsx + adaptive-input-toolbar.tsx
Prompt 64 → haptic-feedback.ts + safe-area-provider.tsx + orientation-handler.tsx + orientation-layout.tsx + keyboard-handler.tsx + index.ts
```

---

## Phase 1.F — Panels (6 ملف → 3 prompts)

```
Prompt 65 → layers-panel.tsx + history-panel.tsx
Prompt 66 → assets-panel.tsx + components-panel.tsx
Prompt 67 → brand-panel.tsx + cms-panel.tsx
```

---

## Phase 1.G — CMS UI (8 ملف → 4 prompts)

```
Prompt 68 → source-picker.tsx + source-settings.tsx
Prompt 69 → collection-browser.tsx + record-list.tsx
Prompt 70 → record-card.tsx + field-mapper.tsx
Prompt 71 → sync-status.tsx + content-binding.tsx
```

---

## Phase 1.H — Auth UI (9 ملف → 5 prompts)

```
Prompt 72 → invite-gate.tsx
Prompt 73 → invite-manager.tsx + invite-form.tsx
Prompt 74 → role-picker.tsx + permission-editor.tsx
Prompt 75 → permission-badge.tsx + member-list.tsx
Prompt 76 → access-denied.tsx + route-guard.tsx
```

---

## Phase 1.I — System Components (3 ملف → 1 prompt)

```
Prompt 77 → offline-indicator.tsx + error-fallback.tsx + recovery-prompt.tsx
```

---

## Phase 1.J — Hooks (19 ملف → 7 prompts)

```
Prompt 78 → use-breakpoint.ts + use-platform.ts + use-touch-device.ts
Prompt 79 → use-theme.ts + use-direction.ts
Prompt 80 → use-keyboard-visible.ts + use-visual-viewport.ts
Prompt 81 → use-online-status.ts + use-reduced-motion.ts
Prompt 82 → use-auth.ts + use-permissions.ts
Prompt 83 → use-cms-source.ts + use-collection.ts
Prompt 84 → use-bottom-sheet.ts + use-gesture-state.ts + use-haptic.ts + use-safe-area.ts + use-orientation.ts + use-thumb-zone.ts
```

---

## Phase 1.K — i18n (3 ملف → 1 prompt)

```
Prompt 85 → ar.json + en.json + provider.tsx
```

---

## Phase 1 — Pages + Layouts (8 ملف → 3 prompts)

```
Prompt 86 → studio-layout.tsx + builder-layout.tsx
Prompt 87 → join.tsx + login.tsx + dashboard.tsx
Prompt 88 → studio.tsx + builder.tsx + cms.tsx
```

---

## Phase 2 — Studio Core (45 ملف → 22 prompts)

### Document System
```
Prompt 89  → document-manager.ts
Prompt 90  → document-validator.ts
Prompt 91  → document-snapshot.ts
```

### Patch System
```
Prompt 92  → patch-apply.ts
Prompt 93  → patch-validate.ts
Prompt 94  → patch-optimize.ts
```

### History
```
Prompt 95  → history-manager.ts + history-types.ts
```

### Interaction
```
Prompt 96  → snap-engine.ts
Prompt 97  → guide-engine.ts
Prompt 98  → transform-engine.ts
```

### Typography
```
Prompt 99  → font-registry.ts
Prompt 100 → font-loader.ts
Prompt 101 → font-metrics.ts
Prompt 102 → rtl-engine.ts
Prompt 103 → fallback-system.ts + google-fonts.ts
```

### Export
```
Prompt 104 → png-exporter.ts + svg-exporter.ts
```

### Fabric Adapter
```
Prompt 105 → runtime.ts
Prompt 106 → document-to-fabric.ts
Prompt 107 → fabric-to-patch.ts
Prompt 108 → object-metadata.ts
```

---

## Phase 2.M — Mobile Runtime (7 ملف → 4 prompts)

```
Prompt 109 → input-controller.ts + gesture-recognizer.ts
Prompt 110 → viewport-controller.ts + zoom-manager.ts
Prompt 111 → kinetic-scroll.ts
Prompt 112 → memory-guard.ts + mobile-history-throttle.ts
```

---

## Phase 2.5 — Typography (مدمج مع Phase 2 أعلاه)

```
تم تغطيته في Prompts 99-103
```

---

## Phase 3 — Builder Core (42 ملف → 11 prompts)

### Document System
```
Prompt 113 → page-manager.ts
Prompt 114 → page-validator.ts
```

### Layout Engine
```
Prompt 115 → flex-engine.ts
Prompt 116 → grid-engine.ts
```

### Responsive
```
Prompt 117 → breakpoint-manager.ts
Prompt 118 → responsive-resolver.ts
```

### Components
```
Prompt 119 → component-registry.ts
Prompt 120 → component-renderer.ts
```

### Bindings
```
Prompt 121 → binding-types.ts
Prompt 122 → binding-resolver.ts
```

### Builder Patch
```
Prompt 123 → builder-patch-apply.ts + builder-patch-validate.ts
```

---

## Phase 3.5 — Brand Kit (5 ملف → 3 prompts)

```
Prompt 124 → brand-types.ts
Prompt 125 → brand-manager.ts + brand-apply-engine.ts
Prompt 126 → brand-storage.ts + token-mapper.ts
```

---

## Phase 4 — CMS Engine (22 ملف → 13 prompts)

### Core
```
Prompt 127 → source-registry.ts
Prompt 128 → collection-manager.ts + record-normalizer.ts
Prompt 129 → schema-inferrer.ts + field-types.ts
Prompt 130 → query-builder.ts
```

### Adapters
```
Prompt 131 → adapter-interface.ts
Prompt 132 → notion-adapter.ts
Prompt 133 → airtable-adapter.ts
Prompt 134 → google-sheets-adapter.ts + supabase-adapter.ts
Prompt 135 → markdown-adapter.ts + json-adapter.ts + rest-api-adapter.ts
```

### Sync
```
Prompt 136 → sync-scheduler.ts + sync-strategy.ts
Prompt 137 → diff-engine.ts + conflict-handler.ts + webhook-handler.ts
```

### Cache
```
Prompt 138 → content-cache.ts + cache-invalidation.ts + offline-content.ts
```

### Transform
```
Prompt 139 → content-transformer.ts + rich-text-parser.ts + media-resolver.ts + relation-resolver.ts
```

---

## Phase 5 — State + Persistence (25 ملف → 11 prompts)

### State Bridge
```
Prompt 140 → store-types.ts
Prompt 141 → document-store.ts
Prompt 142 → selection-store.ts + tool-store.ts
Prompt 143 → ui-store.ts + viewport-store.ts
Prompt 144 → cms-store.ts + auth-store.ts
Prompt 145 → derived-state.ts + subscriptions.ts
```

### Local Draft
```
Prompt 146 → draft-store.ts + draft-recovery.ts + draft-cleanup.ts
```

### Sync Engine
```
Prompt 147 → sync-protocol.ts + conflict-resolver.ts
Prompt 148 → operation-log.ts + merge-strategy.ts
```

### Storage Adapter
```
Prompt 149 → upload-pipeline.ts + image-optimizer.ts
Prompt 150 → asset-cache.ts + cdn-resolver.ts + upload-queue.ts + limits.ts
```

---

## Phase 6 — Error + A11y + Testing (20 ملف → 8 prompts)

### Error Boundary
```
Prompt 151 → error-types.ts + recovery-strategies.ts + crash-reporter.ts
```

### Accessibility
```
Prompt 152 → keyboard-shortcuts.ts + focus-manager.ts
Prompt 153 → aria-labels.ts + contrast-checker.ts
```

### Testing
```
Prompt 154 → strategy.md
Prompt 155 → valid-documents/ (fixtures)
Prompt 156 → corrupt-documents/ + edge-case-patches/ (fixtures)
Prompt 157 → cms-fixtures/ (notion-mock + airtable-mock + sheets-mock)
Prompt 158 → patch-validator.ts + document-integrity.ts + render-helpers.ts + cms-test-utils.ts
```

---

## Phase 7 — Publishing (12 ملف → 6 prompts)

### Publish Adapters
```
Prompt 159 → page-to-astro.ts
Prompt 160 → collection-to-astro.ts + style-generator.ts
Prompt 161 → html-generator.ts + asset-bundler.ts
```

### API Routes
```
Prompt 162 → projects.ts + documents.ts
Prompt 163 → assets.ts + publish.ts
Prompt 164 → sources.ts + sync.ts + webhooks.ts
```

### Services + Workers
```
Prompt 165 → snapshot-service.ts + publish-service.ts + cms-sync-service.ts
Prompt 166 → render-job.ts + transform-job.ts + cms-sync-job.ts
```

---

## API Auth Routes (من Phase 0.5 — تُكتب مع الـ API)

```
Prompt 167 → invite.ts + accept.ts
Prompt 168 → session.ts + members.ts
```

---

## Config Files (مرة واحدة)

```
Prompt 169 → turbo.json + tsconfig.base.json + pnpm-workspace.yaml + global.css
```

---

## Docs (تُكتب بالتوازي)

```
Prompt 170 → ARCHITECTURE_RULES.md
Prompt 171 → CODEX_TASK_TEMPLATE.md
Prompt 172 → MOBILE_UI_CONTRACT.md
Prompt 173 → MOBILE_GESTURE_GUIDE.md
Prompt 174 → MOBILE_PERFORMANCE_GUIDE.md
Prompt 175 → DESIGN_SYSTEM_GUIDE.md
Prompt 176 → FRAMER_UI_GUIDE.md
Prompt 177 → CMS_ADAPTER_GUIDE.md
Prompt 178 → INVITE_SYSTEM_GUIDE.md
Prompt 179 → RBAC_GUIDE.md
```

---

## الملخص

```
╔══════════════════════════════════════════════════╗
║                                                  ║
║   المرحلة           الملفات    الـ Prompts       ║
║   ─────────────────────────────────────────      ║
║   Phase 0            12         6                ║
║   Phase 0.5          14         7 + 2 (API)      ║
║   Phase 1.A          19         9                ║
║   Phase 1.B          20         12               ║
║   Phase 1.C           8         4                ║
║   Phase 1.D          10         8                ║
║   Phase 1.E          32         18               ║
║   Phase 1.F           6         3                ║
║   Phase 1.G           8         4                ║
║   Phase 1.H           9         5                ║
║   Phase 1.I           3         1                ║
║   Phase 1.J          19         7                ║
║   Phase 1.K           3         1                ║
║   Pages/Layouts       8         3                ║
║   Phase 2            45         22               ║
║   Phase 2.M           7         4                ║
║   Phase 3            42         11               ║
║   Phase 3.5           5         3                ║
║   Phase 4            22         13               ║
║   Phase 5            25         11               ║
║   Phase 6            20         8                ║
║   Phase 7            12         6                ║
║   Config              4         1                ║
║   Docs               10         10               ║
║   ─────────────────────────────────────────      ║
║   المجموع           343        179               ║
║                                                  ║
╚══════════════════════════════════════════════════╝

343 ملف ÷ 179 prompt = 1.9 ملف/prompt متوسط
```

---

**179 prompt. كل واحد مركز. كل واحد 95% صحيح.**
