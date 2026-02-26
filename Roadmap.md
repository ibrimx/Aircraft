# Brimair — Product Roadmap

> **هذا الملف يوضع في:** `docs/ROADMAP.md`
>
> **الغرض:** خريطة التوسع من v4.5 إلى v8.0
>
> **القاعدة:** لا يُضاف شيء خارج هذه الخريطة بدون تحديث هذا الملف أولاً

---

## Current: v4.5 (Foundation Release)

**Timeline:** 16 weeks
**Files:** 343
**Prompts:** 179
**Deploys:** 8

### What Ships

| System | Description |
|--------|-------------|
| Studio | Canva-class typography-first design editor |
| Builder | Framer-class responsive website builder |
| CMS | 7-source content system (Notion, Airtable, Sheets, Supabase, Markdown, JSON, REST) |
| Publishing | Astro-first static export |
| Auth | Invite-only registration |
| RBAC | Role-based file and feature permissions |
| Mobile | Native mobile UI — not responsive CSS |
| RTL | Arabic first-class from day one |
| Offline | Local-first persistence with cloud sync |
| UI | Framer-class visual identity with spring animations |

### Architecture Foundation

| Decision | Enables |
|----------|---------|
| Document-First | Every future feature reads/writes to one source of truth |
| Patch-Based | Collaboration possible later without rewrite |
| Package Isolation | New engines added without touching existing ones |
| Adapter Pattern | New CMS sources and publish targets = one file each |
| Component Registry | New builder components = register and done |
| Permission Resolver | New roles = database row only |
| Branded IDs | Type safety across all future systems |
| State Bridge | New stores added without scattered state |

---

## v5.0 — Creator Release

**Timeline:** 8 weeks after v4.5 launch
**Estimated Files:** +80
**Estimated Prompts:** +40

### What Ships

#### Interactions Editor (Phase 8)

| Item | Description |
|------|-------------|
| Purpose | Visual animation and interaction builder |
| Location | `packages/interaction-engine/` |
| Files | ~15 |

```
packages/interaction-engine/
├── trigger-types.ts
├── action-types.ts
├── timeline-manager.ts
├── easing-library.ts
├── keyframe-engine.ts
├── interaction-resolver.ts
└── interaction-types.ts

apps/web/src/components/interaction/
├── interaction-panel.tsx
├── trigger-picker.tsx
├── action-picker.tsx
├── timeline-editor.tsx
├── easing-picker.tsx
├── mobile-interaction-panel.tsx
├── mobile-timeline.tsx
└── keyframe-row.tsx
```

**Triggers:** click, hover, scroll-into-view, page-load, mouse-move
**Actions:** animate (opacity, position, scale, rotation), navigate, show/hide, play-video, open-link
**Timeline:** keyframe-based with easing curves
**Mobile:** timeline editor in Bottom Sheet (full)

**Dependency Rules:**
- interaction-engine depends only on shared-types
- Does not depend on studio-engine or builder-engine
- Binds to components via interaction-binding in document

---

#### SEO Panel (Phase 10)

| Item | Description |
|------|-------------|
| Purpose | Per-page SEO management |
| Location | `packages/seo-engine/` |
| Files | ~10 |

```
packages/seo-engine/
├── meta-manager.ts
├── og-generator.ts
├── sitemap-generator.ts
├── robots-generator.ts
├── structured-data.ts
└── seo-analyzer.ts

apps/web/src/components/seo/
├── seo-panel.tsx
├── meta-editor.tsx
├── og-preview.tsx
└── seo-score.tsx
```

**Features:**
- Title and description per page
- Open Graph tags with visual preview
- Auto-generated sitemap.xml
- Custom robots.txt
- Structured data (JSON-LD) editor
- SEO score with suggestions

**Mobile:** SEO panel in Bottom Sheet (half)

**Dependency Rules:**
- seo-engine depends only on shared-types
- Publish adapters consume seo-engine output at build time

---

#### Additional CMS Adapters

| Adapter | Auth | Real-time | Effort |
|---------|------|-----------|--------|
| WordPress | OAuth | Webhooks | 2 days |
| Contentful | API Key | Webhooks | 2 days |
| Sanity | API Key | Listener | 2 days |
| Firebase Firestore | Service Account | Native | 2 days |
| Strapi | API Key | Webhooks | 1 day |

```
packages/cms-engine/adapters/
├── wordpress-adapter.ts
├── contentful-adapter.ts
├── sanity-adapter.ts
├── firebase-adapter.ts
└── strapi-adapter.ts
```

