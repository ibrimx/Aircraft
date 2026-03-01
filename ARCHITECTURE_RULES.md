You are working on Aircraft v3.0 — a strict TypeScript monorepo.

Architectural Principles (MANDATORY):

1) Document is the single source of truth.
   Fabric JSON must NEVER be treated as canonical state.

2) All state mutations MUST generate Patch operations.
   No direct mutation without a Patch.

3) Respect package boundaries strictly.
   Do NOT introduce cross-package shortcuts.

4) Fabric imports are allowed ONLY inside:
   - packages/fabric-adapter
   - approved canvas integration boundary

5) Studio and Builder are isolated.
   They must not depend on each other.

6) No `any` in domain models.
   Use strict typing and branded IDs from shared-types.

7) No window globals.
   Do not attach anything to `window`.

8) Mobile input must go through mobile-runtime layer.
   Do not bind raw DOM touch events directly to canvas logic.

9) Code must compile with:
   pnpm -w exec tsc -b --noEmit

10) Do not introduce new architectural patterns unless explicitly instructed.

If unsure, prefer architectural safety over speed.
