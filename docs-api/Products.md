# مستندات API محصولات (Products)

این بخش شامل API‌های مربوط به مدیریت محصولات می‌باشد.

## پایه URL

```
/api/v1/products
```

## API های محصولات

### دریافت محصولات کاربر جاری

دریافت لیست محصولات کاربر وارد شده.

**URL:** `GET /products/me`

**دسترسی:** کاربر وارد شده

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای query (اختیاری):**
- `active`: فیلتر بر اساس وضعیت فعال بودن (true یا false)

**پاسخ موفق:**

```json
[
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "userId": "60e1b2c3d4e5f6g7h8i9j0k",
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
    "_id": "60a1b2c3d4e5f6g7h8i9j0l",
    "userId": "60e1b2c3d4e5f6g7h8i9j0k",
    "name": "سایه چشم",
    "description": "سایه چشم با طیف رنگی متنوع",
    "type": "eyeshadow",
    "code": "EYE-SHADOW-001",
    "uid": "efgh5678",
    "thumbnail": "https://example.com/images/eyeshadow.jpg",
    "patterns": [],
    "colors": [],
    "active": true,
    "createdAt": "2023-01-02T14:30:00.000Z",
    "updatedAt": "2023-01-02T14:30:00.000Z"
  }
  // سایر محصولات
]
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز

---

### ایجاد محصول جدید

ایجاد یک محصول جدید توسط کاربر.

**URL:** `POST /products`

**دسترسی:** کاربر وارد شده

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای ارسالی:**

```json
{
  "name": "رژ لب جدید",
  "description": "رژ لب با رنگ‌های متنوع",
  "type": "lips",
  "code": "NEW-LIP-001",
  "thumbnail": "https://example.com/images/new-lip.jpg",
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
  "active": true
}
```

**پاسخ موفق:**

```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0m",
  "userId": "60e1b2c3d4e5f6g7h8i9j0k",
  "name": "رژ لب جدید",
  "description": "رژ لب با رنگ‌های متنوع",
  "type": "lips",
  "code": "NEW-LIP-001",
  "uid": "ijkl9012",
  "thumbnail": "https://example.com/images/new-lip.jpg",
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
  "createdAt": "2023-01-10T09:30:00.000Z",
  "updatedAt": "2023-01-10T09:30:00.000Z"
}
```

**کدهای خطا:**
- `400`: اطلاعات نامعتبر (مثلاً کد محصول تکراری)
- `401`: دسترسی غیرمجاز

---

### دریافت محصول با شناسه

دریافت اطلاعات یک محصول خاص با شناسه.

**URL:** `GET /products/{productId}`

**دسترسی:** کاربر وارد شده (مالک محصول یا ادمین)

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `productId`: شناسه محصول مورد نظر

**پاسخ موفق:**

```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0k",
  "userId": "60e1b2c3d4e5f6g7h8i9j0k",
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
- `401`: دسترسی غیرمجاز
- `403`: شما به این محصول دسترسی ندارید
- `404`: محصول یافت نشد

---

### دریافت محصول با UID

دریافت اطلاعات یک محصول خاص با شناسه منحصر به فرد کوتاه (UID).

**URL:** `GET /products/uid/{productUid}`

**دسترسی:** کاربر وارد شده (مالک محصول)

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `productUid`: شناسه منحصر به فرد کوتاه محصول

**پاسخ موفق:**

