# مستندات API کاربران (Users)

این بخش شامل API‌های مربوط به مدیریت کاربران می‌باشد.

## پایه URL
```
/api/v1/users
```

## API های کاربران

### دریافت پروفایل خود
دریافت اطلاعات پروفایل کاربر جاری.

**URL:** `GET /users/me`  
**دسترسی:** کاربر وارد شده  

**هدر های مورد نیاز:**
```
Authorization: Bearer {accessToken}
```

**پاسخ موفق:**
```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0k",
  "name": "نام کاربر",
  "phone": "09123456789",
  "email": "user@example.com",
  "company": "شرکت نمونه",
  "role": "user",
  "verified": true,
  "userType": "real",
  "nationalId": "0123456789",
  "allowedDomains": ["example.com", "localhost"],
  "notificationSettings": {
    "email": true,
    "sms": true
  },
  "createdAt": "2023-01-01T12:00:00.000Z",
  "updatedAt": "2023-01-02T14:30:00.000Z"
}
```

**کدهای خطا:**  
- `401`: دسترسی غیرمجاز  
- `404`: کاربر یافت نشد  

---

### به‌روزرسانی پروفایل خود
به‌روزرسانی اطلاعات پروفایل کاربر جاری.

**URL:** `PUT /users/me`  
**دسترسی:** کاربر وارد شده  

**هدر های مورد نیاز:**
```
Authorization: Bearer {accessToken}
```

**پارامترهای ارسالی:**
```json
{
  "name": "نام جدید کاربر",
  "email": "new.email@example.com",
  "company": "شرکت جدید",
  "userType": "legal",
  "nationalId": "9876543210",
  "notificationSettings": {
    "email": true,
    "sms": false
  }
}
```

**پاسخ موفق:**
```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0k",
  "name": "نام جدید کاربر",
  "phone": "09123456789",
  "email": "new.email@example.com",
  "company": "شرکت جدید",
  "role": "user",
  "verified": true,
  "userType": "legal",
  "nationalId": "9876543210",
  "allowedDomains": ["example.com", "localhost"],
  "notificationSettings": {
    "email": true,
    "sms": false
  },
  "createdAt": "2023-01-01T12:00:00.000Z",
  "updatedAt": "2023-01-05T10:15:00.000Z"
}
```

**کدهای خطا:**  
- `400`: اطلاعات نامعتبر  
- `401`: دسترسی غیرمجاز  

---

### به‌روزرسانی دامنه‌های مجاز
به‌روزرسانی دامنه‌های مجاز برای استفاده از SDK.

**URL:** `PUT /users/me/domains`  
**دسترسی:** کاربر وارد شده  

**هدر های مورد نیاز:**
```
Authorization: Bearer {accessToken}
```

**پارامترهای ارسالی:**
```json
{
  "domains": ["example.com", "subdomain.example.com", "localhost"]
}
```

**پاسخ موفق:**
```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0k",
  "name": "نام کاربر",
  "phone": "09123456789",
  "email": "user@example.com",
  "allowedDomains": ["example.com", "subdomain.example.com", "localhost"],
  "updatedAt": "2023-01-05T11:20:00.000Z"
}
```

**کدهای خطا:**  
- `400`: اطلاعات نامعتبر  
- `401`: دسترسی غیرمجاز  

---

### دریافت همه کاربران (ادمین)
دریافت لیست تمام کاربران سیستم.

**URL:** `GET /users`  
**دسترسی:** فقط ادمین  

**هدر های مورد نیاز:**
```
Authorization: Bearer {accessToken}
```

**پارامترهای query (اختیاری):**
- `name`: فیلتر بر اساس نام
- `phone`: فیلتر بر اساس شماره تلفن
- `role`: فیلتر بر اساس نقش (user یا admin)
- `limit`: تعداد آیتم در هر صفحه (پیش‌فرض: 10)
- `page`: شماره صفحه (پیش‌فرض: 1)

