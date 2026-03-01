Aircraft — Framer UI Guide
يُقرأ عند كتابة أي component بصري في apps/web.
يحدد الشكل والإحساس والحركة.

1) Visual DNA:
- Graduated Darkness
- Glass Morphism
- Ghost Borders
- Spring Animation
- Generous Whitespace
- Light Typography
- Brutal Simplicity

2) Animation Rules:
- Spring للتفاعلات (مش durations)
- Duration فقط للـ ambient transitions
- prefers-reduced-motion: opacity أو instant فقط
- لا animation في: tool switch, inspector updates
- handles: fade فقط (duration.fast)

3) Component Appearance Rules:
Glass panels:
surface.glass + blur + border.subtle + shadow.float + radius.lg
Inputs:
surface.tertiary + border.default + focus state + heights حسب platform
Buttons:
Primary: accent.primary + whileTap scale 0.97 + radius per platform
Ghost: transparent + hover (desktop) + whileTap 0.95
Icon button: min 44×44 + active background interactive.selected

Separators:
1px border.subtle + margins tokens

4) Layout Principles:
Desktop: grid toolbar/sidebar/workspace/inspector/status
Mobile: column toolbar/workspace/rail
لا sidebar على الموبايل — كله sheets
Toolbar يختفي أثناء التفاعل
Rail لا يختفي أبداً

5) Dark vs Light:
tokens لها قيمتين dark/light
switch عبر CSS variables
accent ثابت
glass blur ثابت

Self-Check:
- Visual DNA؟
- springs vs durations؟
- reduced motion؟
- glass panels صح؟
- inputs/buttons صح؟
- spacing كافي؟
