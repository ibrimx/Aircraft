import type { HEXColor, RGBAColor } from "./common";

export type ComponentType = "hero" | "feature-grid" | "cta" | "testimonials" | "faq";

export type ComponentVariant =
  | "default"
  | "centered"
  | "split"
  | "minimal"
  | "cards"
  | "stacked";

interface HeroProps {
  readonly headline: string;
  readonly subheadline?: string;
  readonly ctaLabel: string;
  readonly ctaHref: string;
  readonly background: HEXColor | RGBAColor;
}

interface FeatureGridProps {
  readonly title: string;
  readonly columns: 2 | 3 | 4;
  readonly items: ReadonlyArray<{
    readonly title: string;
    readonly description: string;
    readonly icon?: string;
  }>;
}

interface CtaProps {
  readonly title: string;
  readonly description?: string;
  readonly buttonLabel: string;
  readonly buttonHref: string;
}

interface TestimonialsProps {
  readonly title?: string;
  readonly items: ReadonlyArray<{
    readonly quote: string;
    readonly author: string;
    readonly role?: string;
  }>;
}

interface FaqProps {
  readonly title?: string;
  readonly items: ReadonlyArray<{
    readonly question: string;
    readonly answer: string;
  }>;
}

export type BuilderComponentSpec =
  | {
      readonly type: "hero";
      readonly variant: ComponentVariant;
      readonly props: HeroProps;
    }
  | {
      readonly type: "feature-grid";
      readonly variant: ComponentVariant;
      readonly props: FeatureGridProps;
    }
  | {
      readonly type: "cta";
      readonly variant: ComponentVariant;
      readonly props: CtaProps;
    }
  | {
      readonly type: "testimonials";
      readonly variant: ComponentVariant;
      readonly props: TestimonialsProps;
    }
  | {
      readonly type: "faq";
      readonly variant: ComponentVariant;
      readonly props: FaqProps;
    };
