Aircraft — Mobile Gesture Guide
يُقرأ عند العمل على: mobile-runtime, gesture-recognizer, canvas interactions

1) Touch Event Pipeline:
Touch Start → Hit Test (Handle / Element / Empty / UI)
ثم انتظار: 8px حركة أو 300ms
- moved > 8px → Drag/Pan/Selection
- no move + <300ms → Tap
- no move + >300ms → Long Press
- finger2 added → Pinch/Two-finger Pan

2) Gesture State Machine:
IDLE → (tap/select/deselect/double tap/drag/long press/pinch/two-finger pan/selection box...)
DRAGGING/RESIZING ينتهي → commit patch واحد → IDLE
أي finger2 أثناء drag/resize → cancel → ZOOMING (بدون patch)
ZOOMING/PANNING يعود IDLE
TEXT_EDITING tap outside → commit → IDLE
CONTEXT_MENU action/cancel → IDLE

3) Priority Table:
1 Pinch zoom (يلغي الكل)
2 Two-finger pan
3 Handle drag (resize/rotate)
4 Element drag
5 Selection box
6 Long press (يلغى بحركة > 4px)

قاعدة:
عند بدء gesture أعلى أولوية:
- الأدنى يُلغى فوراً
- العنصر يرجع spring.snappy
- لا patch للـ gesture الملغي

4) Thresholds:
drag threshold = 8px
cancel long press = 4px
long press = 300ms
fast swipe velocity = 500px/s

5) Patch Emission:
أثناء gesture:
- لا patches
- transient preview فقط (Fabric)
- checkpoint كل 500ms
عند النهاية:
- Patch واحد compact بالنتيجة النهائية
- history عملية واحدة
- undo يتراجع عن الكل

6) Edge Cases:
Drag ثم finger2 → cancel drag → element يعود → pinch يبدأ → لا patch
Long press vs drag حسب 4px و 8px
Sheet scroll-to-drag handoff بدون قفزة

Self-Check:
- priorities؟
- no patches أثناء gesture؟
- patch واحد عند النهاية؟
- rollback عند الإلغاء؟
- thresholds؟
