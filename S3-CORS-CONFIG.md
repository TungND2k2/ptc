# Hướng dẫn Fix CORS Error cho S3 Upload

## Vấn đề
```
Access to fetch at 'https://s3.xorcloud.net/...' has been blocked by CORS policy
```

## Nguyên nhân
S3 bucket chưa được cấu hình CORS policy để cho phép browser upload trực tiếp.

## Giải pháp

### Cách 1: Chạy script tự động (Khuyến nghị)

```bash
# Run script to configure CORS
npm run setup-cors
```

Hoặc:
```bash
npx ts-node scripts/setup-s3-cors.ts
```

### Cách 2: Config thủ công qua AWS CLI

```bash
aws s3api put-bucket-cors \
  --bucket ekyc \
  --endpoint-url https://s3.xorcloud.net \
  --cors-configuration file://cors-config.json
```

**File cors-config.json:**
```json
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag", "x-amz-request-id"],
      "MaxAgeSeconds": 3600
    }
  ]
}
```

### Cách 3: Config qua S3 Console/Management UI

1. Đăng nhập vào XOR Cloud S3 Console
2. Chọn bucket `ekyc`
3. Vào tab **Permissions** → **CORS configuration**
4. Paste cấu hình sau:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>POST</AllowedMethod>
    <AllowedMethod>DELETE</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <ExposeHeader>ETag</ExposeHeader>
    <ExposeHeader>x-amz-request-id</ExposeHeader>
    <MaxAgeSeconds>3600</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>
```

## Lưu ý Production

Trong môi trường production, thay `AllowedOrigins: ["*"]` bằng domain cụ thể:

```json
"AllowedOrigins": [
  "https://your-domain.com",
  "https://www.your-domain.com"
]
```

## Kiểm tra CORS đã được config chưa

```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: PUT" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://s3.xorcloud.net/ekyc
```

Response phải có header:
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`
