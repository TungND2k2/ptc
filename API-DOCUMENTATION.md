# eKYC API Documentation

## Giới thiệu
API Documentation cho hệ thống eKYC (Electronic Know Your Customer) - Xác thực danh tính điện tử.

**Base URL:** `https://api-dev.x-or.cloud/ekyc`

**Swagger UI:** `http://localhost:3000/api-docs`

---

## Authentication

Tất cả các API đều yêu cầu Bearer Token trong header:

```http
Authorization: Bearer <access_token>
```

### Lấy Access Token

```http
POST https://api.dev.x-or.cloud/auth/realms/xor/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

client_id=portal
&client_secret=MxdUfdN1ejBROyAdr3i5fus03TdfTpfv
&grant_type=password
&username=customer@x-or.cloud
&password=123zXc_-
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 36000,
  "refresh_expires_in": 1800,
  "token_type": "Bearer"
}
```

---

## API Workflow

### Quy trình hoàn chỉnh eKYC:

```
1. Authentication (Lấy token)
   ↓
2. Create Session (Tạo phiên xác thực)
   ↓
3. Upload Artifacts (Tải ảnh CMND/CCCD, Selfie)
   ├── Presign URL → PUT to S3 → Complete Upload
   ↓
4. Submit AI Tasks
   ├── OCR (Đọc thông tin CMND/CCCD)
   ├── Liveness (Kiểm tra người thật)
   └── Face Match (So sánh khuôn mặt)
   ↓
5. Evaluate Decision (Đánh giá tự động)
   ↓
6. Get Report (Lấy báo cáo)
```

---

## 1. Sessions API

### 1.1. Create Session (Tạo phiên)

Tạo một phiên eKYC mới để bắt đầu quy trình xác thực.

```http
POST /ekyc/sessions
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "sessionId": "ekyc_1738016400000",
  "policy": "standard_ekyc_v1",
  "datetime": "2026-01-27T10:00:00Z",
  "userId": "customer@x-or.cloud",
  "appId": "mobile-app-v1",
  "userRef": "USR-001"
}
```

**Parameters:**
- `sessionId` (string, required): Unique session identifier. Format: `ekyc_<timestamp>`
- `policy` (string, optional): Policy name. Default: `standard_ekyc_v1`
- `datetime` (string, optional): Session creation timestamp (ISO 8601)
- `userId` (string, optional): User ID (auto-populated from token)
- `appId` (string, optional): Application identifier
- `userRef` (string, optional): External user reference

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "sessionId": "ekyc_1738016400000",
  "userId": "customer@x-or.cloud",
  "policy": "standard_ekyc_v1",
  "status": "ACTIVE",
  "steps": {},
  "createdAt": "2026-01-27T10:00:00Z",
  "updatedAt": "2026-01-27T10:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request body
- `401 Unauthorized`: Missing or invalid token
- `409 Conflict`: Session ID already exists

---

### 1.2. Get Session (Lấy thông tin phiên)

Lấy thông tin chi tiết của một phiên eKYC.

```http
GET /ekyc/sessions/:id
Authorization: Bearer <token>
```

**Parameters:**
- `id` (path): Session ID hoặc MongoDB ObjectId

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "sessionId": "ekyc_1738016400000",
  "userId": "customer@x-or.cloud",
  "policy": "standard_ekyc_v1",
  "status": "COMPLETED",
  "artifacts": [
    {
      "artifactId": "art_001",
      "type": "ID_FRONT",
      "url": "https://s3.xorcloud.net/..."
    }
  ],
  "jobs": [
    {
      "jobId": "job_ocr_001",
      "type": "OCR",
      "status": "COMPLETED"
    }
  ],
  "decision": {
    "result": "APPROVED",
    "score": 0.95,
    "evaluatedAt": "2026-01-27T10:05:00Z"
  },
  "createdAt": "2026-01-27T10:00:00Z",
  "updatedAt": "2026-01-27T10:05:00Z"
}
```

---

### 1.3. List Sessions (Danh sách phiên)

Lấy danh sách các phiên eKYC với phân trang và filter.

```http
GET /ekyc/sessions?page=1&limit=20&status=ACTIVE&userId=USR-001
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number, optional): Page number. Default: 1
- `limit` (number, optional): Items per page. Default: 20
- `status` (string, optional): Filter by status (DRAFT, ACTIVE, COMPLETED, EXPIRED)
- `userId` (string, optional): Filter by user ID
- `sessionId` (string, optional): Filter by session ID

