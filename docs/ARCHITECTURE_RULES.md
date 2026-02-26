Brimair — Architecture Rules
هذا الملف يُقرأ قبل كتابة أي كود في أي package أو app.
كل قاعدة هنا غير قابلة للتفاوض.

1) Monorepo Structure:
- apps/web: React UI — Framer Motion مسموح هنا فقط
- apps/api: API routes — Express/Hono
- apps/worker: Background jobs
- packages: كل engine ومكتبة مشتركة
- testing: Fixtures + test utils
- docs: هذه الملفات

2) Dependency Direction:
- shared-types لا يعتمد على أي شيء
- كل engine يعتمد فقط على shared-types
- fabric-adapter يعتمد على shared-types + studio-engine
- publish-adapters يعتمد على shared-types + builder-engine
- apps/web يعتمد على كل packages
- apps/api يعتمد على shared-types + engines + auth-engine
- apps/worker يعتمد على shared-types + engines

3) Isolation Rules:
- Studio ≠ Builder: لا يستوردان من بعضهما أبداً
- Fabric محبوس: fabric-adapter هو الملف الوحيد الذي يستورد fabric.js
- لا Fabric types تتسرب: كل ما يخرج من fabric-adapter يستخدم shared-types فقط
- Framer Motion محبوس: فقط داخل apps/web
- Stores محبوسة: كل stores في state-bridge فقط
- Auth مستقل: auth-engine لا يعتمد على أي engine آخر

4) Data Flow:
المسموح فقط: UI → Action → Patch → Document Store → UI
ممنوع: UI يعدّل document مباشرة
ممنوع: UI يعدّل canvas مباشرة إلا preview داخل fabric-adapter
ممنوع: Component ينادي API مباشرة (يمر عبر store أو hook)

5) Patch Rules:
- كل تغيير في document يُنتج Patch
- لا تعديل مباشر على document
- Patch يحمل Envelope كامل (A1)
- Patch idempotent (A2)
- Document يظل valid بعد أي patch (A9)

6) Code Rules:
- لا any: استخدم unknown ثم narrowing
- لا raw string IDs: استخدم Branded IDs من shared-types
- لا window/document في packages (مسموح فقط في apps/web)
- لا hardcoded colors/spacing/shadows: tokens فقط
- لا left/right في CSS: استخدم logical properties
- لا default exports: named exports دائماً
- كل interactive element لازم aria-label

7) File Rules:
- filenames kebab-case
- كل مجلد فيه index.ts barrel export
- لا ملف يتجاوز 300 سطر
- لا circular imports أبداً

Self-Check:
- هل الملف في package الصحيح؟
- هل imports تتبع اتجاه dependencies؟
- هل يوجد fabric import خارج fabric-adapter؟
- هل يوجد framer-motion خارج apps/web؟
- هل كل تغيير state يمر عبر Patch؟
- هل يوجد any؟
- هل يوجد hardcoded values؟
