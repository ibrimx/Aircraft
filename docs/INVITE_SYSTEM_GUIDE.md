Aircraft — Invite System Guide
يُقرأ عند العمل على: auth-engine, auth UI components, auth API routes

1) The Flow:
[1] Admin POST /api/auth/invite
body: { email?, role, permissions, expiresInDays }
response: { inviteUrl, inviteId }

[2] System يرسل email بالرابط:
https://aircraft.app/join?token=<signed-jwt>

[3] Invitee GET /join?token=...
- valid: صفحة التسجيل
- expired/revoked: Access Denied

[4] Invitee POST /api/auth/accept
body: { token, name, password }
response: { userId, sessionToken, role, permissions }

[5] System:
- ينشئ User + role + permissions
- يبطل token (single-use)
- يعيد session

2) Invite Token Fields:
inviteId UUID (branded)
workspaceId
createdBy (Admin userId)
email string|null (null=open invite)
role
permissions
expiresAt (default 7 days)
status pending|accepted|expired|revoked

3) Rules:
- لا public sign-up
- token single-use
- token stored hashed (DB) والـ URL فقط plain
- expiry default 7 days
- admin فقط ينشئ invites
- admin لا يعيّن admin إلا workspace_owner
- rate limit: 5/min على accept و login
- email لغة المستخدم ar/en حسب locale

4) Security:
افعل:
- hash قبل التخزين
- تحقق expiry دائمًا
- اقرأ permissions من DB مش JWT فقط
- audit log لكل invite event
- rate limit لكل auth endpoint
لا تفعل:
- لا تخزن plain token
- لا reusable invite
- لا self-registration
- لا permissions كاملة داخل JWT
- لا admin role عبر invite عادي

5) Invite Manager UI:
Admin يرى:
- قائمة invites حسب status
- create
- revoke pending
- تعديل صلاحيات مستخدم مقبول
- إزالة مستخدم
على الموبايل: كله داخل Bottom Sheets (full/half)

Self-Check:
- no public sign-up؟
- token hashed؟
- single-use؟
- expiry checks؟
- perms من DB؟
- rate limit؟
- منع تعيين admin؟