**Response (200 OK):**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "sessionId": "ekyc_1738016400000",
      "status": "ACTIVE"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

### 1.4. Log Event (Ghi log sự kiện)

Ghi log các sự kiện xảy ra trong session.

```http
POST /ekyc/sessions/:sessionId/events
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "event": "photo_captured",
  "timestamp": "2026-01-27T10:01:00Z",
  "metadata": {
    "type": "ID_FRONT",
    "device": "iPhone 14 Pro"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "eventId": "evt_001"
}
```

---

## 2. Artifacts API (Upload & Storage)

### 2.1. Presign Upload (Xin URL upload)

Lấy presigned URL để upload file trực tiếp lên S3.

```http
POST /ekyc/artifacts/presign
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "sessionId": "ekyc_1738016400000",
  "type": "ID_FRONT",
  "contentType": "image/jpeg",
  "size": 1024000
}
```

**Parameters:**
- `sessionId` (string, required): Session ID
- `type` (string, required): Artifact type
  - `ID_FRONT`: Mặt trước CMND/CCCD
  - `ID_BACK`: Mặt sau CMND/CCCD
  - `SELFIE`: Ảnh chân dung
- `contentType` (string, required): MIME type (image/jpeg, image/png)
- `size` (number, required): File size in bytes

**Response (200 OK):**
```json
{
  "uploadUrl": "https://s3.xorcloud.net/ekyc/uploads/abc123?signature=...",
  "artifactId": "art_20260127_001",
  "method": "PUT",
  "headers": {
    "Content-Type": "image/jpeg",
    "x-amz-acl": "public-read"
  },
  "expiresIn": 300
}
```

**Next Step:** Upload file to S3:
```http
PUT <uploadUrl>
Content-Type: image/jpeg
x-amz-acl: public-read

<binary file content>
```

---

### 2.2. Complete Upload (Xác nhận upload)

Xác nhận upload đã hoàn tất và verify file trên S3.

```http
POST /ekyc/artifacts/complete
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "artifactId": "art_20260127_001",
  "checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "size": 1024000,
  "metadata": {
    "filename": "id-front.jpg",
    "width": 1920,
    "height": 1080
  }
}
```

**Parameters:**
- `artifactId` (string, required): Artifact ID from presign response
- `checksum` (string, required): SHA256 checksum (can use placeholder)
- `size` (number, required): File size in bytes
- `metadata` (object, optional): Additional metadata

**Response (200 OK):**
```json
{
  "_id": "507f191e810c19729de860ea",
  "artifactId": "art_20260127_001",
  "sessionId": "ekyc_1738016400000",
  "type": "ID_FRONT",
  "status": "UPLOADED",
  "url": "https://s3.xorcloud.net/ekyc/uploads/art_20260127_001.jpg",
  "size": 1024000,
  "contentType": "image/jpeg",
  "metadata": {
    "filename": "id-front.jpg",
    "width": 1920,
    "height": 1080
  },
  "createdAt": "2026-01-27T10:02:00Z"
}
```

---

### 2.3. Get Artifact (Lấy thông tin artifact)

```http
GET /ekyc/artifacts/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "_id": "507f191e810c19729de860ea",
  "artifactId": "art_20260127_001",
  "sessionId": "ekyc_1738016400000",
  "type": "ID_FRONT",
  "status": "UPLOADED",
  "url": "https://s3.xorcloud.net/ekyc/uploads/art_20260127_001.jpg",
  "size": 1024000,
  "contentType": "image/jpeg"
}
```

---

## 3. Jobs API (AI Processing Tasks)

### 3.1. Submit OCR Task (Nhận dạng thông tin CMND/CCCD)

Extract thông tin từ ảnh CMND/CCCD (số CMND, tên, ngày sinh, địa chỉ, v.v.)

```http
POST /ekyc/jobs/tasks/OCR
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "sessionId": "ekyc_1738016400000",
  "artifactId": "art_20260127_001",
  "taskType": "ID_OCR",
  "frontArtifact": "art_20260127_001",
  "backArtifact": "art_20260127_002",
  "docType": "CCCD"
}
```

