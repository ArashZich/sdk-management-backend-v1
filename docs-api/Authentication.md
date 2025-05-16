# مستندات API احراز هویت (Authentication)

این بخش شامل API‌های مربوط به احراز هویت و مدیریت دسترسی‌ها می‌باشد.

## پایه URL
```
/api/v1/auth
```

## API های احراز هویت

### درخواست کد تایید (OTP)
درخواست ارسال کد تایید و ورود با OTP.

**URL:** `POST /auth/login/otp`  
**دسترسی:** عمومی  

**پارامترهای ارسالی:**
```json
{
  "phone": "09123456789"
}
```

**پاسخ موفق:**
```json
{
  "message": "کد تأیید با موفقیت ارسال شد",
  "userId": "60a1b2c3d4e5f6g7h8i9j0k"
}
```

**کدهای خطا:**  
- `400`: شماره تلفن نامعتبر است

---

### تایید کد OTP
تایید کد OTP و دریافت توکن.

**URL:** `POST /auth/verify-otp`  
**دسترسی:** عمومی  

**پارامترهای ارسالی:**
```json
{
  "phone": "09123456789",
  "code": "12345"
}
```

**پاسخ موفق:**
```json
{
  "user": {
    "id": "60a1b2c3d4e5f6g7h8i9j0k",
    "name": "نام کاربر",
    "phone": "09123456789",
    "email": "user@example.com",
    "role": "user",
    "verified": true
  },
  "tokens": {
    "access": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires": "2023-07-10T15:30:45.123Z"
    },
    "refresh": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires": "2023-08-10T15:30:45.123Z"
    }
  }
}
```

**کدهای خطا:**  
- `400`: کد تایید نامعتبر است  
- `400`: کد تأیید منقضی شده است  
- `404`: کاربر یافت نشد  

---

### نوسازی توکن
نوسازی توکن دسترسی با استفاده از توکن بازیابی.

**URL:** `POST /auth/refresh-token`  
**دسترسی:** عمومی  

**پارامترهای ارسالی:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**پاسخ موفق:**
```json
{
  "tokens": {
    "access": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires": "2023-07-10T15:30:45.123Z"
    },
    "refresh": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires": "2023-08-10T15:30:45.123Z"
    }
  }
}
```

**کدهای خطا:**  
- `401`: توکن بازیابی نامعتبر است  

---

### خروج از سیستم
خروج از سیستم و غیرفعال سازی توکن بازیابی.

**URL:** `POST /auth/logout`  
**دسترسی:** کاربر وارد شده  

**هدر های مورد نیاز:**
```
Authorization: Bearer {accessToken}
```

**پاسخ موفق:**  
`HTTP 204 No Content`

---

### ورود با OAuth
ورود یا ثبت‌نام با استفاده از سرویس‌های خارجی مانند دیوار.

**URL:** `POST /auth/oauth`  
**دسترسی:** عمومی  

**پارامترهای ارسالی:**
```json
{
  "oauthProvider": "divar",
  "oauthId": "unique_id_from_provider",
  "token": "oauth_provider_token",
  "name": "نام کاربر", // اختیاری
  "email": "user@example.com", // اختیاری
  "phone": "09123456789" // اختیاری
}
```

**پاسخ موفق:**
```json
{
  "user": {
    "id": "60a1b2c3d4e5f6g7h8i9j0k",
    "name": "نام کاربر",
    "phone": "09123456789",
    "email": "user@example.com",
    "role": "user",
    "verified": true
  },
  "tokens": {
    "access": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires": "2023-07-10T15:30:45.123Z"
    },
    "refresh": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires": "2023-08-10T15:30:45.123Z"
    }
  }
}
```

**کدهای خطا:**  
- `401`: احراز هویت ناموفق  
