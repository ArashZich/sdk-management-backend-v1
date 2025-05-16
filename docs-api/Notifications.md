# مستندات API اطلاع‌رسانی‌ها (Notifications)

این بخش شامل API‌های مربوط به مدیریت اطلاع‌رسانی‌ها و پیام‌های سیستمی می‌باشد.

## پایه URL

```
/api/v1/notifications
```

## API های اطلاع‌رسانی

### دریافت اطلاعیه‌های کاربر جاری

دریافت لیست اطلاعیه‌های کاربر وارد شده.

**URL:** `GET /notifications/me`

**دسترسی:** کاربر وارد شده

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای query (اختیاری):**
- `read`: فیلتر بر اساس وضعیت خوانده شدن (true یا false)
- `type`: فیلتر بر اساس نوع اطلاعیه (expiry, payment, system, other)
- `limit`: تعداد آیتم در هر صفحه (پیش‌فرض: 10)
- `page`: شماره صفحه (پیش‌فرض: 1)

**پاسخ موفق:**

```json
{
  "results": [
    {
      "_id": "60a1b2c3d4e5f6g7h8i9j0k",
      "userId": "60e1b2c3d4e5f6g7h8i9j0l",
      "title": "اطلاعیه انقضای بسته",
      "message": "بسته پلن استاندارد شما تا 10 روز دیگر منقضی می‌شود. لطفاً نسبت به تمدید آن اقدام کنید.",
      "type": "expiry",
      "read": false,
      "planId": "60a1b2c3d4e5f6g7h8i9j0m",
      "metadata": {
        "packageId": "60a1b2c3d4e5f6g7h8i9j0n",
        "planId": "60a1b2c3d4e5f6g7h8i9j0m",
        "daysLeft": 10
      },
      "createdAt": "2023-03-20T10:15:00.000Z"
    },
    {
      "_id": "60a1b2c3d4e5f6g7h8i9j0p",
      "userId": "60e1b2c3d4e5f6g7h8i9j0l",
      "title": "تایید پرداخت",
      "message": "پرداخت شما به مبلغ 1,500,000 ریال با موفقیت انجام شد و بسته پلن استاندارد برای شما فعال گردید.",
      "type": "payment",
      "read": true,
      "planId": "60a1b2c3d4e5f6g7h8i9j0m",
      "metadata": {
        "paymentId": "60a1b2c3d4e5f6g7h8i9j0q",
        "packageId": "60a1b2c3d4e5f6g7h8i9j0r"
      },
      "createdAt": "2023-03-15T14:30:00.000Z"
    }
    // سایر اطلاعیه‌ها
  ],
  "page": 1,
  "limit": 10,
  "totalPages": 1,
  "totalResults": 2
}
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز

---

### علامت‌گذاری اطلاعیه به عنوان خوانده شده

علامت‌گذاری یک اطلاعیه خاص به عنوان خوانده شده.

**URL:** `POST /notifications/{notificationId}/read`

**دسترسی:** کاربر وارد شده (مالک اطلاعیه)

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `notificationId`: شناسه اطلاعیه مورد نظر

**پاسخ موفق:**

```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0k",
  "userId": "60e1b2c3d4e5f6g7h8i9j0l",
  "title": "اطلاعیه انقضای بسته",
  "message": "بسته پلن استاندارد شما تا 10 روز دیگر منقضی می‌شود. لطفاً نسبت به تمدید آن اقدام کنید.",
  "type": "expiry",
  "read": true,
  "planId": "60a1b2c3d4e5f6g7h8i9j0m",
  "metadata": {
    "packageId": "60a1b2c3d4e5f6g7h8i9j0n",
    "planId": "60a1b2c3d4e5f6g7h8i9j0m",
    "daysLeft": 10
  },
  "createdAt": "2023-03-20T10:15:00.000Z"
}
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز
- `404`: اطلاعیه یافت نشد

---

### علامت‌گذاری همه اطلاعیه‌ها به عنوان خوانده شده

علامت‌گذاری همه اطلاعیه‌های کاربر به عنوان خوانده شده.

**URL:** `POST /notifications/read-all`

**دسترسی:** کاربر وارد شده

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پاسخ موفق:**