Each adapter: one file, same interface, no cross-imports.

---

#### Additional Publish Adapters

| Adapter | Output | Effort |
|---------|--------|--------|
| Next.js | React pages | 5 days |
| Email HTML | Responsive email | 3 days |
| PDF | Print-ready document | 3 days |

```
packages/publish-adapters/
├── next-adapter/
│   ├── page-to-next.ts
│   └── style-generator.ts
├── email-adapter/
│   ├── page-to-email.ts
│   └── inline-styles.ts
└── pdf-adapter/
    ├── page-to-pdf.ts
    └── pdf-renderer.ts
```

---

#### Additional Builder Components (+20)

```
packages/builder-engine/components/
├── hero-section.ts
├── feature-grid.ts
├── pricing-table.ts
├── testimonial-slider.ts
├── faq-accordion.ts
├── contact-section.ts
├── team-grid.ts
├── stats-counter.ts
├── logo-cloud.ts
├── cta-banner.ts
├── image-gallery.ts
├── video-embed.ts
├── map-embed.ts
├── social-links.ts
├── newsletter-signup.ts
├── breadcrumbs.ts
├── pagination.ts
├── tabs.ts
├── modal-trigger.ts
└── countdown-timer.ts
```

Each component: type definition + renderer. Registers in component-registry.

---

#### Additional Studio Tools

| Tool | Description | Effort |
|------|-------------|--------|
| Pen | Bezier path drawing | 3 days |
| Line | Straight line with arrows | 1 day |
| Arrow | Directional connector | 1 day |
| Table | Simple data table | 2 days |

---

### v5.0 Quality Gate

```
☐ Interaction editor: add hover animation → preview works
☐ SEO panel: edit meta → published page has correct tags
☐ WordPress adapter: connect → see posts → bind to component
☐ Next.js adapter: publish → working Next.js page
☐ All new components render in builder
☐ All new features work on mobile
☐ All new features respect RTL
☐ All new features respect permissions
```

---

## v6.0 — Team Release

**Timeline:** 12 weeks after v5.0
**Estimated Files:** +120
**Estimated Prompts:** +60

### What Ships

#### Real-time Collaboration (Phase 13)

| Item | Description |
|------|-------------|
| Purpose | Multiple editors on same document |
| Impact | sync-engine rewrite + state-bridge modification |
| Files | ~35 |

```
packages/sync-engine/          ← rewrite
├── crdt-engine.ts             ← replaces simple merge
├── awareness-manager.ts       ← who is where
├── presence-channel.ts        ← Supabase Realtime
├── cursor-sync.ts             ← remote cursors
├── operation-transform.ts     ← conflict resolution
├── sync-protocol-v2.ts       ← new protocol
└── sync-recovery.ts          ← handling disconnects

packages/state-bridge/         ← additions
├── presence-store.ts          ← new
├── remote-cursors-store.ts    ← new

apps/web/src/components/collaboration/
├── remote-cursor.tsx
├── presence-avatars.tsx
├── collaboration-indicator.tsx
├── conflict-toast.tsx
└── mobile-presence-bar.tsx
```

**Why it works:**
- A1 (Patch Envelope) already has actorId and logicalTimestamp
- A2 (Idempotency) ensures replay safety
- A3 (Conflict Resolution) defines merge rules
- These were designed from day one for this

**What changes:**
- sync-engine: major rewrite (CRDT or OT)
- state-bridge: add presence and cursor stores
- UI: add cursor overlays and presence indicators

**What does NOT change:**
- Document model stays same
- Fabric adapter stays same
- UI components stay same
- CMS engine stays same
- Auth engine stays same
- Studio engine stays same
- Builder engine stays same

---

#### Forms Builder (Phase 9)

| Item | Description |
|------|-------------|
| Purpose | Visual form creation with submissions |
| Location | `packages/forms-engine/` |
| Files | ~20 |

```
packages/forms-engine/
├── form-types.ts
├── field-registry.ts
├── validation-engine.ts
├── submission-handler.ts
├── form-renderer.ts
└── integrations/
    ├── email-integration.ts
    ├── webhook-integration.ts
    ├── sheets-integration.ts
    ├── notion-integration.ts
    └── supabase-integration.ts

apps/web/src/components/forms/
├── form-builder-panel.tsx
├── field-picker.tsx
├── field-editor.tsx
├── validation-editor.tsx
├── submission-list.tsx
├── integration-picker.tsx
├── mobile-form-builder.tsx
├── mobile-field-editor.tsx
└── mobile-submission-list.tsx
```

