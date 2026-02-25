import type { AssetId, DocumentId, NodeId } from "./ids";
import type { AssetRef, HEXColor, ISODateString, Locale, RGBAColor, Transform } from "./common";

export type EffectSpec =
  | { readonly type: "shadow"; readonly blur: number; readonly offsetX: number; readonly offsetY: number; readonly color: HEXColor | RGBAColor }
  | { readonly type: "blur"; readonly radius: number }
  | { readonly type: "opacity"; readonly value: number };

interface BaseDesignNode<TType extends string, TStyle extends object> {
  readonly id: NodeId;
  readonly type: TType;
  readonly transform: Transform;
  readonly style: Readonly<TStyle>;
  readonly effects?: ReadonlyArray<EffectSpec>;
}

export interface TextNode extends BaseDesignNode<"text", { readonly fill: HEXColor | RGBAColor; readonly opacity: number }> {
  readonly text: string;
  readonly align: "left" | "center" | "right" | "justify";
  readonly direction?: "rtl" | "ltr" | "auto";
  readonly fontFamily: string;
  readonly fontWeight: number;
  readonly letterSpacing: number;
  readonly lineHeight: number;
}

export interface ImageNode extends BaseDesignNode<"image", { readonly cornerRadius: number; readonly opacity: number }> {
  readonly assetId: AssetId;
}

export interface ShapeNode
  extends BaseDesignNode<"shape", { readonly fill: HEXColor | RGBAColor; readonly stroke?: HEXColor | RGBAColor; readonly strokeWidth: number }> {
  readonly shape: "rectangle" | "ellipse" | "polygon";
}

export interface GroupNode extends BaseDesignNode<"group", { readonly opacity: number }> {
  readonly children: ReadonlyArray<NodeId>;
}

export type DesignNode = TextNode | ImageNode | ShapeNode | GroupNode;

export interface DesignDocument {
  readonly id: DocumentId;
  readonly type: "design";
  readonly version: number;
  readonly canvas: {
    readonly width: number;
    readonly height: number;
    readonly background: HEXColor | RGBAColor;
  };
  readonly assets: ReadonlyArray<AssetRef>;
  readonly nodes: ReadonlyArray<DesignNode>;
  readonly effects: ReadonlyArray<EffectSpec>;
  readonly meta: {
    readonly createdAt: ISODateString;
    readonly updatedAt: ISODateString;
    readonly locale: Locale;
    readonly title?: string;
  };
}