**Parameters:**
- `sessionId` (string, required): Session ID
- `artifactId` (string, optional): Main artifact ID
- `frontArtifact` (string, optional): Front side artifact ID
- `backArtifact` (string, optional): Back side artifact ID
- `taskType` (string, optional): Task type (ID_OCR, PASSPORT_OCR)
- `docType` (string, optional): Document type (CCCD, CMND, PASSPORT)

**Response (200 OK):**
```json
{
  "jobId": "job_ocr_20260127_001",
  "taskId": "task_ocr_001",
  "status": "QUEUED",
  "estimatedTime": 5,
  "createdAt": "2026-01-27T10:03:00Z"
}
```

---

### 3.2. Submit Liveness Task (Kiểm tra người thật)

Kiểm tra ảnh selfie có phải là người thật hay không (chống fake, video, ảnh in).

```http
POST /ekyc/jobs/tasks/LIVENESS
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "sessionId": "ekyc_1738016400000",
  "artifactId": "art_20260127_003",
  "taskType": "LIVENESS",
  "selfieArtifact": "art_20260127_003",
  "method": "passive"
}
```

**Parameters:**
- `sessionId` (string, required): Session ID
- `artifactId` (string, required): Selfie artifact ID
- `selfieArtifact` (string, optional): Same as artifactId
- `taskType` (string, optional): LIVENESS
- `method` (string, optional): passive or active

**Response (200 OK):**
```json
{
  "jobId": "job_liveness_20260127_001",
  "taskId": "task_liveness_001",
  "status": "QUEUED",
  "estimatedTime": 3,
  "createdAt": "2026-01-27T10:03:30Z"
}
```

---

### 3.3. Submit Face Match Task (So sánh khuôn mặt)

So sánh khuôn mặt giữa ảnh selfie và ảnh trên CMND/CCCD.

```http
POST /ekyc/jobs/tasks/FACE_MATCH
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "sessionId": "ekyc_1738016400000",
  "selfieArtifactId": "art_20260127_003",
  "idArtifactId": "art_20260127_001"
}
```

**Parameters:**
- `sessionId` (string, required): Session ID
- `selfieArtifactId` (string, required): Selfie artifact ID
- `idArtifactId` (string, required): ID photo artifact ID
- `idPhotoArtifact` (string, optional): Alternative parameter name

**Response (200 OK):**
```json
{
  "jobId": "job_facematch_20260127_001",
  "taskId": "task_facematch_001",
  "status": "QUEUED",
  "estimatedTime": 4,
  "createdAt": "2026-01-27T10:04:00Z"
}
```

---

### 3.4. Get Task Result (Lấy kết quả task)

```http
GET /ekyc/jobs/tasks/:taskId
Authorization: Bearer <token>
```

**Response for OCR (200 OK):**
```json
{
  "taskId": "task_ocr_001",
  "status": "COMPLETED",
  "result": {
    "id_front": {
      "artifactId": "art_20260127_001",
      "parsed_data": {
        "id_number": "001234567890",
        "name": "NGUYEN VAN A",
        "date_of_birth": "01/01/1990",
        "sex": "Nam",
        "nationality": "Việt Nam",
        "place_of_origin": "Hà Nội",
        "place_of_residence": "123 Đường ABC, Quận 1, TP.HCM",
        "issue_date": "01/01/2020",
        "expiry_date": "01/01/2030",
        "card_type": "CCCD"
      }
    },
    "id_back": {
      "artifactId": "art_20260127_002",
      "parsed_data": {
        "features": "Nốt ruồi má phải",
        "issue_date": "01/01/2020"
      }
    }
  },
  "vendor": "VietOCR",
  "processedAt": "2026-01-27T10:03:05Z"
}
```

**Response for Liveness (200 OK):**
```json
{
  "taskId": "task_liveness_001",
  "status": "COMPLETED",
  "result": {
    "is_live": true,
    "liveness_score": 0.96,
    "confidence": "HIGH",
    "quality_metrics": {
      "brightness": 0.75,
      "sharpness": 0.88,
      "face_detected": true
    }
  },
  "vendor": "FaceCheck",
  "processedAt": "2026-01-27T10:03:35Z"
}
```

**Response for Face Match (200 OK):**
```json
{
  "taskId": "task_facematch_001",
  "status": "COMPLETED",
  "result": {
    "verified": true,
    "cosine_similarity": 0.92,
    "distance": 0.08,
    "threshold": 0.75,
    "match_percentage": 92.0
  },
  "vendor": "FaceRecognition",
  "processedAt": "2026-01-27T10:04:05Z"
}
```

