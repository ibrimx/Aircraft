Brimair — Design System Guide
هذا الملف هو المرجع الوحيد لكل قيمة بصرية.
لا يوجد لون أو مسافة أو ظل خارج هذا النظام.

1) القاعدة الذهبية:
كل قيمة بصرية = token
لا hardcoded values أبداً

2) Lookup Table:
Surfaces: root/primary/sheet/rail/actionSheet/toolbar/canvas...
Shadows: float/sheet/dragElevated/rail/toolbar...
Blur: glass/sheet/rail/actionSheet...
Borders: subtle/default/focus/error/strong
Radius: sm/md/lg/sheet/xl/toast
Heights: input/list item/button/toolbar/rail
Animations: spring.smooth/sheet/snappy/tap + durations للـ ambient
Typography: desktop vs mobile + حد أدنى (mobile 14px)
Z-Index: tokens (toolbar/sidebar/.../tooltip/command palette)

3) Absolute Prohibitions:
ممنوع:
- hex/rgb مباشر
- px spacing مباشر (إلا 1px borders)
- shadow/blur مكتوب يدوي
- font-size بدون token
- z-index رقم
- radius بدون token
- animation بدون motion token أو duration token

Self-Check:
- colors/spacings/shadows/blur/radius/z/font/animation كلها tokens؟
- استخدمت lookup الصحيح desktop vs mobile؟
