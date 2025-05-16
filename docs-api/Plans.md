# مستندات API پلن‌ها (Plans)

این بخش شامل API‌های مربوط به مدیریت پلن‌های خدماتی می‌باشد.

## پایه URL

```
/api/v1/plans
```

## API های پلن‌ها

### دریافت پلن‌های عمومی

دریافت لیست پلن‌های فعال برای نمایش به کاربران.

**URL:** `GET /plans/public`

**دسترسی:** عمومی

**پاسخ موفق:**

```json
[
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "name": "پلن پایه",
    "description": "مناسب برای استفاده آزمایشی",
    "price": 500000,
    "duration": 30,
    "features": ["دسترسی به رژ لب", "محدودیت تعداد رنگ"],
    "requestLimit": {
      "monthly": 1000,
      "total": 1000
    },
    "defaultSdkFeatures": {
      "features": ["lips"],
      "patterns": {
        "lips": ["normal", "matte"]
      },
      "mediaFeatures": {
        "allowedSources": ["camera"],
        "allowedViews": ["single"],
        "comparisonModes": []
      }
    },
    "active": true,
    "specialOffer": false,
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z"
  },
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0l",
    "name": "پلن استاندارد",
    "description": "مناسب برای سایت‌های کوچک و متوسط",
    "price": 1500000,
    "duration": 90,
    "features": [
      "دسترسی به رژ لب",
      "دسترسی به سایه چشم",
      "پشتیبانی ایمیلی"
    ],
    "requestLimit": {
      "monthly": 3000,
      "total": 9000
    },
    "defaultSdkFeatures": {
      "features": ["lips", "eyeshadow", "eyepencil"],
      "patterns": {
        "lips": ["normal", "matte", "glossy"],
        "eyeshadow": ["normal"],
        "eyepencil": ["normal"]
      },
      "mediaFeatures": {
        "allowedSources": ["camera"],
        "allowedViews": ["single"],
        "comparisonModes": []
      }
    },
    "active": true,
    "specialOffer": false,
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z"
  }
  // سایر پلن‌ها
]
```

---

### دریافت همه پلن‌ها

دریافت لیست تمام پلن‌ها (فعال و غیرفعال).

**URL:** `GET /plans`

**دسترسی:** کاربر وارد شده

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای query (اختیاری):**
- `name`: فیلتر بر اساس نام پلن
- `active`: فیلتر بر اساس وضعیت فعال بودن (true یا false)
- `specialOffer`: فیلتر بر اساس پیشنهاد ویژه بودن (true یا false)
- `limit`: تعداد آیتم در هر صفحه (پیش‌فرض: 10)
- `page`: شماره صفحه (پیش‌فرض: 1)

**پاسخ موفق:**

```json
[
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "name": "پلن پایه",
    // سایر فیلدها
  },
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0l",
    "name": "پلن استاندارد",
    // سایر فیلدها
  },
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0m",
    "name": "پلن حرفه‌ای",
    "active": false,
    // سایر فیلدها
  }
  // سایر پلن‌ها
]
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز

---

### دریافت پلن با شناسه

دریافت اطلاعات یک پلن خاص با شناسه.

**URL:** `GET /plans/{planId}`

**دسترسی:** کاربر وارد شده

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `planId`: شناسه پلن مورد نظر

**پاسخ موفق:**

```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0k",
  "name": "پلن پایه",
  "description": "مناسب برای استفاده آزمایشی",
  "price": 500000,
  "duration": 30,
  "features": ["دسترسی به رژ لب", "محدودیت تعداد رنگ"],
  "requestLimit": {
    "monthly": 1000,
    "total": 1000
  },
  "defaultSdkFeatures": {
    "features": ["lips"],
    "patterns": {
      "lips": ["normal", "matte"]
    },
    "mediaFeatures": {
      "allowedSources": ["camera"],
      "allowedViews": ["single"],
      "comparisonModes": []
    }
  },
  "active": true,
  "specialOffer": false,
  "createdAt": "2023-01-01T12:00:00.000Z",
  "updatedAt": "2023-01-01T12:00:00.000Z"
}
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز
- `404`: پلن یافت نشد