**Field Types:** text, email, phone, number, textarea, select, multi-select, checkbox, radio, date, file-upload, rating, signature

**Validations:** required, min/max length, pattern, custom

**Integrations:** send email, call webhook, add to Google Sheet, add to Notion, insert into Supabase table

---

#### Analytics (Phase 11)

```
packages/analytics-engine/
├── tracker-types.ts
├── event-tracker.ts
├── dashboard-data.ts
└── integrations/
    ├── google-analytics.ts
    ├── plausible.ts
    └── umami.ts

apps/web/src/components/analytics/
├── analytics-panel.tsx
├── page-views-chart.tsx
├── top-pages.tsx
├── mobile-analytics.tsx
└── analytics-settings.tsx
```

**Features:**
- Page views per published page
- Top pages by views
- Traffic sources
- Integration with GA, Plausible, or Umami
- Simple dashboard inside Brimair

---

#### Template Marketplace (Phase 12)

```
packages/template-engine/
├── template-types.ts
├── template-registry.ts
├── template-installer.ts
├── template-exporter.ts
├── template-validator.ts
├── template-preview.ts
└── template-search.ts

apps/web/src/components/templates/
├── template-gallery.tsx
├── template-card.tsx
├── template-preview-modal.tsx
├── template-install-flow.tsx
├── mobile-template-gallery.tsx
└── mobile-template-preview.tsx
```

**Features:**
- Browse templates by category
- Preview before installing
- Install template as new project
- Export your project as template
- Template includes: pages, components, brand, CMS bindings (empty)

---

### v6.0 Quality Gate

```
☐ Two users edit same document → both see changes
☐ Cursors appear in real-time
☐ Disconnect → reconnect → state syncs correctly
☐ Form built → submitted → data arrives in integration
☐ Analytics shows page views for published site
☐ Template installed → produces working project
☐ All features work on mobile
☐ All features respect RTL and permissions
```

---

## v7.0 — Platform Release

**Timeline:** 16 weeks after v6.0
**Estimated Files:** +150
**Estimated Prompts:** +75

### What Ships

#### Plugin System (Phase 14)

```
packages/plugin-system/
├── plugin-types.ts
├── plugin-registry.ts
├── plugin-sandbox.ts
├── plugin-api.ts
├── plugin-lifecycle.ts
├── plugin-validator.ts
├── plugin-permissions.ts
└── plugin-store.ts

apps/web/src/components/plugins/
├── plugin-marketplace.tsx
├── plugin-card.tsx
├── plugin-detail.tsx
├── plugin-settings.tsx
├── installed-plugins.tsx
├── mobile-plugin-marketplace.tsx
└── mobile-plugin-settings.tsx
```

**Plugin Types:**

| Type | What it adds | Example |
|------|-------------|---------|
| Component | New builder component | Custom carousel |
| Tool | New studio tool | Mockup generator |
| CMS Source | New CMS adapter | Custom database |
| Export | New publish format | Figma export |
| Integration | External service | Slack notifications |
| Theme | Token set + styles | Corporate theme |

**Security:**
- Plugins run in sandboxed iframe or Web Worker
- Plugin API limits what plugins can access
- Plugin permissions declared in manifest
- User approves permissions on install

---

#### Hosting + Custom Domains (Phase 15)

```
infrastructure/
├── hosting-service/
│   ├── deploy-manager.ts
│   ├── domain-manager.ts
│   ├── ssl-manager.ts
│   ├── cdn-config.ts
│   ├── edge-functions/
│   │   ├── redirect-handler.ts
│   │   ├── header-handler.ts
│   │   └── middleware.ts
│   └── monitoring/
│       ├── uptime-checker.ts
│       └── performance-monitor.ts

apps/web/src/components/hosting/
├── domain-settings.tsx
├── deploy-history.tsx
├── deploy-status.tsx
├── domain-dns-guide.tsx
├── ssl-status.tsx
├── mobile-domain-settings.tsx
└── mobile-deploy-status.tsx
```

