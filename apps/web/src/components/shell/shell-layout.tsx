"use client";

import type { ReactNode } from "react";
import { Topbar } from "./topbar";
import { Workspace } from "./workspace";
import { InspectorPanel } from "./inspector-panel";
import { BottomRail, type MobileSheetTab } from "./bottom-rail";
import { BottomSheet } from "./bottom-sheet";

type ShellLayoutProps = {
  product: "studio" | "builder";
  children?: ReactNode;
};

export function ShellLayout({ product, children }: ShellLayoutProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetTab, setSheetTab] = useState<MobileSheetTab>("layers");

  const open = (tab: MobileSheetTab) => {
    setSheetTab(tab);
    setSheetOpen(true);
  };

  const close = () => setSheetOpen(false);

  return (
    <div className="shell">
      <Topbar product={product} syncState="online" />

      <div className="shellBody">
        <aside className="side" aria-label="Sidebar">
          <div className="panelTitle">Tools</div>
          <div className="list">
            <div className="item">
              <div>
                <strong>Layers</strong>
                <div style={{ color: "var(--muted)", fontSize: 12 }}>Manage stack</div>
              </div>
              <button className="iconBtn" type="button" aria-label="Open layers" onClick={() => open("layers")}>
                <span style={{ fontSize: 12 }}>Open</span>
              </button>
            </div>

            <div className="item">
              <div>
                <strong>Guides</strong>
                <div style={{ color: "var(--muted)", fontSize: 12 }}>Grid + rulers</div>
              </div>
              <button className="iconBtn" type="button" aria-label="Open guides" onClick={() => open("guides")}>
                <span style={{ fontSize: 12 }}>Open</span>
              </button>
            </div>

            <div className="item">
              <div>
                <strong>Assets</strong>
                <div style={{ color: "var(--muted)", fontSize: 12 }}>Uploads</div>
              </div>
              <button className="iconBtn" type="button" aria-label="Open assets" onClick={() => open("assets")}>
                <span style={{ fontSize: 12 }}>Open</span>
              </button>
            </div>
          </div>
        </aside>

        <Workspace>{children}</Workspace>

        <InspectorPanel />
      </div>

      <BottomRail onOpen={open} />
      <BottomSheet open={sheetOpen} tab={sheetTab} onClose={close} />
    </div>
  );
}

/* React import at end to keep file compact */
import { useState } from "react";