```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0k",
  "userId": "60e1b2c3d4e5f6g7h8i9j0k",
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
- `401`: دسترسی غیرمجاز
- `404`: محصول یافت نشد

---

### به‌روزرسانی محصول

به‌روزرسانی اطلاعات یک محصول خاص.

**URL:** `PUT /products/{productId}`

**دسترسی:** کاربر وارد شده (مالک محصول یا ادمین)

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `productId`: شناسه محصول مورد نظر

**پارامترهای ارسالی:**

```json
{
  "name": "رژ لب قرمز به‌روزرسانی شده",
  "description": "رژ لب با رنگ قرمز مات - نسخه جدید",
  "patterns": [
    {
      "name": "مات",
      "code": "matte",
      "imageUrl": "https://example.com/images/matte-pattern-new.jpg"
    },
    {
      "name": "براق",
      "code": "glossy",
      "imageUrl": "https://example.com/images/glossy-pattern-new.jpg"
    },
    {
      "name": "اکلیلی",
      "code": "glitter",
      "imageUrl": "https://example.com/images/glitter-pattern.jpg"
    }
  ],
  "active": false
  // سایر فیلدها را می‌توانید به‌روزرسانی کنید
}
```

**پاسخ موفق:**

```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0k",
  "userId": "60e1b2c3d4e5f6g7h8i9j0k",
  "name": "رژ لب قرمز به‌روزرسانی شده",
  "description": "رژ لب با رنگ قرمز مات - نسخه جدید",
  "type": "lips",
  "code": "RED-LIP-001",
  "uid": "abcd1234",
  "thumbnail": "https://example.com/images/red-lip.jpg",
  "patterns": [
    {
      "name": "مات",
      "code": "matte",
      "imageUrl": "https://example.com/images/matte-pattern-new.jpg"
    },
    {
      "name": "براق",
      "code": "glossy",
      "imageUrl": "https://example.com/images/glossy-pattern-new.jpg"
    },
    {
      "name": "اکلیلی",
      "code": "glitter",
      "imageUrl": "https://example.com/images/glitter-pattern.jpg"
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
  "active": false,
  "createdAt": "2023-01-01T12:00:00.000Z",
  "updatedAt": "2023-01-15T10:45:00.000Z"
}
```

**کدهای خطا:**
- `400`: اطلاعات نامعتبر
- `401`: دسترسی غیرمجاز
- `403`: شما به این محصول دسترسی ندارید
- `404`: محصول یافت نشد

---

### حذف محصول

حذف یک محصول خاص.

**URL:** `DELETE /products/{productId}`

**دسترسی:** کاربر وارد شده (مالک محصول یا ادمین)

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `productId`: شناسه محصول مورد نظر

**پاسخ موفق:**

```json
{
  "message": "محصول با موفقیت حذف شد"
}
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز
- `403`: شما به این محصول دسترسی ندارید
- `404`: محصول یافت نشد

---

### دریافت محصولات کاربر (ادمین)

دریافت لیست محصولات یک کاربر خاص توسط ادمین.

**URL:** `GET /products/user/{userId}`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `userId`: شناسه کاربر مورد نظر

**پارامترهای query (اختیاری):**
- `active`: فیلتر بر اساس وضعیت فعال بودن (true یا false)

**پاسخ موفق:**

```json
[
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "userId": "60e1b2c3d4e5f6g7h8i9j0k",
    "name": "رژ لب قرمز",
    // سایر فیلدها
  },
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0l",
    "userId": "60e1b2c3d4e5f6g7h8i9j0k",
    "name": "سایه چشم",
    // سایر فیلدها
  }
  // سایر محصولات
]
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است
- `404`: کاربر یافت نشد

---

### ایجاد محصول برای کاربر (ادمین)

ایجاد یک محصول جدید برای یک کاربر خاص توسط ادمین.

**URL:** `POST /products/user/{userId}`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `userId`: شناسه کاربر مورد نظر

**پارامترهای ارسالی:**

```json
{
  "name": "رژ لب جدید",
  "description": "رژ لب با رنگ‌های متنوع",
  "type": "lips",
  "code": "NEW-LIP-001",
  "thumbnail": "https://example.com/images/new-lip.jpg",
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
  "active": true
}
```

**پاسخ موفق:**

```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0n",
  "userId": "60e1b2c3d4e5f6g7h8i9j0l",
  "name": "رژ لب جدید",
  "description": "رژ لب با رنگ‌های متنوع",
  "type": "lips",
  "code": "NEW-LIP-001",
  "uid": "mnop3456",
  "thumbnail": "https://example.com/images/new-lip.jpg",
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
  "createdAt": "2023-01-20T11:15:00.000Z",
  "updatedAt": "2023-01-20T11:15:00.000Z"
}
```

**کدهای خطا:**
- `400`: اطلاعات نامعتبر
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است
- `404`: کاربر یافت نشد

---

### به‌روزرسانی محصول کاربر (ادمین)

به‌روزرسانی محصول یک کاربر خاص توسط ادمین.

**URL:** `PUT /products/user/{userId}/{productId}`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `userId`: شناسه کاربر مورد نظر
- `productId`: شناسه محصول مورد نظر

**پارامترهای ارسالی:** مشابه با به‌روزرسانی محصول عادی

**پاسخ موفق:** مشابه با به‌روزرسانی محصول عادی

**کدهای خطا:**
- `400`: اطلاعات نامعتبر یا این محصول متعلق به کاربر دیگری است
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است
- `404`: محصول یا کاربر یافت نشد

---

### حذف محصول کاربر (ادمین)

حذف محصول یک کاربر خاص توسط ادمین.

**URL:** `DELETE /products/user/{userId}/{productId}`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `userId`: شناسه کاربر مورد نظر
- `productId`: شناسه محصول مورد نظر

**پاسخ موفق:**

```json
{
  "message": "محصول با موفقیت حذف شد"
}
```

**کدهای خطا:**
- `400`: این محصول متعلق به کاربر دیگری است
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است
- `404`: محصول یا کاربر یافت نشد