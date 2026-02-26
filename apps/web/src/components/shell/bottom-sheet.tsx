"use client";

import { Icon } from "@/components/ui/icon";
import type { MobileSheetTab } from "./bottom-rail";

type BottomSheetProps = {
  open: boolean;
  tab: MobileSheetTab;
  onClose: () => void;
};

const titles: Record<MobileSheetTab, string> = {
  layers: "Layers (الطبقات)",
  guides: "Guides + Grid (الإرشادات)",
  history: "History (السجل)",
  zoom: "Zoom (التكبير)",
  inspector: "Inspector (الخصائص)",
  assets: "Assets (الملفات)",
};

export function BottomSheet({ open, tab, onClose }: BottomSheetProps) {
  if (!open) return null;

  return (
    <div className="sheetBackdrop" role="dialog" aria-modal="true" aria-label={titles[tab]}>
      <div className="sheet">
        <div className="sheetHandle" aria-hidden="true" />
        <div className="sheetHeader">
          <strong>{titles[tab]}</strong>
          <button className="iconBtn" type="button" aria-label="Close" onClick={onClose}>
            <Icon name="chevronDown" />
          </button>
        </div>

        <div className="sheetContent">
          {tab === "layers" && (
            <div className="sheetGrid">
              <div className="sheetTile">
                <b>Layer List</b>
                <p>Hide / Lock / Reorder (إخفاء / قفل / ترتيب)</p>
              </div>
              <div className="sheetTile">
                <b>Selection</b>
                <p>Multi-select ready (تحديد متعدد)</p>
              </div>
            </div>
          )}

          {tab === "guides" && (
            <div className="sheetGrid">
              <div className="sheetTile">
                <b>Rulers</b>
                <p>Canvas rulers + snapping</p>
              </div>
              <div className="sheetTile">
                <b>Grid</b>
                <p>Snap to grid (التقاط على الشبكة)</p>
              </div>
            </div>
          )}

          {tab === "history" && (
            <div className="sheetGrid">
              <div className="sheetTile">
                <b>Undo / Redo</b>
                <p>Patch-based later</p>
              </div>
              <div className="sheetTile">
                <b>Timeline</b>
                <p>Jump to step (ارجع لخطوة)</p>
              </div>
            </div>
          )}

          {tab === "zoom" && (
            <div className="sheetGrid">
              <div className="sheetTile">
                <b>Fit</b>
                <p>Fit to screen</p>
              </div>
              <div className="sheetTile">
                <b>100%</b>
                <p>Reset zoom</p>
              </div>
            </div>
          )}

          {tab === "inspector" && (
            <div className="sheetGrid">
              <div className="sheetTile">
                <b>Typography</b>
                <p>RTL first (RTL أولاً)</p>
              </div>
              <div className="sheetTile">
                <b>Spacing</b>
                <p>Padding / Gap</p>
              </div>
            </div>
          )}

          {tab === "assets" && (
            <div className="sheetGrid">
              <div className="sheetTile">
                <b>Uploads</b>
                <p>Local-first cache later</p>
              </div>
              <div className="sheetTile">
                <b>Library</b>
                <p>Brand kit later</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
