FROM node:18-alpine

WORKDIR /app

# کپی فایل‌های package.json و package-lock.json
COPY package*.json ./
RUN npm install

# کپی کل پروژه
COPY . .

# ایجاد پوشه لاگ
RUN mkdir -p logs

# نمایان کردن پورت
EXPOSE ${PORT}

# دستور اجرا
CMD ["npm", "start"]