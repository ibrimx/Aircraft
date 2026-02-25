import type { AssetRef, HEXColor, ISODateString, RGBAColor, Transform } from "./common";
import type { EffectSpec } from "./design-document";
import type { ActorId, AssetId, DocumentId, NodeId, PatchId } from "./ids";

export interface PatchBase {
  readonly patchId: PatchId;
  readonly docId: DocumentId;
  readonly actorId: ActorId;
  readonly clientSeq: number;
  readonly timestamp: ISODateString;
  readonly baseVersion?: number;
}

export interface NodeAdd extends PatchBase {
  readonly type: "node.add";
  readonly nodeId: NodeId;
  readonly nodeType:
    | "text"
    | "image"
    | "shape"
    | "group"
    | "section"
    | "container"
    | "button"
    | "divider"
    | "component-instance";
  readonly parentId?: NodeId;
  readonly index?: number;
}

export interface NodeRemove extends PatchBase {
  readonly type: "node.remove";
  readonly nodeId: NodeId;
}

export interface NodeUpdateTransform extends PatchBase {
  readonly type: "node.updateTransform";
  readonly nodeId: NodeId;
  readonly transform: Transform;
}

export type DesignNodeStylePatch =
  | {
      readonly type: "text";
      readonly fill?: HEXColor | RGBAColor;
      readonly opacity?: number;
    }
  | {
      readonly type: "image";
      readonly cornerRadius?: number;
      readonly opacity?: number;
    }
  | {
      readonly type: "shape";
      readonly fill?: HEXColor | RGBAColor;
      readonly stroke?: HEXColor | RGBAColor;
      readonly strokeWidth?: number;
    }
  | {
      readonly type: "group";
      readonly opacity?: number;
    };

export type PageNodeStylePatch =
  | {
      readonly type: "section";
      readonly background?: HEXColor | RGBAColor;
      readonly padding?: number;
    }
  | {
      readonly type: "container";
      readonly background?: HEXColor | RGBAColor;
      readonly gap?: number;
      readonly padding?: number;
    }
  | {
      readonly type: "text";
      readonly color?: HEXColor | RGBAColor;
      readonly fontSize?: number;
      readonly fontWeight?: number;
    }
  | {
      readonly type: "image";
      readonly cornerRadius?: number;
      readonly objectFit?: "cover" | "contain" | "fill";
    }
  | {
      readonly type: "button";
      readonly variant?: "primary" | "secondary" | "ghost";
      readonly radius?: number;
      readonly background?: HEXColor | RGBAColor;
    }
  | {
      readonly type: "divider";
      readonly color?: HEXColor | RGBAColor;
      readonly thickness?: number;
    }
  | {
      readonly type: "component-instance";
      readonly gap?: number;
      readonly padding?: number;
    };

export interface NodeUpdateStyleDesign extends PatchBase {
  readonly type: "node.updateStyle";
  readonly nodeId: NodeId;
  readonly kind: "design";
  readonly style: DesignNodeStylePatch;
}

export interface NodeUpdateStylePage extends PatchBase {
  readonly type: "node.updateStyle";
  readonly nodeId: NodeId;
  readonly kind: "page";
  readonly style: PageNodeStylePatch;
}

export type NodeUpdateStyle = NodeUpdateStyleDesign | NodeUpdateStylePage;

export interface NodeUpdateText extends PatchBase {
  readonly type: "node.updateText";
  readonly nodeId: NodeId;
  readonly text: string;
}

export interface EffectAdd extends PatchBase {
  readonly type: "effect.add";
  readonly nodeId: NodeId;
  readonly effect: EffectSpec;
}

export interface EffectUpdate extends PatchBase {
  readonly type: "effect.update";
  readonly nodeId: NodeId;
  readonly index: number;
  readonly effect: EffectSpec;
}

export interface EffectRemove extends PatchBase {
  readonly type: "effect.remove";
  readonly nodeId: NodeId;
  readonly index: number;
}

export interface AssetAdd extends PatchBase {
  readonly type: "asset.add";
  readonly asset: AssetRef;
}

export interface AssetRemove extends PatchBase {
  readonly type: "asset.remove";
  readonly assetId: AssetId;
}

export interface AssetRelink extends PatchBase {
  readonly type: "asset.relink";
  readonly nodeId: NodeId;
  readonly assetId: AssetId;
}

export interface DocUpdateCanvas extends PatchBase {
  readonly type: "doc.updateCanvas";
  readonly canvas: {
    readonly width?: number;
    readonly height?: number;
    readonly background?: HEXColor | RGBAColor;
  };
}

export type Patch =
  | NodeAdd
  | NodeRemove
  | NodeUpdateTransform
  | NodeUpdateStyle
  | NodeUpdateText
  | EffectAdd
  | EffectUpdate
  | EffectRemove
  | AssetAdd
  | AssetRemove
  | AssetRelink
  | DocUpdateCanvas;