---

## 4. Job Results API

### 4.1. Get Job Results by Session

Lấy tất cả kết quả xử lý của một session.

```http
GET /ekyc/job-results?sessionId=ekyc_1738016400000
Authorization: Bearer <token>
```

**Query Parameters:**
- `sessionId` (string, required): Session ID

**Response (200 OK):**
```json
{
  "data": [
    {
      "_id": "507f191e810c19729de860ea",
      "sessionId": "ekyc_1738016400000",
      "pattern": "OCR",
      "status": "COMPLETED",
      "score": 0.95,
      "vendor": "VietOCR",
      "rawResult": {
        "data": {
          "id_front": {
            "parsed_data": {
              "id_number": "001234567890",
              "name": "NGUYEN VAN A",
              "date_of_birth": "01/01/1990"
            }
          }
        }
      },
      "normalizedResult": {},
      "createdAt": "2026-01-27T10:03:05Z"
    },
    {
      "_id": "507f191e810c19729de860eb",
      "sessionId": "ekyc_1738016400000",
      "pattern": "LIVENESS",
      "status": "COMPLETED",
      "score": 0.96,
      "vendor": "FaceCheck",
      "rawResult": {
        "data": {
          "is_live": true,
          "liveness_score": 0.96
        }
      },
      "createdAt": "2026-01-27T10:03:35Z"
    },
    {
      "_id": "507f191e810c19729de860ec",
      "sessionId": "ekyc_1738016400000",
      "pattern": "FACE_MATCH",
      "status": "COMPLETED",
      "score": 0.92,
      "vendor": "FaceRecognition",
      "rawResult": {
        "data": {
          "verified": true,
          "cosine_similarity": 0.92
        }
      },
      "createdAt": "2026-01-27T10:04:05Z"
    }
  ],
  "pagination": {
    "total": 3,
    "page": 1,
    "limit": 20
  }
}
```

---

## 5. Decisions API

### 5.1. Evaluate Decision (Đánh giá tự động)

Tự động đánh giá session dựa trên kết quả OCR, Liveness, Face Match.

```http
POST /ekyc/decisions/evaluate/:sessionId
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{}
```

**Response (200 OK):**
```json
{
  "_id": "507f191e810c19729de860ed",
  "sessionId": "ekyc_1738016400000",
  "decision": "APPROVED",
  "confidence": 0.94,
  "reasons": [
    "OCR verification passed",
    "Liveness check passed",
    "Face match score: 92%"
  ],
  "checks": {
    "ocr": {
      "status": "PASS",
      "score": 0.95
    },
    "liveness": {
      "status": "PASS",
      "score": 0.96
    },
    "faceMatch": {
      "status": "PASS",
      "score": 0.92
    }
  },
  "evaluatedAt": "2026-01-27T10:05:00Z"
}
```

**Decision Values:**
- `APPROVED`: Phê duyệt (tất cả checks pass)
- `REJECTED`: Từ chối (có ít nhất 1 check fail)
- `NEED_REVIEW`: Cần duyệt thủ công (score biên)

---

### 5.2. Override Decision (Ghi đè quyết định)

Admin ghi đè quyết định tự động.

```http
POST /ekyc/decisions/override/:sessionId
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "decision": "APPROVED",
  "reviewedBy": "admin@x-or.cloud",
  "reviewNote": "Approved after manual verification",
  "overrideReason": "OCR failed but manual check confirmed"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f191e810c19729de860ed",
  "sessionId": "ekyc_1738016400000",
  "decision": "APPROVED",
  "autoDecision": "REJECTED",
  "manualDecision": "APPROVED",
  "reviewedBy": "admin@x-or.cloud",
  "reviewNote": "Approved after manual verification",
  "overriddenAt": "2026-01-27T10:10:00Z"
}
```

---

## 6. Reviews API (Manual Review)

### 6.1. Create Review

```http
POST /ekyc/reviews
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "sessionId": "ekyc_1738016400000",
  "reviewerId": "reviewer_001",
  "status": "PENDING",
  "priority": "HIGH"
}
```

---

## 7. Audit Events API

### 7.1. Get Audit Events

