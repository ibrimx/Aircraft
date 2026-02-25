import Link from "next/link";

const projectItems = ["Demo Site", "Demo Poster"] as const;

export default function ProjectsPage() {
  return (
    <section className="stack" aria-labelledby="projects-title">
      <header>
        <h1 id="projects-title">Projects</h1>
        <p style={{ margin: 0, color: "var(--text-muted)" }}>Pick a demo project to open in Studio.</p>
      </header>

      <ul className="stack" style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {projectItems.map((projectName) => (
          <li key={projectName} className="surface" style={{ padding: "0.9rem 1rem" }}>
            <Link href="/studio" style={{ textDecoration: "none" }}>
              {projectName}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
