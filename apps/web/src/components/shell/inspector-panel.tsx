"use client";

import { Icon } from "@/components/ui/icon";

export function InspectorPanel() {
  return (
    <aside className="inspector" aria-label="Inspector">
      <div className="panelTitle">Inspector</div>

      <div className="list">
        <div className="item">
          <div>
            <strong>Typography</strong>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>RTL + Fonts</div>
          </div>
          <Icon name="chevronRight" />
        </div>

        <div className="item">
          <div>
            <strong>Layout</strong>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Size / Position</div>
          </div>
          <Icon name="chevronRight" />
        </div>

        <div className="item">
          <div>
            <strong>Effects</strong>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Shadow / Blur</div>
          </div>
          <Icon name="chevronRight" />
        </div>
      </div>
    </aside>
  );
}
