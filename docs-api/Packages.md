# مستندات API بسته‌ها (Packages)

این بخش شامل API‌های مربوط به مدیریت بسته‌های خریداری شده کاربران می‌باشد.

## پایه URL

```
/api/v1/packages
```

## API های بسته‌ها

### دریافت بسته‌های کاربر جاری

دریافت لیست بسته‌های کاربر وارد شده.

**URL:** `GET /packages/me`

**دسترسی:** کاربر وارد شده

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای query (اختیاری):**
- `status`: فیلتر بر اساس وضعیت بسته (active, expired, suspended)

**پاسخ موفق:**

```json
[
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "userId": "60e1b2c3d4e5f6g7h8i9j0k",
    "planId": {
      "_id": "60a1b2c3d4e5f6g7h8i9j0l",
      "name": "پلن استاندارد",
      "duration": 90,
      "price": 1500000
    },
    "startDate": "2023-01-01T12:00:00.000Z",
    "endDate": "2023-04-01T12:00:00.000Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "sdkFeatures": {
      "features": ["lips", "eyeshadow", "eyepencil"],
      "patterns": {
        "lips": ["normal", "matte", "glossy"],
        "eyeshadow": ["normal"],
        "eyepencil": ["normal"]
      },
      "isPremium": false,
      "projectType": "standard",
      "mediaFeatures": {
        "allowedSources": ["camera"],
        "allowedViews": ["single"],
        "comparisonModes": []
      }
    },
    "requestLimit": {
      "monthly": 3000,
      "remaining": 2750
    },
    "status": "active",
    "notified": false,
    "createdAt": "2023-01-01T12:00:00.000Z",
    "updatedAt": "2023-01-01T12:00:00.000Z"
  },
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0m",
    "userId": "60e1b2c3d4e5f6g7h8i9j0k",
    "planId": {
      "_id": "60a1b2c3d4e5f6g7h8i9j0n",
      "name": "پلن پایه",
      "duration": 30,
      "price": 500000
    },
    "startDate": "2022-11-01T12:00:00.000Z",
    "endDate": "2022-12-01T12:00:00.000Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "sdkFeatures": {
      "features": ["lips"],
      "patterns": {
        "lips": ["normal", "matte"]
      },
      "isPremium": false,
      "projectType": "standard",
      "mediaFeatures": {
        "allowedSources": ["camera"],
        "allowedViews": ["single"],
        "comparisonModes": []
      }
    },
    "requestLimit": {
      "monthly": 1000,
      "remaining": 0
    },
    "status": "expired",
    "notified": true,
    "createdAt": "2022-11-01T12:00:00.000Z",
    "updatedAt": "2022-12-01T12:00:00.000Z"
  }
  // سایر بسته‌ها
]
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز

---

### دریافت بسته با شناسه

دریافت اطلاعات یک بسته خاص با شناسه.

**URL:** `GET /packages/{packageId}`

**دسترسی:** کاربر وارد شده (مالک بسته یا ادمین)

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `packageId`: شناسه بسته مورد نظر

**پاسخ موفق:**

```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0k",
  "userId": {
    "_id": "60e1b2c3d4e5f6g7h8i9j0k",
    "name": "نام کاربر",
    "phone": "09123456789",
    "email": "user@example.com"
  },
  "planId": {
    "_id": "60a1b2c3d4e5f6g7h8i9j0l",
    "name": "پلن استاندارد",
    "duration": 90,
    "price": 1500000
  },
  "startDate": "2023-01-01T12:00:00.000Z",
  "endDate": "2023-04-01T12:00:00.000Z",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "sdkFeatures": {
    "features": ["lips", "eyeshadow", "eyepencil"],
    "patterns": {
      "lips": ["normal", "matte", "glossy"],
      "eyeshadow": ["normal"],
      "eyepencil": ["normal"]
    },
    "isPremium": false,
    "projectType": "standard",
    "mediaFeatures": {
      "allowedSources": ["camera"],
      "allowedViews": ["single"],
      "comparisonModes": []
    }
  },
  "requestLimit": {
    "monthly": 3000,
    "remaining": 2750
  },
  "status": "active",
  "notified": false,
  "createdAt": "2023-01-01T12:00:00.000Z",
  "updatedAt": "2023-01-01T12:00:00.000Z"
}
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز
- `403`: شما به این بسته دسترسی ندارید
- `404`: بسته یافت نشد