**پاسخ موفق:**
```json
{
  "results": [
    {
      "_id": "60a1b2c3d4e5f6g7h8i9j0k",
      "name": "نام کاربر 1",
      "phone": "09123456789",
      "email": "user1@example.com",
      "role": "user"
    },
    {
      "_id": "60a1b2c3d4e5f6g7h8i9j1l",
      "name": "نام کاربر 2",
      "phone": "09123456780",
      "email": "user2@example.com",
      "role": "admin"
    }
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

### دریافت کاربر با شناسه (ادمین)
دریافت اطلاعات یک کاربر خاص با شناسه.

**URL:** `GET /users/{userId}`  
**دسترسی:** فقط ادمین  

**هدر های مورد نیاز:**
```
Authorization: Bearer {accessToken}
```

**پارامترهای URL:**
- `userId`: شناسه کاربر مورد نظر

**پاسخ موفق:**
```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0k",
  "name": "نام کاربر",
  "phone": "09123456789",
  "email": "user@example.com",
  "company": "شرکت نمونه",
  "role": "user",
  "verified": true,
  "userType": "real",
  "nationalId": "0123456789",
  "allowedDomains": ["example.com", "localhost"],
  "notificationSettings": {
    "email": true,
    "sms": true
  },
  "createdAt": "2023-01-01T12:00:00.000Z",
  "updatedAt": "2023-01-02T14:30:00.000Z"
}
```

**کدهای خطا:**  
- `401`: دسترسی غیرمجاز  
- `403`: فقط برای ادمین قابل دسترسی است  
- `404`: کاربر یافت نشد  

---

### ایجاد کاربر جدید (ادمین)
ایجاد یک کاربر جدید توسط ادمین.

**URL:** `POST /users`  
**دسترسی:** فقط ادمین  

**هدر های مورد نیاز:**
```
Authorization: Bearer {accessToken}
```

**پارامترهای ارسالی:**
```json
{
  "name": "نام کاربر جدید",
  "phone": "09123456789",
  "email": "newuser@example.com",
  "company": "شرکت جدید",
  "role": "user",
  "userType": "real",
  "nationalId": "0123456789",
  "allowedDomains": ["example.com", "localhost"],
  "notificationSettings": {
    "email": true,
    "sms": true
  }
}
```

**پاسخ موفق:**
```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0m",
  "name": "نام کاربر جدید",
  "phone": "09123456789",
  "email": "newuser@example.com",
  "company": "شرکت جدید",
  "role": "user",
  "verified": false,
  "userType": "real",
  "nationalId": "0123456789",
  "allowedDomains": ["example.com", "localhost"],
  "notificationSettings": {
    "email": true,
    "sms": true
  },
  "createdAt": "2023-01-10T09:45:00.000Z",
  "updatedAt": "2023-01-10T09:45:00.000Z"
}
```

**کدهای خطا:**  
- `400`: اطلاعات نامعتبر  
- `401`: دسترسی غیرمجاز  
- `403`: فقط برای ادمین قابل دسترسی است  

---

### به‌روزرسانی کاربر (ادمین)
به‌روزرسانی اطلاعات یک کاربر خاص توسط ادمین.

**URL:** `PUT /users/{userId}`  
**دسترسی:** فقط ادمین  

**هدر های مورد نیاز:**
```
Authorization: Bearer {accessToken}
```

**پارامترهای URL:**
- `userId`: شناسه کاربر مورد نظر

**پارامترهای ارسالی:**
```json
{
  "name": "نام به‌روزرسانی شده",
  "email": "updated.email@example.com",
  "company": "شرکت به‌روزرسانی شده",
  "role": "admin",
  "userType": "legal",
  "nationalId": "9876543210",
  "notificationSettings": {
    "email": false,
    "sms": true
  }
}
```

**پاسخ موفق:**
```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0k",
  "name": "نام به‌روزرسانی شده",
  "phone": "09123456789",
  "email": "updated.email@example.com",
  "company": "شرکت به‌روزرسانی شده",
  "role": "admin",
  "verified": true,
  "userType": "legal",
  "nationalId": "9876543210",
  "allowedDomains": ["example.com", "localhost"],
  "notificationSettings": {
    "email": false,
    "sms": true
  },
  "createdAt": "2023-01-01T12:00:00.000Z",
  "updatedAt": "2023-01-10T12:30:00.000Z"
}
```

**کدهای خطا:**  
- `400`: اطلاعات نامعتبر  
- `401`: دسترسی غیرمجاز  
- `403`: فقط برای ادمین قابل دسترسی است  
- `404`: کاربر یافت نشد  

---

### به‌روزرسانی دامنه‌های مجاز کاربر (ادمین)
به‌روزرسانی دامنه‌های مجاز کاربر خاص توسط ادمین.

**URL:** `PUT /users/{userId}/domains`  
**دسترسی:** فقط ادمین  

**هدر های مورد نیاز:**
```
Authorization: Bearer {accessToken}
```

**پارامترهای URL:**
- `userId`: شناسه کاربر مورد نظر

**پارامترهای ارسالی:**
```json
{
  "domains": ["example.com", "subdomain.example.com", "new-domain.com"]
}
```

**پاسخ موفق:**
```json
{
  "_id": "60a1b2c3d4e5f6g7h8i9j0k",
  "name": "نام کاربر",
  "allowedDomains": ["example.com", "subdomain.example.com", "new-domain.com"],
  "updatedAt": "2023-01-10T14:20:00.000Z"
}
```

**کدهای خطا:**  
- `401`: دسترسی غیرمجاز  
- `403`: فقط برای ادمین قابل دسترسی است  
- `404`: کاربر یافت نشد  

---

### حذف کاربر (ادمین)
حذف یک کاربر خاص توسط ادمین.

**URL:** `DELETE /users/{userId}`  
**دسترسی:** فقط ادمین  

**هدر های مورد نیاز:**
```
Authorization: Bearer {accessToken}
```

**پارامترهای URL:**
- `userId`: شناسه کاربر مورد نظر

**پاسخ موفق:**
```json
{
  "message": "کاربر با موفقیت حذف شد"
}
```

**کدهای خطا:**  
- `401`: دسترسی غیرمجاز  
- `403`: فقط برای ادمین قابل دسترسی است  
- `404`: کاربر یافت نشد  
