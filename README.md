تمام.
دي النسخة النهائية المعتمدة رسميًا.

نسخة تنفيذية مغلقة.
لا إضافات بعد هذه الوثيقة إلا Bug Fixes.


---

# Brimair — Architecture Blueprint v3.0 (Final Locked)

Model:
Document-First + Patch-Based + Local-First + Mobile-Strong + RTL-Native

Status:
Execution Blueprint — No Feature Drift Allowed

---

# 1) Project Vision

Brimair is a professional visual creation platform combining:

• Studio — Canva-class typography-first design editor  
• Builder — Framer-class responsive website builder  
• Static Publishing — Astro-first export system  

Core Principles:

1. Document is the single source of truth
2. All edits are Patch-based
3. Local-first persistence
4. Supabase cloud authority
5. Mobile runtime engine (not responsive CSS only)
6. RTL-native system
7. Brand-first styling
8. Strict engine isolation

---

# 2) Monorepo Structure

```
brimair/
├── apps/
│   ├── web/
│   ├── api/
│   └── worker/
├── packages/
│   ├── shared-types/
│   ├── studio-engine/
│   ├── builder-engine/
│   ├── fabric-adapter/
│   ├── mobile-runtime/
│   ├── brand-kit/
│   ├── local-draft/
│   ├── publish-adapters/
│   ├── storage-adapter/
│   └── sync-engine/
├── turbo.json
├── tsconfig.base.json
└── pnpm-workspace.yaml
```

---

# 3) Execution Phases

---

# PHASE 0 — Shared Types (7 files)

Purpose:
Define canonical contracts.

```
packages/shared-types/
├── ids.ts
├── common.ts
├── design-document.ts
├── page-document.ts
├── patch-types.ts
├── component-spec.ts
└── site-manifest.ts
```

Rules:
- No dependencies
- No any
- Branded IDs only

---

# PHASE 1 — App Shell + i18n + Theme (~35 files)

Purpose:
Framer-class UI infrastructure.

Includes:

✔ Shell layout  
✔ Sidebar  
✔ Inspector  
✔ Workspace  
✔ Bottom Rail (mobile)  
✔ Bottom Sheet  
✔ i18n (Arabic / English)  
✔ Dark / Light mode  

```
apps/web/src/
├── components/shell/
├── components/ui/
├── i18n/
│   ├── ar.json
│   ├── en.json
│   └── provider.tsx
├── hooks/
└── styles/
```

---

# PHASE 2 — Studio Core (~45 files)

Purpose:
Typography-strong design editor.

Includes:

✔ DesignDocument  
✔ Patch system  
✔ History engine  
✔ Layers Panel  
✔ Guides + Grid + Rulers  
✔ History Panel  
✔ Export PNG  

```
packages/studio-engine/
├── document/
├── patch/
├── interaction/
│   ├── snap-engine.ts
│   ├── guide-engine.ts
│   └── transform-engine.ts
├── typography/
└── export/

packages/fabric-adapter/
├── runtime.ts
├── document-to-fabric.ts
├── fabric-to-patch.ts
└── object-metadata.ts
```

Strict:
Fabric imports only inside fabric-adapter.

---

# PHASE 2.M — Mobile Runtime Engine (~15 files)

Purpose:
Touch-first performance layer.

Includes:

✔ Gesture recognizer  
✔ Pinch-to-zoom  
✔ Viewport engine  
✔ Zoom controls  
✔ Memory guard  
✔ Throttled patches  

```
packages/mobile-runtime/
├── input-controller.ts
├── gesture-recognizer.ts
├── viewport-controller.ts
├── zoom-manager.ts
├── kinetic-scroll.ts
├── memory-guard.ts
└── mobile-history-throttle.ts
```

---

# PHASE 2.5 — Typography + Font System (~10 files)

Includes:

✔ Google Fonts
✔ Uploaded fonts
✔ Variable fonts
✔ Arabic shaping
✔ Font fallback

```
packages/studio-engine/typography/
├── font-registry.ts
├── font-loader.ts
├── font-metrics.ts
├── rtl-engine.ts
├── fallback-system.ts
└── adapters/
```

---

# PHASE 3 — Builder Core (~40 files)

Purpose:
Section-based responsive builder.

Includes:

✔ PageDocument  
✔ Flex engine  
✔ Grid engine  
✔ Breakpoints  
✔ Component Library  

```
packages/builder-engine/
├── document/
├── layout/
├── responsive/
├── components/
└── patch/
```

Builder does NOT depend on Studio.

---

# PHASE 3.5 — Brand Kit (~12 files)

Purpose:
Brand-first styling system.

```
packages/brand-kit/
├── brand-types.ts
├── brand-manager.ts
├── brand-apply-engine.ts
├── brand-storage.ts
└── token-mapper.ts
```

Brand applies to:
- Studio
- Builder
- Publish CSS

---

# PHASE 4 — Local-First + Supabase (~20 files)

Purpose:
Persistence + Offline safety.

Local Draft:

```
packages/local-draft/
├── draft-store.ts
├── draft-recovery.ts
└── draft-cleanup.ts
```

Supabase Tables:

projects  
documents  
patches  
assets  

Snapshot every 20–30 patches.

Offline Indicator added:

```
apps/web/components/system/offline-indicator.tsx
```

---

# PHASE 5 — Publishing + API + Worker (~30 files)

Purpose:
Static export + job system.

```
packages/publish-adapters/
├── astro-adapter/
└── static-adapter/

apps/api/
├── routes/
└── services/

apps/worker/
├── render-job.ts
└── transform-job.ts
```

Astro is default output.

---

# 4) Mandatory Features Included

✔ Layers Panel  
✔ Guides + Grid + Rulers  
✔ Full i18n (UI + RTL)  
✔ History Panel  
✔ Zoom Controls  
✔ Offline Indicator  
✔ Component Library  
✔ Dark / Light Mode  

---

# 5) Dependency Rules

1. shared-types depends on nothing  
2. Studio and Builder are isolated  
3. Fabric only inside adapter  
4. All edits = Patch  
5. Canonical state = Document  
6. No window globals  
7. Mobile runtime sits between UI and Fabric  

---

# 6) File Count Summary

Phase 0 → 7  
Phase 1 → 35  
Phase 2 → 45  
Phase 2.M → 15  
Phase 2.5 → 10  
Phase 3 → 40  
Phase 3.5 → 12  
Phase 4 → 20  
Phase 5 → 30  

TOTAL ≈ 214 files

Enterprise-grade layered system.

---

# 7) Execution Timeline

Week 1 → Shared Types + Shell  
Week 2 → Studio Core  
Week 3 → Mobile Runtime  
Week 4 → Builder Core  
Week 5 → Brand + Persistence  
Week 6 → Publishing  

No skipping.
No parallel chaos.
No feature creep.

---

END — Brimair v3.0 Locked
