# مستندات API SDK

این بخش شامل API‌های مربوط به استفاده از SDK آرایش مجازی می‌باشد.

## پایه URL

```
/api/v1/sdk
```

## API های SDK

### اعتبارسنجی توکن SDK

بررسی اعتبار توکن SDK و دریافت ویژگی‌های مجاز.

**URL:** `POST /sdk/validate`

**دسترسی:** عمومی

**پارامترهای ارسالی:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**پاسخ موفق:**

```json
{
  "isValid": true,
  "isPremium": true,
  "projectType": "professional",
  "features": ["lips", "eyeshadow", "eyepencil", "eyelashes", "blush", "eyeliner"],
  "patterns": {
    "lips": ["normal", "matte", "glossy", "glitter"],
    "eyeshadow": ["normal", "shimmer"],
    "eyepencil": ["normal"],
    "eyelashes": ["long-lash"],
    "blush": ["normal"],
    "eyeliner": ["normal", "lashed"]
  },
  "mediaFeatures": {
    "allowedSources": ["camera", "image"],
    "allowedViews": ["single", "multi", "split"],
    "comparisonModes": ["before-after", "split"]
  }
}
```

**پاسخ ناموفق:**

```json
{
  "isValid": false,
  "message": "توکن منقضی شده است" // یا سایر پیام‌های خطا
}
```

**کدهای خطا:**
- `400`: توکن نامعتبر است
- `403`: دامنه مجاز نیست یا محدودیت درخواست به پایان رسیده است
- `404`: کاربر یا بسته یافت نشد

---

### دریافت محصولات برای SDK

دریافت لیست محصولات فعال برای استفاده در SDK.

**URL:** `GET /sdk/products`

**دسترسی:** توکن SDK

**هدر های مورد نیاز:**
- `x-sdk-token: {sdkToken}`

**پاسخ موفق:**

```json
[
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "userId": "60e1b2c3d4e5f6g7h8i9j0l",
    "name": "رژ لب قرمز",
    "description": "رژ لب با رنگ قرمز مات",
    "type": "lips",
    "code": "RED-LIP-001",
    "uid": "abcd1234",
    "thumbnail": "https://example.com/images/red-lip.jpg",
    "patterns": [
      {
        "name": "مات",
        "code": "matte",
        "imageUrl": "https://example.com/images/matte-pattern.jpg"
      },
      {
        "name": "براق",
        "code": "glossy",
        "imageUrl": "https://example.com/images/glossy-pattern.jpg"
      }
    ],
    "colors": [
      {
        "name": "قرمز",
        "hexCode": "#FF0000",
        "imageUrl": "https://example.com/images/red-color.jpg"
      },
      {
        "name": "صورتی",
        "hexCode": "#FFC0CB",
        "imageUrl": "https://example.com/images/pink-color.jpg"
      }
    ],
    "active": true,
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z"
  },
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0m",
    "userId": "60e1b2c3d4e5f6g7h8i9j0l",
    "name": "سایه چشم",
    "description": "سایه چشم با طیف رنگی متنوع",
    "type": "eyeshadow",
    "code": "EYE-SHADOW-001",
    "uid": "efgh5678",
    "thumbnail": "https://example.com/images/eyeshadow.jpg",
    "patterns": [
      {
        "name": "معمولی",
        "code": "normal",
        "imageUrl": "https://example.com/images/normal-pattern.jpg"
      },
      {
        "name": "براق",
        "code": "shimmer",
        "imageUrl": "https://example.com/images/shimmer-pattern.jpg"
      }
    ],
    "colors": [
      {
        "name": "آبی",
        "hexCode": "#0000FF",
        "imageUrl": "https://example.com/images/blue-color.jpg"
      },
      {
        "name": "سبز",
        "hexCode": "#00FF00",
        "imageUrl": "https://example.com/images/green-color.jpg"
      }
    ],
    "active": true,
    "createdAt": "2023-01-02T14:30:00.000Z",
    "updatedAt": "2023-01-02T14:30:00.000Z"
  }
  // سایر محصولات
]
```

**کدهای خطا:**
- `401`: توکن SDK نامعتبر است
- `403`: محدودیت درخواست یا دامنه مجاز نیست

