Aircraft — Mobile Performance Guide
يُقرأ عند العمل على: mobile-runtime, fabric-adapter, أي canvas interaction

1) Performance Budgets:
Canvas FPS أثناء gesture: min 30 هدف 60
Sheet animation: 60
Touch-to-visual latency: <32ms هدف <16ms
Sheet snap: <400ms هدف <300ms
Tool switch: <100ms هدف <50ms
First render: <2s هدف <1s
Patch commit: <50ms هدف <16ms

2) Memory Budgets:
Canvas objects max: 200
Total memory max: 256MB
Texture max: 128MB
Target memory: 192MB
Target texture: 96MB

3) Memory Guard Thresholds:
200MB warning: تقليل textures
240MB aggressive: إخفاء off-screen + تعطيل previews
280MB critical: toast + تقليل quality
300MB emergency: autosave + recovery + منع إضافة عناصر

4) Rules:
افعل:
- rAF للـ canvas updates
- will-change: transform
- passive touch listeners
- إزالة listeners عند unmount
لا تفعل:
- forced reflow أثناء animation
- synchronous layout reads أثناء gesture
- DOM elements كثيرة (virtualization >50)
- setTimeout للـ animations

5) Canvas Optimization:
objects >100: caching + dirty regions
>150: hide خارج viewport + lower resolution
>200: منع إضافة + warning

Self-Check:
- no sync reads؟
- passive listeners؟
- rAF؟
- will-change؟
- memory guard؟
- warning عند >200؟
