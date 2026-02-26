"use client";

import { Icon } from "@/components/ui/icon";

export type MobileSheetTab =
  | "layers"
  | "guides"
  | "history"
  | "zoom"
  | "inspector"
  | "assets";

type BottomRailProps = {
  onOpen: (tab: MobileSheetTab) => void;
};

export function BottomRail({ onOpen }: BottomRailProps) {
  return (
    <nav className="bottomRail" aria-label="Mobile tools">
      <div className="railGroup">
        <button className="railBtn" type="button" onClick={() => onOpen("layers")}>
          <Icon name="layers" />
          <span>Layers</span>
        </button>
        <button className="railBtn" type="button" onClick={() => onOpen("guides")}>
          <Icon name="ruler" />
          <span>Guides</span>
        </button>
      </div>

      <div className="railGroup">
        <button className="railBtn" type="button" onClick={() => onOpen("history")}>
          <Icon name="history" />
          <span>History</span>
        </button>
        <button className="railBtn" type="button" onClick={() => onOpen("zoom")}>
          <Icon name="zoomIn" />
          <span>Zoom</span>
        </button>
      </div>

      <div className="railGroup">
        <button className="railBtn" type="button" onClick={() => onOpen("inspector")}>
          <Icon name="settings" />
          <span>Edit</span>
        </button>
      </div>
    </nav>
  );
}
