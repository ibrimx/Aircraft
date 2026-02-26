Brimair — Mobile UI Contract
كل component يظهر على الموبايل يجب أن يلتزم بهذا العقد.
لا استثناءات.

1) Touch Targets:
- كل زر ≥ 44×44px
- كل عنصر قائمة ≥ 52px ارتفاع
- كل input ≥ 40px ارتفاع
- كل slider ≥ 44px ارتفاع

2) Bottom Sheet:
- كل panel على الموبايل = Bottom Sheet
- لا floating panels
- لا popovers (إلا tooltips)
- لا modals عائمة — كلها sheets
التحويلات:
Sidebar → Bottom Sheet (half)
Inspector → Bottom Sheet (half)
Color Picker → Bottom Sheet (full)
Font Picker → Bottom Sheet (full)
Dialog → Bottom Sheet (full)
Context menu → Action Sheet
Dropdown → Action Sheet

3) Safe Areas:
أي component يلمس حافة الشاشة لازم يحترم:
top/bottom/left/right via env(safe-area-inset-*)
لا تستخدم 100vh على iOS
استخدم 100dvh

4) No Hover:
لا hover على touch devices
hover state → tap state
hover tooltip → لا يظهر على الموبايل
hover dropdown → tap يفتح sheet
التحقق: (hover: none) أو hook useTouchDevice()

5) Keyboard:
الحقل النشط يبقى مرئي دائماً
استخدم Visual Viewport API
لا تستخدم window.innerHeight
Bottom Rail يرتفع فوق الكيبورد أو يختفي مؤقتاً

6) Typography:
لا نص تفاعلي أقل من 14px
body.primary = 16px
caption = 14px
استثناء واحد: toolLabel في Bottom Rail = 10px

7) Toolbar Auto-Hide:
يتفاعل مع Canvas → بعد 200ms Toolbar يختفي
يتوقف → بعد 1500ms Toolbar يعود
tap على فراغ → Toolbar يظهر فوراً
Bottom Rail لا يختفي أبداً

8) Gestures:
Tap select
Double tap text edit
Long press 300ms context menu
Pinch zoom
Two-finger pan
One-finger drag move/resize/selection box
Swipe down top: command palette
Shake: undo

9) Haptics:
Tool switch light
Select light
Snap light
Drag start medium
Long press medium
Sheet appears medium
Delete heavy
Undo/redo success
Error error

10) Orientation:
Portrait: rail bottom
Landscape: rail side (56px)
Sheet → Side Sheet
Transition spring.smooth

Self-Check:
- touch targets؟
- no hover؟
- safe areas؟
- 100dvh؟
- no <14px؟
- keyboard safe؟
- haptics؟
