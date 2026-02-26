Brimair — CMS Adapter Guide
يُقرأ عند كتابة أي adapter في packages/cms-engine/adapters/

1) Adapter Interface:
connect(credentials)
testConnection()
listCollections()
getSchema(collectionId)
query(collectionId, query)
getRecord(collectionId, id)
subscribe(collectionId, cb)
getCapabilities()

2) Record Normalization:
Record:
- id: RecordId (branded)
- collectionId: CollectionId
- externalId: string
- fields: Map<fieldName, FieldValue>
- createdAt/updatedAt timestamps
- _raw: unknown (debug فقط)

3) Error Handling:
Connection failed → ConnectorError
Auth expired → AuthExpiredError
Rate limited → RateLimitError
Schema changed → SchemaChangedError
Record not found → return null
Network error → NetworkError (يستخدم cache)
قاعدة: أخطاء CMS لا تعطل المحرر أبداً

4) Adapter Rules:
- adapter في ملف منفصل
- لا cross-adapter imports
- لا cache logic
- لا UI/React
- يعتمد فقط على shared-types
- query يدعم filter/sort/limit/offset
- credentials لا تُخزن plain في memory
- test fixtures في testing/fixtures/cms-fixtures/

5) Testing:
- mock data file
- connect يعمل
- listCollections
- query returns normalized records
- schema inference
- error handling

Self-Check:
- كل methods؟
- normalization؟
- error types؟
- no React؟
- credentials safe؟
- fixtures موجودة؟
