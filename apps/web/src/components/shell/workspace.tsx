"use client";

import type { ReactNode } from "react";

type WorkspaceProps = {
  children?: ReactNode;
};

export function Workspace({ children }: WorkspaceProps) {
  return (
    <section className="workspace" aria-label="Workspace">
      <div className="stage" aria-label="Canvas stage (placeholder)">
        {children}
      </div>
    </section>
  );
}
