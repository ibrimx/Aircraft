import type { SVGProps } from "react";
import { cx } from "@/lib/cx";

type IconProps = SVGProps<SVGSVGElement> & {
  name:
    | "chevronLeft"
    | "chevronRight"
    | "chevronDown"
    | "plus"
    | "search"
    | "layers"
    | "grid"
    | "ruler"
    | "history"
    | "zoomIn"
    | "zoomOut"
    | "cloud"
    | "offline"
    | "settings";
};

const paths: Record<IconProps["name"], string> = {
  chevronLeft: "M15 18l-6-6 6-6",
  chevronRight: "M9 18l6-6-6-6",
  chevronDown: "M6 9l6 6 6-6",
  plus: "M12 5v14M5 12h14",
  search: "M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15a7.5 7.5 0 0 1 0 15Z",
  layers: "M12 2l9 5-9 5-9-5 9-5Zm9 10-9 5-9-5",
  grid: "M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z",
  ruler: "M3 7h18M7 7v4M11 7v2M15 7v4M19 7v2",
  history: "M3 12a9 9 0 1 0 3-6.7M3 3v6h6M12 7v6l4 2",
  zoomIn: "M11 11V8m0 3H8m3 0h3m6 10-4.2-4.2",
  zoomOut: "M8 11h6m6 10-4.2-4.2",
  cloud: "M7 18h9a4 4 0 0 0 .7-7.9A5 5 0 0 0 7.2 8.6A4 4 0 0 0 7 18Z",
  offline: "M3 3l18 18M7 18h9a4 4 0 0 0 3.7-5.4",
  settings:
    "M12 15.5a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7Z M19.4 15a7.8 7.8 0 0 0 .1-2l2-1.2-2-3.5-2.3.7a7.5 7.5 0 0 0-1.7-1l-.3-2.4h-4l-.3 2.4a7.5 7.5 0 0 0-1.7 1L6.5 8.3l-2 3.5 2 1.2a7.8 7.8 0 0 0 .1 2l-2 1.2 2 3.5 2.3-.7a7.5 7.5 0 0 0 1.7 1l.3 2.4h4l.3-2.4a7.5 7.5 0 0 0 1.7-1l2.3.7 2-3.5-2-1.2Z",
};

export function Icon({ name, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx("ui-icon", className)}
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
