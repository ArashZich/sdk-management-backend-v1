# مستندات API پرداخت‌ها (Payments)

این بخش شامل API‌های مربوط به مدیریت پرداخت‌ها و تراکنش‌های مالی می‌باشد.

## پایه URL

```
/api/v1/payments
```

## API های پرداخت

### ایجاد درخواست پرداخت

ایجاد یک درخواست پرداخت جدید برای خرید پلن.

**URL:** `POST /payments`

**دسترسی:** کاربر وارد شده

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای ارسالی:**

```json
{
  "planId": "60a1b2c3d4e5f6g7h8i9j0k",
  "couponCode": "SUMMER30" // اختیاری
}
```

**پاسخ موفق:**

```json
{
  "paymentId": "60a1b2c3d4e5f6g7h8i9j0l",
  "paymentUrl": "https://api.payping.ir/v3/pay/gotoipg/123456789",
  "amount": 1500000, // مبلغ اصلی (ریال)
  "discount": 450000, // مبلغ تخفیف (ریال)
  "finalAmount": 1050000 // مبلغ نهایی (ریال)
}
```

**کدهای خطا:**
- `400`: اطلاعات نامعتبر یا پلن غیرفعال است
- `401`: دسترسی غیرمجاز
- `404`: پلن یافت نشد
- `500`: خطا در ایجاد درخواست پرداخت

---

### بازگشت از درگاه پرداخت

آدرس بازگشت از درگاه پرداخت که توسط درگاه پرداخت فراخوانی می‌شود.

**URL:** `GET /payments/callback`

**دسترسی:** عمومی (فراخوانی شده توسط درگاه پرداخت)

**پارامترهای query:**
- `refid`: کد مرجع پرداخت (از طرف درگاه)
- `clientrefid`: شناسه یکتای درخواست

**نکته:** این API در واقع کاربر را به آدرس فرانت‌اند با پارامترهای مناسب ریدایرکت می‌کند:
- پرداخت موفق: `{frontendUrl}/payment/result?status=success&refId={refid}&planName={planName}`
- پرداخت ناموفق: `{frontendUrl}/payment/result?status=failed&message={errorMessage}`
- پرداخت لغو شده: `{frontendUrl}/payment/result?status=canceled&message=پرداخت لغو شد`

---

### دریافت پرداخت‌های کاربر جاری

دریافت لیست پرداخت‌های کاربر وارد شده.

**URL:** `GET /payments/me`

**دسترسی:** کاربر وارد شده

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای query (اختیاری):**
- `status`: فیلتر بر اساس وضعیت پرداخت (pending, success, failed, canceled)

**پاسخ موفق:**