---

### ایجاد پلن جدید (ادمین)

ایجاد یک پلن جدید توسط ادمین.

**URL:** `POST /plans`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای ارسالی:**

```json
{
  "name": "پلن جدید",
  "description": "توضیحات پلن جدید",
  "price": 2500000,
  "duration": 60,
  "features": ["دسترسی به رژ لب", "دسترسی به سایه چشم", "ویژگی خاص"],
  "requestLimit": {
    "monthly": 5000,
    "total": 30000
  },
  "defaultSdkFeatures": {
    "features": ["lips", "eyeshadow"],
    "patterns": {
      "lips": ["normal", "matte", "glossy"],
      "eyeshadow": ["normal", "shimmer"]
    },
    "mediaFeatures": {
      "allowedSources": ["camera", "image"],
      "allowedViews": ["single", "multi"],
      "comparisonModes": ["before-after"]
    }
  },
  "active": true,
  "specialOffer": true
}
```

**پاسخ موفق:**

```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0n",
  "name": "پلن جدید",
  "description": "توضیحات پلن جدید",
  "price": 2500000,
  "duration": 60,
  "features": ["دسترسی به رژ لب", "دسترسی به سایه چشم", "ویژگی خاص"],
  "requestLimit": {
    "monthly": 5000,
    "total": 30000
  },
  "defaultSdkFeatures": {
    "features": ["lips", "eyeshadow"],
    "patterns": {
      "lips": ["normal", "matte", "glossy"],
      "eyeshadow": ["normal", "shimmer"]
    },
    "mediaFeatures": {
      "allowedSources": ["camera", "image"],
      "allowedViews": ["single", "multi"],
      "comparisonModes": ["before-after"]
    }
  },
  "active": true,
  "specialOffer": true,
  "createdAt": "2023-01-15T14:30:00.000Z",
  "updatedAt": "2023-01-15T14:30:00.000Z"
}
```

**کدهای خطا:**
- `400`: اطلاعات نامعتبر
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است

---

### به‌روزرسانی پلن (ادمین)

به‌روزرسانی اطلاعات یک پلن خاص توسط ادمین.

**URL:** `PUT /plans/{planId}`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `planId`: شناسه پلن مورد نظر

**پارامترهای ارسالی:**

```json
{
  "name": "پلن به‌روزرسانی شده",
  "price": 3000000,
  "features": ["دسترسی به رژ لب", "دسترسی به سایه چشم", "ویژگی جدید"],
  "active": false,
  "specialOffer": true
  // سایر فیلدها را می‌توانید به‌روزرسانی کنید
}
```

**پاسخ موفق:**

```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0k",
  "name": "پلن به‌روزرسانی شده",
  "description": "مناسب برای استفاده آزمایشی",
  "price": 3000000,
  "duration": 30,
  "features": ["دسترسی به رژ لب", "دسترسی به سایه چشم", "ویژگی جدید"],
  "requestLimit": {
    "monthly": 1000,
    "total": 1000
  },
  "defaultSdkFeatures": {
    "features": ["lips"],
    "patterns": {
      "lips": ["normal", "matte"]
    },
    "mediaFeatures": {
      "allowedSources": ["camera"],
      "allowedViews": ["single"],
      "comparisonModes": []
    }
  },
  "active": false,
  "specialOffer": true,
  "createdAt": "2023-01-01T12:00:00.000Z",
  "updatedAt": "2023-01-15T16:45:00.000Z"
}
```

**کدهای خطا:**
- `400`: اطلاعات نامعتبر
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است
- `404`: پلن یافت نشد

---

### حذف پلن (ادمین)

حذف یک پلن خاص توسط ادمین.

**URL:** `DELETE /plans/{planId}`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `planId`: شناسه پلن مورد نظر

**پاسخ موفق:**

```json
{
  "message": "پلن با موفقیت حذف شد"
}
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است
- `404`: پلن یافت نشد