# مستندات API کوپن‌ها (Coupons)

این بخش شامل API‌های مربوط به مدیریت کوپن‌های تخفیف می‌باشد.

## پایه URL

```
/api/v1/coupons
```

## API های کوپن‌ها

### بررسی اعتبار کوپن

بررسی اعتبار کد کوپن برای استفاده در خرید پلن.

**URL:** `POST /coupons/validate`

**دسترسی:** کاربر وارد شده

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای ارسالی:**

```json
{
  "code": "SUMMER30",
  "planId": "60a1b2c3d4e5f6g7h8i9j0k"
}
```

**پاسخ موفق:**

```json
{
  "valid": true,
  "coupon": {
    "_id": "60a1b2c3d4e5f6g7h8i9j0l",
    "code": "SUMMER30",
    "description": "تخفیف 30 درصدی تابستان",
    "percent": 30,
    "maxAmount": 500000,
    "maxUsage": 100,
    "usedCount": 45,
    "startDate": "2023-06-01T00:00:00.000Z",
    "endDate": "2023-09-01T00:00:00.000Z",
    "forPlans": ["60a1b2c3d4e5f6g7h8i9j0k", "60a1b2c3d4e5f6g7h8i9j0m"],
    "forUsers": [],
    "active": true,
    "createdAt": "2023-05-25T12:00:00.000Z",
    "updatedAt": "2023-07-15T08:30:00.000Z"
  },
  "discountAmount": 450000,
  "finalPrice": 1050000
}
```

**کدهای خطا:**
- `400`: کوپن نامعتبر است (غیرفعال، منقضی شده، تعداد استفاده به پایان رسیده، برای پلن یا کاربر دیگری است)
- `401`: دسترسی غیرمجاز
- `404`: کوپن یا پلن یافت نشد

---

### دریافت همه کوپن‌ها (ادمین)

دریافت لیست تمام کوپن‌های تخفیف سیستم.

**URL:** `GET /coupons`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای query (اختیاری):**
- `code`: فیلتر بر اساس کد کوپن
- `active`: فیلتر بر اساس وضعیت فعال بودن (true یا false)
- `limit`: تعداد آیتم در هر صفحه (پیش‌فرض: 10)
- `page`: شماره صفحه (پیش‌فرض: 1)

**پاسخ موفق:**

```json
{
  "results": [
    {
      "_id": "60a1b2c3d4e5f6g7h8i9j0l",
      "code": "SUMMER30",
      "description": "تخفیف 30 درصدی تابستان",
      "percent": 30,
      "maxAmount": 500000,
      "maxUsage": 100,
      "usedCount": 45,
      "startDate": "2023-06-01T00:00:00.000Z",
      "endDate": "2023-09-01T00:00:00.000Z",
      "forPlans": [
        {
          "_id": "60a1b2c3d4e5f6g7h8i9j0k",
          "name": "پلن استاندارد"
        },
        {
          "_id": "60a1b2c3d4e5f6g7h8i9j0m",
          "name": "پلن حرفه‌ای"
        }
      ],
      "forUsers": [],
      "active": true,
      "createdAt": "2023-05-25T12:00:00.000Z",
      "updatedAt": "2023-07-15T08:30:00.000Z"
    },
    {
      "_id": "60a1b2c3d4e5f6g7h8i9j0n",
      "code": "WELCOME50",
      "description": "تخفیف 50 درصدی برای کاربران جدید",
      "percent": 50,
      "maxAmount": 750000,
      "maxUsage": 1,
      "usedCount": 0,
      "startDate": "2023-01-01T00:00:00.000Z",
      "endDate": "2023-12-31T23:59:59.999Z",
      "forPlans": [],
      "forUsers": [
        {
          "_id": "60e1b2c3d4e5f6g7h8i9j0k",
          "name": "کاربر جدید"
        }
      ],
      "active": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
    // سایر کوپن‌ها
  ],
  "page": 1,
  "limit": 10,
  "totalPages": 2,
  "totalResults": 12
}
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است

---

### دریافت کوپن با شناسه (ادمین)

دریافت اطلاعات یک کوپن خاص با شناسه.

**URL:** `GET /coupons/{couponId}`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `couponId`: شناسه کوپن مورد نظر

**پاسخ موفق:**

```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0l",
  "code": "SUMMER30",
  "description": "تخفیف 30 درصدی تابستان",
  "percent": 30,
  "maxAmount": 500000,
  "maxUsage": 100,
  "usedCount": 45,
  "startDate": "2023-06-01T00:00:00.000Z",
  "endDate": "2023-09-01T00:00:00.000Z",
  "forPlans": ["60a1b2c3d4e5f6g7h8i9j0k", "60a1b2c3d4e5f6g7h8i9j0m"],
  "forUsers": [],
  "active": true,
  "createdAt": "2023-05-25T12:00:00.000Z",
  "updatedAt": "2023-07-15T08:30:00.000Z"
}
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است
- `404`: کوپن یافت نشد