---

### دریافت محصول با UID برای SDK

دریافت اطلاعات یک محصول خاص با شناسه منحصر به فرد کوتاه (UID) برای استفاده در SDK.

**URL:** `GET /sdk/products/{productUid}`

**دسترسی:** توکن SDK

**هدر های مورد نیاز:**
- `x-sdk-token: {sdkToken}`

**پارامترهای URL:**
- `productUid`: شناسه منحصر به فرد کوتاه محصول

**پاسخ موفق:**

```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0k",
  "userId": "60e1b2c3d4e5f6g7h8i9j0l",
  "name": "رژ لب قرمز",
  "description": "رژ لب با رنگ قرمز مات",
  "type": "lips",
  "code": "RED-LIP-001",
  "uid": "abcd1234",
  "thumbnail": "https://example.com/images/red-lip.jpg",
  "patterns": [
    {
      "name": "مات",
      "code": "matte",
      "imageUrl": "https://example.com/images/matte-pattern.jpg"
    },
    {
      "name": "براق",
      "code": "glossy",
      "imageUrl": "https://example.com/images/glossy-pattern.jpg"
    }
  ],
  "colors": [
    {
      "name": "قرمز",
      "hexCode": "#FF0000",
      "imageUrl": "https://example.com/images/red-color.jpg"
    },
    {
      "name": "صورتی",
      "hexCode": "#FFC0CB",
      "imageUrl": "https://example.com/images/pink-color.jpg"
    }
  ],
  "active": true,
  "createdAt": "2023-01-01T12:00:00.000Z",
  "updatedAt": "2023-01-01T12:00:00.000Z"
}
```

**کدهای خطا:**
- `401`: توکن SDK نامعتبر است
- `403`: محدودیت درخواست یا دامنه مجاز نیست
- `404`: محصول یافت نشد

---

### درخواست اعمال آرایش

ثبت درخواست اعمال آرایش توسط کاربر (برای آمار و تحلیل).

**URL:** `POST /sdk/apply`

**دسترسی:** توکن SDK

**هدر های مورد نیاز:**
- `x-sdk-token: {sdkToken}`

**پارامترهای ارسالی:**

```json
{
  "productUid": "abcd1234", // اختیاری
  "makeupData": {
    "type": "lips",
    "pattern": "matte",
    "color": "#FF0000",
    "intensity": 0.8,
    "position": {
      "x": 120,
      "y": 150
    },
    "customData": {
      "key1": "value1",
      "key2": "value2"
    }
  }
}
```

**پاسخ موفق:**

```json
{
  "success": true,
  "message": "درخواست اعمال آرایش با موفقیت ثبت شد"
}
```

**کدهای خطا:**
- `401`: توکن SDK نامعتبر است
- `403`: محدودیت درخواست یا دامنه مجاز نیست
- `404`: محصول یافت نشد (اگر productUid ارسال شده باشد و نامعتبر باشد)

---

### دریافت وضعیت SDK

دریافت اطلاعات وضعیت استفاده از SDK و آمار.

**URL:** `GET /sdk/status`

**دسترسی:** توکن SDK

**هدر های مورد نیاز:**
- `x-sdk-token: {sdkToken}`

**پاسخ موفق:**

```json
{
  "packageId": "60a1b2c3d4e5f6g7h8i9j0m",
  "planId": "60a1b2c3d4e5f6g7h8i9j0n",
  "startDate": "2023-01-01T12:00:00.000Z",
  "endDate": "2023-04-01T12:00:00.000Z",
  "status": "active",
  "features": ["lips", "eyeshadow", "eyepencil", "eyelashes", "blush", "eyeliner"],
  "isPremium": true,
  "projectType": "professional",
  "requestLimit": {
    "monthly": 3000,
    "remaining": 2750
  },
  "usageStats": {
    "total": 250,
    "validate": 50,
    "apply": 150,
    "check": 40,
    "other": 10
  }
}
```

**کدهای خطا:**
- `401`: توکن SDK نامعتبر است
- `403`: محدودیت درخواست یا دامنه مجاز نیست