```http
GET /ekyc/audit-events?sessionId=ekyc_1738016400000
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "sessionId": "ekyc_1738016400000",
      "eventType": "session.created",
      "actorType": "user",
      "actorRef": "customer@x-or.cloud",
      "timestamp": "2026-01-27T10:00:00Z"
    },
    {
      "sessionId": "ekyc_1738016400000",
      "eventType": "artifact.uploaded",
      "payload": {
        "artifactId": "art_20260127_001",
        "type": "ID_FRONT"
      },
      "timestamp": "2026-01-27T10:02:00Z"
    }
  ]
}
```

---

## Error Codes

| Status Code | Meaning | Example |
|-------------|---------|---------|
| 400 | Bad Request | Invalid request body, missing required fields |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Session/Artifact/Job not found |
| 409 | Conflict | Session ID already exists |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Internal Server Error | Server error |

**Error Response Format:**
```json
{
  "statusCode": 400,
  "message": "Invalid sessionId format",
  "error": "Bad Request",
  "timestamp": "2026-01-27T10:00:00Z",
  "path": "/ekyc/sessions"
}
```

---

## Testing với Frontend

Mở file `frontend/index.html` trong browser để test toàn bộ workflow:

1. **Auto Login**: Click "Auto Login with Defaults" → Nhận token
2. **Create Session**: Click "Create Session" → Nhận sessionId
3. **Upload ID Front**: Chọn ảnh → Click "Upload ID Front"
4. **Upload ID Back**: Chọn ảnh → Click "Upload ID Back"
5. **Upload Selfie**: Chọn ảnh → Click "Upload Selfie"
6. **Submit OCR**: Click "Submit OCR" → Đợi xử lý
7. **Submit Liveness**: Click "Submit Liveness" → Đợi xử lý
8. **Submit Face Match**: Click "Submit Face Match" → Đợi xử lý
9. **Evaluate**: Click "Evaluate Decision" → Xem kết quả
10. **View Report**: Click "Get Report" hoặc "Get Job Results"

---

## Rate Limits

- **Authentication**: 10 requests/minute
- **Session API**: 60 requests/minute
- **Upload API**: 30 requests/minute
- **Job API**: 100 requests/minute

---

## Webhooks (Coming Soon)

Nhận thông báo realtime khi jobs hoàn thành:

```http
POST <your_webhook_url>
Content-Type: application/json
X-Webhook-Signature: sha256=...

{
  "event": "job.completed",
  "sessionId": "ekyc_1738016400000",
  "jobId": "job_ocr_001",
  "status": "COMPLETED",
  "result": {...}
}
```

---

## Support

- **Email**: support@x-or.cloud
- **Documentation**: https://docs.x-or.cloud/ekyc
- **Status Page**: https://status.x-or.cloud

---

## Version History

- **v1.0** (2026-01-27): Initial release
  - Sessions, Artifacts, Jobs, Decisions, Reviews
  - OCR, Liveness, Face Match
  - Manual review workflow

---

## SDKs & Examples

### JavaScript/TypeScript

```javascript
const client = new EKYCClient({
  baseUrl: 'https://api-dev.x-or.cloud/ekyc',
  token: 'your_access_token'
});

// Create session
const session = await client.sessions.create({
  sessionId: `ekyc_${Date.now()}`,
  policy: 'standard_ekyc_v1'
});

// Upload artifact
const presign = await client.artifacts.presign({
  sessionId: session.sessionId,
  type: 'ID_FRONT',
  contentType: 'image/jpeg',
  size: file.size
});

await fetch(presign.uploadUrl, {
  method: 'PUT',
  body: file,
  headers: presign.headers
});

await client.artifacts.complete({
  artifactId: presign.artifactId,
  checksum: 'sha256...',
  size: file.size
});

// Submit OCR
const ocrJob = await client.jobs.createTask('OCR', {
  sessionId: session.sessionId,
  artifactId: presign.artifactId
});

// Get results
const results = await client.jobResults.list({
  sessionId: session.sessionId
});
```

---

## Best Practices

1. **Session ID**: Sử dụng format `ekyc_<timestamp>_<random>` để tránh trùng
2. **Error Handling**: Luôn xử lý các HTTP error codes
3. **Retry Logic**: Implement exponential backoff cho network errors
4. **File Size**: Giới hạn file upload < 10MB
5. **Image Quality**: Tối thiểu 1280x720 cho ảnh ID, 640x480 cho selfie
6. **Token Expiry**: Refresh token trước khi hết hạn
7. **Logging**: Log tất cả API calls để debug

---

**Generated**: 2026-01-27  
**Version**: 1.0  
**Format**: Markdown
