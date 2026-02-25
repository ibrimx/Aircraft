import type { AssetId, DocumentId, NodeId } from "./ids";
import type { AssetRef, HEXColor, ISODateString, RGBAColor, Transform } from "./common";

interface BasePageNode<TType extends string, TStyle extends object> {
  readonly id: NodeId;
  readonly type: TType;
  readonly transform: Transform;
  readonly style: Readonly<TStyle>;
}

export interface SectionNode extends BasePageNode<"section", { readonly background?: HEXColor | RGBAColor; readonly padding: number }> {
  readonly children: ReadonlyArray<NodeId>;
}

export interface ContainerNode
  extends BasePageNode<"container", { readonly background?: HEXColor | RGBAColor; readonly gap: number; readonly padding: number }> {
  readonly layout: "row" | "column" | "grid";
  readonly children: ReadonlyArray<NodeId>;
}

export interface TextNode
  extends BasePageNode<"text", { readonly color: HEXColor | RGBAColor; readonly fontSize: number; readonly fontWeight: number }> {
  readonly text: string;
  readonly align: "left" | "center" | "right" | "justify";
  readonly direction?: "rtl" | "ltr" | "auto";
}

export interface ImageNode extends BasePageNode<"image", { readonly cornerRadius: number; readonly objectFit: "cover" | "contain" | "fill" }> {
  readonly assetId: AssetId;
  readonly alt?: string;
}

export interface ButtonNode
  extends BasePageNode<"button", { readonly variant: "primary" | "secondary" | "ghost"; readonly radius: number; readonly background: HEXColor | RGBAColor }> {
  readonly label: string;
  readonly href: string;
}

export interface DividerNode extends BasePageNode<"divider", { readonly color: HEXColor | RGBAColor; readonly thickness: number }> {}

export interface ComponentInstanceNode
  extends BasePageNode<"component-instance", { readonly gap?: number; readonly padding?: number }> {
  readonly componentType: "hero" | "feature-grid" | "cta" | "testimonials" | "faq";
  readonly variant?: string;
}

export type PageNode =
  | SectionNode
  | ContainerNode
  | TextNode
  | ImageNode
  | ButtonNode
  | DividerNode
  | ComponentInstanceNode;

export interface BreakpointSpec {
  readonly type: "breakpoint";
  readonly name: "mobile" | "tablet" | "desktop";
  readonly minWidth: number;
  readonly maxWidth?: number;
}

export interface PageDocument {
  readonly id: DocumentId;
  readonly type: "page";
  readonly version: number;
  readonly assets: ReadonlyArray<AssetRef>;
  readonly nodes: ReadonlyArray<PageNode>;
  readonly breakpoints: ReadonlyArray<BreakpointSpec>;
  readonly meta: {
    readonly createdAt: ISODateString;
    readonly updatedAt: ISODateString;
    readonly title: string;
    readonly seo?: {
      readonly description?: string;
      readonly image?: string;
    };
  };
}