---

### ایجاد کوپن جدید (ادمین)

ایجاد یک کوپن تخفیف جدید.

**URL:** `POST /coupons`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای ارسالی:**

```json
{
  "code": "WINTER40",
  "description": "تخفیف 40 درصدی زمستان",
  "percent": 40,
  "maxAmount": 600000,
  "maxUsage": 50,
  "startDate": "2023-12-01T00:00:00.000Z",
  "endDate": "2024-03-01T00:00:00.000Z",
  "forPlans": ["60a1b2c3d4e5f6g7h8i9j0k", "60a1b2c3d4e5f6g7h8i9j0m"],
  "forUsers": ["60e1b2c3d4e5f6g7h8i9j0r"],
  "active": true
}
```

**پاسخ موفق:**

```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0p",
  "code": "WINTER40",
  "description": "تخفیف 40 درصدی زمستان",
  "percent": 40,
  "maxAmount": 600000,
  "maxUsage": 50,
  "usedCount": 0,
  "startDate": "2023-12-01T00:00:00.000Z",
  "endDate": "2024-03-01T00:00:00.000Z",
  "forPlans": ["60a1b2c3d4e5f6g7h8i9j0k", "60a1b2c3d4e5f6g7h8i9j0m"],
  "forUsers": ["60e1b2c3d4e5f6g7h8i9j0r"],
  "active": true,
  "createdAt": "2023-07-20T10:15:00.000Z",
  "updatedAt": "2023-07-20T10:15:00.000Z"
}
```

**کدهای خطا:**
- `400`: اطلاعات نامعتبر یا کد کوپن تکراری
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است

---

### به‌روزرسانی کوپن (ادمین)

به‌روزرسانی اطلاعات یک کوپن خاص.

**URL:** `PUT /coupons/{couponId}`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `couponId`: شناسه کوپن مورد نظر

**پارامترهای ارسالی:**

```json
{
  "description": "تخفیف 40 درصدی زمستان - ویرایش شده",
  "maxAmount": 700000,
  "maxUsage": 75,
  "endDate": "2024-03-15T00:00:00.000Z",
  "forPlans": ["60a1b2c3d4e5f6g7h8i9j0k", "60a1b2c3d4e5f6g7h8i9j0m", "60a1b2c3d4e5f6g7h8i9j0q"],
  "active": true
  // سایر فیلدها را می‌توانید به‌روزرسانی کنید
}
```

**پاسخ موفق:**

```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0p",
  "code": "WINTER40",
  "description": "تخفیف 40 درصدی زمستان - ویرایش شده",
  "percent": 40,
  "maxAmount": 700000,
  "maxUsage": 75,
  "usedCount": 0,
  "startDate": "2023-12-01T00:00:00.000Z",
  "endDate": "2024-03-15T00:00:00.000Z",
  "forPlans": ["60a1b2c3d4e5f6g7h8i9j0k", "60a1b2c3d4e5f6g7h8i9j0m", "60a1b2c3d4e5f6g7h8i9j0q"],
  "forUsers": ["60e1b2c3d4e5f6g7h8i9j0r"],
  "active": true,
  "createdAt": "2023-07-20T10:15:00.000Z",
  "updatedAt": "2023-07-20T11:30:00.000Z"
}
```

**کدهای خطا:**
- `400`: اطلاعات نامعتبر یا کد کوپن تکراری
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است
- `404`: کوپن یافت نشد

---

### غیرفعال‌سازی کوپن (ادمین)

غیرفعال‌سازی یک کوپن تخفیف.

**URL:** `DELETE /coupons/{couponId}`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `couponId`: شناسه کوپن مورد نظر

**پاسخ موفق:**

```json
{
  "message": "کوپن با موفقیت غیرفعال شد"
}
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است
- `404`: کوپن یافت نشد