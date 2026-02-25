import Link from "next/link";

export default function StudioPage() {
  return (
    <section className="stack" aria-labelledby="studio-title">
      <h1 id="studio-title">Studio</h1>
      <p style={{ margin: 0, color: "var(--text-muted)" }}>
        Studio shell will be implemented in Phase 1-B.
      </p>
      <nav aria-label="Studio navigation" className="surface" style={{ padding: "1rem" }}>
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
