import Link from "next/link";

export default function BuilderPage() {
  return (
    <section className="stack" aria-labelledby="builder-title">
      <h1 id="builder-title">Builder</h1>
      <p style={{ margin: 0, color: "var(--text-muted)" }}>
        Builder shell will be implemented in Phase 1-B.
      </p>
      <nav aria-label="Builder navigation" className="surface" style={{ padding: "1rem" }}>
        <ul style={{ margin: 0, paddingInlineStart: "1.2rem", display: "grid", gap: "0.5rem" }}>
          <li>
            <Link href="/">Back to Hub</Link>
          </li>
          <li>
            <Link href="/projects">Go to Projects</Link>
          </li>
        </ul>
      </nav>
    </section>
  );
}