```json
[
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0l",
    "userId": "60e1b2c3d4e5f6g7h8i9j0k",
    "planId": {
      "_id": "60a1b2c3d4e5f6g7h8i9j0m",
      "name": "پلن استاندارد"
    },
    "amount": 1050000,
    "originalAmount": 1500000,
    "couponId": "60f1b2c3d4e5f6g7h8i9j0n",
    "clientRefId": "0k-abcdefgh",
    "paymentCode": "123456789",
    "paymentRefId": "987654321",
    "cardNumber": "6037-xxxx-xxxx-1234",
    "cardHashPan": "FC5B3AE59D3C7D14E9C4C3D50CAA0..",
    "payedDate": "2023-01-15T14:30:00.000Z",
    "status": "success",
    "createdAt": "2023-01-15T14:25:00.000Z",
    "updatedAt": "2023-01-15T14:30:00.000Z"
  },
  {
    "_id": "60a1b2c3d4e5f6g7h8i9j0p",
    "userId": "60e1b2c3d4e5f6g7h8i9j0k",
    "planId": {
      "_id": "60a1b2c3d4e5f6g7h8i9j0n",
      "name": "پلن پایه"
    },
    "amount": 500000,
    "originalAmount": 500000,
    "clientRefId": "0k-ijklmnop",
    "paymentCode": "123456780",
    "status": "pending",
    "createdAt": "2023-01-22T09:15:00.000Z",
    "updatedAt": "2023-01-22T09:15:00.000Z"
  }
  // سایر پرداخت‌ها
]
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز

---

### دریافت پرداخت با شناسه

دریافت اطلاعات یک پرداخت خاص با شناسه.

**URL:** `GET /payments/{paymentId}`

**دسترسی:** کاربر وارد شده (مالک پرداخت یا ادمین)

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `paymentId`: شناسه پرداخت مورد نظر

**پاسخ موفق:**

```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0l",
  "userId": "60e1b2c3d4e5f6g7h8i9j0k",
  "planId": "60a1b2c3d4e5f6g7h8i9j0m",
  "amount": 1050000,
  "originalAmount": 1500000,
  "couponId": "60f1b2c3d4e5f6g7h8i9j0n",
  "clientRefId": "0k-abcdefgh",
  "paymentCode": "123456789",
  "paymentRefId": "987654321",
  "cardNumber": "6037-xxxx-xxxx-1234",
  "cardHashPan": "FC5B3AE59D3C7D14E9C4C3D50CAA0..",
  "payedDate": "2023-01-15T14:30:00.000Z",
  "status": "success",
  "createdAt": "2023-01-15T14:25:00.000Z",
  "updatedAt": "2023-01-15T14:30:00.000Z"
}
```

**کدهای خطا:**
- `401`: دسترسی غیرمجاز
- `403`: شما به این پرداخت دسترسی ندارید
- `404`: پرداخت یافت نشد

---

### لغو پرداخت

لغو یک پرداخت در وضعیت انتظار.

**URL:** `POST /payments/{paymentId}/cancel`

**دسترسی:** کاربر وارد شده (مالک پرداخت یا ادمین)

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای URL:**
- `paymentId`: شناسه پرداخت مورد نظر

**پاسخ موفق:**

```json
{
  "message": "پرداخت با موفقیت لغو شد",
  "payment": {
    "_id": "60a1b2c3d4e5f6g7h8i9j0p",
    "userId": "60e1b2c3d4e5f6g7h8i9j0k",
    "planId": "60a1b2c3d4e5f6g7h8i9j0n",
    "status": "canceled",
    "updatedAt": "2023-01-22T10:30:00.000Z"
    // سایر فیلدها
  }
}
```

**کدهای خطا:**
- `400`: فقط پرداخت‌های در انتظار قابل لغو هستند
- `401`: دسترسی غیرمجاز
- `403`: شما به این پرداخت دسترسی ندارید
- `404`: پرداخت یافت نشد

---

### دریافت همه پرداخت‌ها (ادمین)

دریافت لیست تمام پرداخت‌های سیستم.

**URL:** `GET /payments`

**دسترسی:** فقط ادمین

**هدر های مورد نیاز:**
- `Authorization: Bearer {accessToken}`

**پارامترهای query (اختیاری):**
- `userId`: فیلتر بر اساس شناسه کاربر
- `planId`: فیلتر بر اساس شناسه پلن
- `status`: فیلتر بر اساس وضعیت پرداخت (pending, success, failed, canceled)
- `limit`: تعداد آیتم در هر صفحه (پیش‌فرض: 10)
- `page`: شماره صفحه (پیش‌فرض: 1)

**پاسخ موفق:**

```json
{
  "results": [
    {
      "_id": "60a1b2c3d4e5f6g7h8i9j0l",
      "userId": {
        "_id": "60e1b2c3d4e5f6g7h8i9j0k",
        "name": "نام کاربر 1",
        "phone": "09123456789",
        "email": "user1@example.com"
      },
      "planId": {
        "_id": "60a1b2c3d4e5f6g7h8i9j0m",
        "name": "پلن استاندارد"
      },
      "amount": 1050000,
      "originalAmount": 1500000,
      "couponId": {
        "_id": "60f1b2c3d4e5f6g7h8i9j0n",
        "code": "SUMMER30"
      },
      "status": "success",
      "payedDate": "2023-01-15T14:30:00.000Z",
      // سایر فیلدها
    },
    {
      "_id": "60a1b2c3d4e5f6g7h8i9j0p",
      "userId": {
        "_id": "60e1b2c3d4e5f6g7h8i9j0r",
        "name": "نام کاربر 2",
        "phone": "09123456780",
        "email": "user2@example.com"
      },
      "planId": {
        "_id": "60a1b2c3d4e5f6g7h8i9j0n",
        "name": "پلن پایه"
      },
      "amount": 500000,
      "originalAmount": 500000,
      "status": "pending",
      // سایر فیلدها
    }
    // سایر پرداخت‌ها
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