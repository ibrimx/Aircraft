Aircraft — RBAC Guide
يُقرأ عند التعامل مع permissions في أي مكان — UI أو API

1) Roles:
admin / editor / viewer / custom

2) Permission Dimensions:
Resources: studio_file, builder_page, cms_source, cms_collection, brand_kit, asset, publish_target
Actions: create, read, update, delete, publish, export, share, invite
System: manage_users, manage_invites, manage_workspace, view_audit_log

3) Default Matrix:
Admin: كل شيء
Editor: assigned فقط (publish حسب إذن صريح)
Viewer: read فقط assigned

4) Golden Rule:
DENY BY DEFAULT
كل ما لم يُصرّح به صراحةً = مرفوض

5) Enforcement — Two Layers:
UI Layer:
- hide/show عبر usePermissions()
- RouteGuard
API Layer:
- assert في كل route عبر apiGuard
قاعدة: إخفاء الزر غير كافي — API لازم يرفض

6) How to Check:
UI: can(action, resource, id)
API: apiGuard.assert(...)
Filter: permissionResolver.filter(...)

7) Mode-Specific:
Studio: viewer read-only
Builder: viewer preview فقط
CMS: viewer يرى البيانات المربوطة فقط

8) Route Protection:
- /studio/:fileId يحتاج read
- /studio/:fileId/edit يحتاج update
- /builder/:pageId يحتاج read
- /builder/:pageId/edit يحتاج update
- /cms يحتاج read
- /settings/members يحتاج manage_users
- /settings/invites يحتاج manage_invites

Self-Check:
- deny by default؟
- checks في UI؟
- checks في API؟
- filter صح؟
- viewer read-only مش شاشة فاضية؟
- منع admin عبر invite؟