---

### دریافت همه بسته‌ها (ادمین)

دریافت لیست تمام بسته‌های سیستم.

**URL:** `GET /packages`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای query (اختیاری):**
- `userId`: فیلتر بر اساس شناسه کاربر
- `planId`: فیلتر بر اساس شناسه پلن
- `status`: فیلتر بر اساس وضعیت بسته (active, expired, suspended)
- `limit`: تعداد آیتم در هر صفحه (پیش‌فرض: 10)
- `page`: شماره صفحه (پیش‌فرض: 1)

**پاسخ موفق:**

```json
{
  "results": [
    {
      "_id": "60a1b2c3d4e5f6g7h8i9j0k",
      "userId": {
        "_id": "60e1b2c3d4e5f6g7h8i9j0k",
        "name": "نام کاربر 1",
        "phone": "09123456789",
        "email": "user1@example.com"
      },
      "planId": {
        "_id": "60a1b2c3d4e5f6g7h8i9j0l",
        "name": "پلن استاندارد"
      },
      "status": "active",
      // سایر فیلدها
    },
    {
      "_id": "60a1b2c3d4e5f6g7h8i9j0m",
      "userId": {
        "_id": "60e1b2c3d4e5f6g7h8i9j0m",
        "name": "نام کاربر 2",
        "phone": "09123456780",
        "email": "user2@example.com"
      },
      "planId": {
        "_id": "60a1b2c3d4e5f6g7h8i9j0n",
        "name": "پلن پایه"
      },
      "status": "expired",
      // سایر فیلدها
    }
    // سایر بسته‌ها
  ],
  "page": 1,
  "limit": 10,
  "totalPages": 3,
  "totalResults": 25
}
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است

---

### ایجاد بسته بدون پرداخت (ادمین)

ایجاد یک بسته جدید بدون نیاز به پرداخت توسط ادمین.

**URL:** `POST /packages`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای ارسالی:**

```json
{
  "userId": "60e1b2c3d4e5f6g7h8i9j0k",
  "planId": "60a1b2c3d4e5f6g7h8i9j0l",
  "duration": 180,
  "sdkFeatures": {
    "features": ["lips", "eyeshadow", "eyepencil", "eyelashes"],
    "patterns": {
      "lips": ["normal", "matte", "glossy", "glitter"],
      "eyeshadow": ["normal", "shimmer"],
      "eyepencil": ["normal"],
      "eyelashes": ["long-lash"]
    },
    "isPremium": true,
    "projectType": "professional",
    "mediaFeatures": {
      "allowedSources": ["camera", "image"],
      "allowedViews": ["single", "multi", "split"],
      "comparisonModes": ["before-after", "split"]
    }
  }
}
```

**پاسخ موفق:**

```json
{
  "message": "بسته با موفقیت ایجاد شد",
  "package": {
    "_id": "60a1b2c3d4e5f6g7h8i9j0p",
    "userId": "60e1b2c3d4e5f6g7h8i9j0k",
    "planId": "60a1b2c3d4e5f6g7h8i9j0l",
    "startDate": "2023-01-20T15:30:00.000Z",
    "endDate": "2023-07-19T15:30:00.000Z",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "sdkFeatures": {
      "features": ["lips", "eyeshadow", "eyepencil", "eyelashes"],
      "patterns": {
        "lips": ["normal", "matte", "glossy", "glitter"],
        "eyeshadow": ["normal", "shimmer"],
        "eyepencil": ["normal"],
        "eyelashes": ["long-lash"]
      },
      "isPremium": true,
      "projectType": "professional",
      "mediaFeatures": {
        "allowedSources": ["camera", "image"],
        "allowedViews": ["single", "multi", "split"],
        "comparisonModes": ["before-after", "split"]
      }
    },
    "requestLimit": {
      "monthly": 3000,
      "remaining": 3000
    },
    "status": "active",
    "notified": false,
    "createdAt": "2023-01-20T15:30:00.000Z",
    "updatedAt": "2023-01-20T15:30:00.000Z"
  }
}
```

**کدهای خطا:**
- `400`: اطلاعات نامعتبر
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است
- `404`: کاربر یا پلن یافت نشد

---

### به‌روزرسانی ویژگی‌های SDK بسته (ادمین)

به‌روزرسانی ویژگی‌های SDK یک بسته خاص.

**URL:** `PUT /packages/{packageId}/sdk-features`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `packageId`: شناسه بسته مورد نظر

**پارامترهای ارسالی:**

```json
{
  "features": ["lips", "eyeshadow", "eyepencil", "blush", "eyeliner"],
  "patterns": {
    "lips": ["normal", "matte", "glossy", "glitter"],
    "eyeshadow": ["normal", "shimmer"],
    "eyepencil": ["normal"],
    "blush": ["normal"],
    "eyeliner": ["normal", "lashed"]
  },
  "isPremium": true,
  "projectType": "professional",
  "mediaFeatures": {
    "allowedSources": ["camera", "image"],
    "allowedViews": ["single", "multi", "split"],
    "comparisonModes": ["before-after", "split"]
  }
}
```

**پاسخ موفق:**

```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0k",
  "userId": "60e1b2c3d4e5f6g7h8i9j0k",
  "planId": "60a1b2c3d4e5f6g7h8i9j0l",
  "startDate": "2023-01-01T12:00:00.000Z",
  "endDate": "2023-04-01T12:00:00.000Z",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // توکن جدید
  "sdkFeatures": {
    "features": ["lips", "eyeshadow", "eyepencil", "blush", "eyeliner"],
    "patterns": {
      "lips": ["normal", "matte", "glossy", "glitter"],
      "eyeshadow": ["normal", "shimmer"],
      "eyepencil": ["normal"],
      "blush": ["normal"],
      "eyeliner": ["normal", "lashed"]
    },
    "isPremium": true,
    "projectType": "professional",
    "mediaFeatures": {
      "allowedSources": ["camera", "image"],
      "allowedViews": ["single", "multi", "split"],
      "comparisonModes": ["before-after", "split"]
    }
  },
  "requestLimit": {
    "monthly": 3000,
    "remaining": 2750
  },
  "status": "active",
  "notified": false,
  "updatedAt": "2023-01-20T16:45:00.000Z"
  // سایر فیلدها
}
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است
- `404`: بسته یافت نشد