```json
{
  "modifiedCount": 5
}
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز

---

### دریافت همه اطلاعیه‌ها (ادمین)

دریافت لیست تمام اطلاعیه‌های سیستم.

**URL:** `GET /notifications`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای query (اختیاری):**
- `userId`: فیلتر بر اساس شناسه کاربر
- `planId`: فیلتر بر اساس شناسه پلن
- `type`: فیلتر بر اساس نوع اطلاعیه (expiry, payment, system, other)
- `read`: فیلتر بر اساس وضعیت خوانده شدن (true یا false)
- `limit`: تعداد آیتم در هر صفحه (پیش‌فرض: 10)
- `page`: شماره صفحه (پیش‌فرض: 1)

**پاسخ موفق:**

```json
{
  "results": [
    {
      "_id": "60a1b2c3d4e5f6g7h8i9j0k",
      "userId": {
        "_id": "60e1b2c3d4e5f6g7h8i9j0l",
        "name": "نام کاربر 1",
        "phone": "09123456789",
        "email": "user1@example.com"
      },
      "title": "اطلاعیه انقضای بسته",
      "message": "بسته پلن استاندارد شما تا 10 روز دیگر منقضی می‌شود. لطفاً نسبت به تمدید آن اقدام کنید.",
      "type": "expiry",
      "read": false,
      "planId": {
        "_id": "60a1b2c3d4e5f6g7h8i9j0m",
        "name": "پلن استاندارد"
      },
      "metadata": {
        "packageId": "60a1b2c3d4e5f6g7h8i9j0n",
        "planId": "60a1b2c3d4e5f6g7h8i9j0m",
        "daysLeft": 10
      },
      "createdAt": "2023-03-20T10:15:00.000Z"
    },
    {
      "_id": "60a1b2c3d4e5f6g7h8i9j0s",
      "userId": {
        "_id": "60e1b2c3d4e5f6g7h8i9j0t",
        "name": "نام کاربر 2",
        "phone": "09123456780",
        "email": "user2@example.com"
      },
      "title": "اطلاعیه سیستمی",
      "message": "به‌روزرسانی جدید SDK در دسترس است. امکانات جدید: ...",
      "type": "system",
      "read": true,
      "metadata": {},
      "createdAt": "2023-03-18T09:00:00.000Z"
    }
    // سایر اطلاعیه‌ها
  ],
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "totalResults": 48
}
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است

---

### ارسال اطلاعیه (ادمین)

ارسال اطلاعیه به یک کاربر خاص یا کاربران یک پلن خاص.

**URL:** `POST /notifications/send`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای ارسالی:**

```json
{
  "userId": "60e1b2c3d4e5f6g7h8i9j0l", // یا userId یا planId باید ارسال شود
  // "planId": "60a1b2c3d4e5f6g7h8i9j0m", // برای ارسال به همه کاربران یک پلن
  "title": "اطلاعیه جدید",
  "message": "متن اطلاعیه جدید برای کاربر",
  "type": "system",
  "metadata": {
    "key1": "value1",
    "key2": "value2"
  },
  "sendSms": true // آیا علاوه بر اطلاعیه داخلی، پیامک هم ارسال شود؟
}
```

**پاسخ موفق (در حالت ارسال به یک کاربر):**

```json
{
  "message": "اطلاعیه با موفقیت به کاربر ارسال شد",
  "notification": {
    "_id": "60a1b2c3d4e5f6g7h8i9j0u",
    "userId": "60e1b2c3d4e5f6g7h8i9j0l",
    "title": "اطلاعیه جدید",
    "message": "متن اطلاعیه جدید برای کاربر",
    "type": "system",
    "read": false,
    "metadata": {
      "key1": "value1",
      "key2": "value2"
    },
    "createdAt": "2023-03-25T11:30:00.000Z"
  },
  "count": 1
}
```

**پاسخ موفق (در حالت ارسال به کاربران یک پلن):**

```json
{
  "message": "اطلاعیه با موفقیت به 15 کاربر ارسال شد",
  "count": 15
}
```

**کدهای خطا:**
- `400`: باید یکی از فیلدهای userId یا planId را وارد کنید
- `401`: دسترسی غیرمجاز
- `403`: فقط برای ادمین قابل دسترسی است
- `404`: کاربر یا پلن یافت نشد