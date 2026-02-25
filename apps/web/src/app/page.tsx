import Link from "next/link";

const navCards = [
  { href: "/projects", title: "Projects", description: "Manage your workspaces and drafts." },
  { href: "/studio", title: "Studio", description: "Create immersive visual experiences." },
  { href: "/builder", title: "Builder", description: "Assemble flexible page systems." },
] as const;

export default function HubPage() {
  return (
    <section className="stack" aria-labelledby="hub-title">
      <header>
        <h1 id="hub-title">Brimair Hub</h1>
        <p style={{ margin: 0, color: "var(--text-muted)" }}>
          Start from Projects, or jump directly into Studio and Builder.
        </p>
      </header>

      <nav aria-label="Primary navigation" className="grid-cards">
        {navCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="surface-elevated"
            style={{ display: "block", padding: "1rem", textDecoration: "none" }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "0.5rem" }}>{card.title}</h2>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>{card.description}</p>
          </Link>
        ))}
      </nav>
    </section>
  );
}