**Features:**
- One-click deploy from Builder
- Custom domain connection
- Automatic SSL (Let's Encrypt)
- CDN distribution (Cloudflare)
- Deploy history with rollback
- Edge functions for redirects and headers

**Infrastructure:**
- Cloudflare Workers for edge
- Cloudflare Pages for static hosting
- Cloudflare DNS for domain management
- Or equivalent: Vercel / AWS CloudFront

---

#### Billing System (Phase 16)

```
packages/billing-engine/
├── plan-types.ts
├── plan-manager.ts
├── usage-tracker.ts
├── quota-enforcer.ts
└── payment-integration.ts

apps/api/routes/billing/
├── plans.ts
├── subscription.ts
├── usage.ts
└── webhooks.ts

apps/web/src/components/billing/
├── plan-picker.tsx
├── current-plan.tsx
├── usage-dashboard.tsx
├── payment-method.tsx
├── invoice-list.tsx
├── mobile-plan-picker.tsx
└── mobile-usage.tsx
```

**Plans (example):**

| Plan | Projects | Pages | CMS Sources | Publish | Collaborators |
|------|----------|-------|-------------|---------|---------------|
| Free | 1 | 3 | 1 | Static export only | 1 |
| Pro | 10 | Unlimited | 5 | Hosting included | 3 |
| Team | Unlimited | Unlimited | Unlimited | Hosting + domains | 10 |
| Enterprise | Unlimited | Unlimited | Unlimited | Everything | Unlimited |

**Payment:** Stripe integration

---

### v7.0 Quality Gate

```
☐ Plugin installed from marketplace → works in builder
☐ Plugin uninstalled → no traces left
☐ Custom domain connected → site loads with SSL
☐ Deploy → rollback → previous version restores
☐ Billing: upgrade plan → quota increases
☐ Billing: exceed quota → gentle enforcement
☐ All features on mobile
☐ All features respect RTL and permissions
```

---

## v8.0 — Enterprise Release

**Timeline:** Open-ended — after v7.0 stabilizes
**Scope:** Based on market demand

### Potential Features

#### AI Features

| Feature | Description |
|---------|-------------|
| AI Layout Suggest | Suggest section layouts based on content |
| AI Copy | Generate text from prompt |
| AI Image | Generate images from prompt |
| AI Brand | Generate brand kit from logo |
| AI SEO | Auto-generate meta descriptions |
| AI Translate | Translate content between languages |

**Rule:** AI features are assistive — never automatic. User always confirms.

---

#### White-Label

| Feature | Description |
|---------|-------------|
| Custom branding | Replace Brimair logo and colors |
| Custom domain for app | client.yourdomain.com |
| Custom email templates | Branded invite emails |
| Isolated data | Per-tenant data isolation |

---

#### E-commerce

| Feature | Description |
|---------|-------------|
| Product catalog | Manage products in CMS or built-in |
| Cart | Shopping cart component |
| Checkout | Payment flow |
| Inventory | Stock management |
| Shipping | Shipping rules |

**Note:** This is a separate product. Only pursue if market demands.

---

#### Advanced Collaboration

| Feature | Description |
|---------|-------------|
| Comments | Comment on specific elements |
| Version branches | Git-like branching for designs |
| Review mode | Stakeholder review with annotations |
| Approval flow | Content approval before publish |

---

## Version Summary

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   v4.5   Foundation    Studio + Builder + CMS + Auth         ║
║          16 weeks      343 files   179 prompts               ║
║                                                              ║
║   v5.0   Creator       + Interactions + SEO + More Adapters  ║
║          8 weeks       +80 files   +40 prompts               ║
║                                                              ║
║   v6.0   Team          + Collaboration + Forms + Analytics   ║
║          12 weeks      +120 files  +60 prompts               ║
║                                                              ║
║   v7.0   Platform      + Plugins + Hosting + Billing         ║
║          16 weeks      +150 files  +75 prompts               ║
║                                                              ║
║   v8.0   Enterprise    + AI + White-Label + E-commerce       ║
║          Open          Based on market demand                ║
║                                                              ║
║   Total through v7.0:                                        ║
║   ~693 files   ~354 prompts   ~52 weeks                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## Expansion Rules

1. Every new feature = new package or new adapter — never modify existing engines
2. Every new package depends only on shared-types unless explicitly stated
3. Every new UI component follows DESIGN_SYSTEM_GUIDE.md
4. Every new mobile component follows MOBILE_UI_CONTRACT.md
5. Every new feature must work on mobile
6. Every new feature must respect RTL
7. Every new feature must respect permissions
8. This roadmap must be updated before any feature is added
9. No feature from a later version is pulled into an earlier version
10. v4.5 ships first — no exceptions

---

**END — Brimair Product Roadmap**

**v4.5 → v5.0 → v6.0 → v7.0 → v8.0**

**Foundation → Creator → Team → Platform → Enterprise**