---

### تمدید بسته (ادمین)

تمدید اعتبار یک بسته خاص.

**URL:** `POST /packages/{packageId}/extend`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `packageId`: شناسه بسته مورد نظر

**پارامترهای ارسالی:**

```json
{
  "days": 30
}
```

**پاسخ موفق:**

```json
{
  "message": "بسته با موفقیت به مدت 30 روز تمدید شد",
  "package": {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "userId": "60e1b2c3d4e5f6g7h8i9j0k",
    "planId": "60a1b2c3d4e5f6g7h8i9j0l",
    "startDate": "2023-01-01T12:00:00.000Z",
    "endDate": "2023-05-01T12:00:00.000Z", // تاریخ جدید
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // توکن جدید
    "status": "active",
    "notified": false,
    "updatedAt": "2023-01-22T10:30:00.000Z"
    // سایر فیلدها
  }
}
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است
- `404`: بسته یافت نشد

---

### تعلیق بسته (ادمین)

تعلیق یک بسته فعال.

**URL:** `POST /packages/{packageId}/suspend`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `packageId`: شناسه بسته مورد نظر

**پاسخ موفق:**

```json
{
  "message": "بسته با موفقیت تعلیق شد",
  "package": {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "userId": "60e1b2c3d4e5f6g7h8i9j0k",
    "planId": "60a1b2c3d4e5f6g7h8i9j0l",
    "status": "suspended",
    "updatedAt": "2023-01-22T11:15:00.000Z"
    // سایر فیلدها
  }
}
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است
- `404`: بسته یافت نشد

---

### فعال‌سازی مجدد بسته (ادمین)

فعال‌سازی مجدد یک بسته تعلیق شده.

**URL:** `POST /packages/{packageId}/reactivate`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `packageId`: شناسه بسته مورد نظر

**پاسخ موفق:**

```json
{
  "message": "بسته با موفقیت فعال شد",
  "package": {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k",
    "userId": "60e1b2c3d4e5f6g7h8i9j0k",
    "planId": "60a1b2c3d4e5f6g7h8i9j0l",
    "status": "active",
    "updatedAt": "2023-01-22T14:20:00.000Z"
    // سایر فیلدها
  }
}
```

**کدهای خطا:**
- `400`: بسته منقضی شده است و قابل فعال‌سازی نیست
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است
- `404`: بسته یافت نشد