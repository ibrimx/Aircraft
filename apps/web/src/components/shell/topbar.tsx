"use client";

import { Icon } from "@/components/ui/icon";

type TopbarProps = {
  product: "studio" | "builder";
  syncState?: "online" | "offline" | "syncing";
  onOpenMobileSheet?: () => void;
};

export function Topbar({ product, syncState = "online", onOpenMobileSheet }: TopbarProps) {
  const syncLabel =
    syncState === "online" ? "Online" : syncState === "syncing" ? "Syncing…" : "Offline";

  return (
    <header className="topbar" role="banner">
      <div className="brand" aria-label="Brimair">
        <div className="brandMark" aria-hidden="true" />
        <p className="brandTitle">Brimair</p>
      </div>

      <div className="topbarCenter" role="search">
        <div className="search" aria-label="Search">
          <Icon name="search" />
          <input placeholder="Search (بحث)" inputMode="search" />
          <span className="kbd" aria-hidden="true">
            ⌘K
          </span>
        </div>
      </div>

      <div className="topbarRight" aria-label="Topbar actions">
        <span className="pill" title="Sync">
          <Icon name={syncState === "offline" ? "offline" : "cloud"} />
          {syncLabel}
        </span>

        <button className="iconBtn" type="button" aria-label="Settings">
          <Icon name="settings" />
        </button>

        {/* Mobile: open tool sheet */}
        <button
          className="iconBtn"
          type="button"
          aria-label="Open tools"
          onClick={onOpenMobileSheet}
          style={{ display: "none" }}
          data-mobile-only
        >
          <Icon name="chevronUp" />
        </button>

        <span className="pill" aria-label="Current product">
          {product === "studio" ? "Studio (استوديو)" : "Builder (بيلدر)"}
        </span>
      </div>
    </header>
  );
}
