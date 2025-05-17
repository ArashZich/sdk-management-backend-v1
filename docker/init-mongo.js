// docker/init-mongo.js
db = db.getSiblingDB("admin");

// ایجاد کاربر admin در دیتابیس admin
db.createUser({
  user: process.env.MONGO_USERNAME,
  pwd: process.env.MONGO_PASSWORD,
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" },
    { role: "dbAdminAnyDatabase", db: "admin" },
  ],
});

// ایجاد کاربر در دیتابیس اصلی
db = db.getSiblingDB(process.env.MONGO_DB_NAME);
db.createUser({
  user: process.env.MONGO_USERNAME,
  pwd: process.env.MONGO_PASSWORD,
  roles: [
    { role: "readWrite", db: process.env.MONGO_DB_NAME },
    { role: "dbAdmin", db: process.env.MONGO_DB_NAME },
  ],
});
