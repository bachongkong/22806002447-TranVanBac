# Bài Tập 8: MongoDB Performance Lab

> **Yêu cầu**: Nắm vững kỹ thuật xử lý dữ liệu lớn với MongoDB trong hệ thống quản lý vé metro.

---

## PHẦN HƯỚNG DẪN

---

### Bài 0: Chuẩn bị môi trường

#### 0.1. Cài đặt dependencies

```bash
cd c:/Users/bjemtj/Desktop/New folder/1211060327-buimanhtoan/BaiTap8
npm install
```

#### 0.2. Tạo file môi trường

```bash
cp .env.example .env
```

Kiểm tra `.env`:

```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/metroticket_bulk
NODE_ENV=development
```

#### 0.3. Kiểm tra MongoDB đang chạy

```bash
mongosh mongodb://127.0.0.1:27017/metroticket_bulk
> db.adminCommand('ping')
```

Kết quả mong đợi: `{ ok: 1 }`

#### 0.4. Khởi động server

```bash
npm run dev
```

Kết quả mong đợi:

```
BaiTap8 Server running at http://localhost:3000
Health: http://localhost:3000/health
```

#### 0.5. Verify server

```bash
curl http://localhost:3000/health
```

Kết quả: `{"success":true,"message":"ok"}`

#### 0.6. Seed dữ liệu

Tạo 10,000 bản ghi PassengerRecord để test:

```bash
node backend/seed/seedScript.js --count=10000 --batch=2500
```

Kết quả mong đợi:

```
[Seed] Stations seeded: 10 records
[Seed] Progress: 10000/10000 (100%)
[Seed] Passengers seeded: 10000 records
[Stats] Total time:  XXX ms
[Stats] Records/sec: XXXX
```

Kiểm tra:

```bash
curl http://localhost:3000/api/bulk/stats
```

Kết quả mong đợi:

```json
{
  "success": true,
  "data": {
    "documentCount": 10000,
    "indexes": [...]
  }
}
```

---

### Bài 1: Vấn đề — Bulk Insert chậm

#### 1.1. Mô tả

**Vấn đề:** Chèn nhiều bản ghi bằng vòng `for` + `insert()` đơn lẻ rất chậm. Mỗi lần gọi `insert()` là một network round-trip riêng biệt tới MongoDB server.

#### 1.2. Demo — Cách chậm

Tạo file `test-slow-insert.js`:

```javascript
const mongoose = require('mongoose');
require('./backend/src/models/passengerRecord.model');
const Record = mongoose.model('PassengerRecord');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/metroticket_bulk').then(async () => {
  await Record.deleteMany({});

  // CÁCH CHẬM: insert từng record
  const start = Date.now();
  for (let i = 0; i < 200; i++) {
    await Record.create({
      passengerId: 'P-SLOW-' + i,
      passengerName: 'Test User ' + i,
      stationCode: 'ST01',
      entryStation: 'Station A',
      exitStation: 'Station B',
      tripDate: new Date(),
      fare: 10,
      paymentMethod: 'card',
      status: 'completed'
    });
  }
  const slowTime = Date.now() - start;
  console.log('SLOW (insert 200 records one-by-one): ' + slowTime + 'ms');
  console.log('Speed: ' + Math.round(200 / (slowTime / 1000)) + ' records/sec');
  await mongoose.disconnect();
});
```

```bash
node test-slow-insert.js
```

Kết quả mong đợi:

```
SLOW (insert 200 records one-by-one): XXXXms
Speed: XX records/sec
```

> **Quan sát:** Insert từng record rất chậm. Scale lên 1 triệu records → rất lâu!

#### 1.3. Fix — Cách nhanh

Tạo file `test-fast-insert.js`:

```javascript
const mongoose = require('mongoose');
require('./backend/src/models/passengerRecord.model');
const Record = mongoose.model('PassengerRecord');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/metroticket_bulk').then(async () => {
  await Record.deleteMany({});

  // CÁCH NHANH: insertMany với batch size lớn
  const start = Date.now();
  const docs = [];
  for (let i = 0; i < 200; i++) {
    docs.push({
      passengerId: 'P-FAST-' + i,
      passengerName: 'Test User ' + i,
      stationCode: 'ST01',
      entryStation: 'Station A',
      exitStation: 'Station B',
      tripDate: new Date(),
      fare: 10,
      paymentMethod: 'card',
      status: 'completed'
    });
  }
  await Record.insertMany(docs, { batchSize: 200 });
  const fastTime = Date.now() - start;
  console.log('FAST (insertMany 200 records): ' + fastTime + 'ms');
  console.log('Speed: ' + Math.round(200 / (fastTime / 1000)) + ' records/sec');
  await mongoose.disconnect();
});
```

```bash
node test-fast-insert.js
```

Kết quả mong đợi:

```
FAST (insertMany 200 records): XXms
Speed: XXXX records/sec
```

#### 1.4. So sánh

| Phương pháp | Thời gian (200 records) | Tốc độ | Ghi chú |
|-------------|------------------------|--------|---------|
| insert() đơn lẻ | ? ms | ? rec/s | Chậm |
| insertMany(200) | ? ms | ? rec/s | Nhanh |

**Cải thiện: X lần nhanh hơn**

#### 1.5. Benchmark qua API

```bash
curl -X POST http://localhost:3000/api/bulk/benchmark \
  -H "Content-Type: application/json" \
  -d '{"recordCount": 5000}'
```

Điền kết quả vào bảng:

| Config | Batch | Write Concern | Ordered | Time (ms) | Records/sec |
|--------|-------|---------------|---------|-----------|-------------|
| A | 100 | w:1 | true | ? | ? |
| B | 500 | w:1 | true | ? | ? |
| C | 1000 | w:1 | true | ? | ? |
| D | 2500 | w:1 | true | ? | ? |
| E | 5000 | w:1 | true | ? | ? |
| F | 2500 | w:0 | true | ? | ? |
| G | 2500 | w:1 | false | ? | ? |

---

### Bài 2: Vấn đề — Import duplicate key

#### 2.1. Mô tả

**Vấn đề:** Khi import 2 batch trùng `passengerId`, lần insert thứ 2 sẽ bị lỗi duplicate key. Mặc định, lỗi này sẽ DỪNG TOÀN BỘ batch insert.

#### 2.2. Demo — Cách sai

Tạo file `test-slow-import.js`:

```javascript
const mongoose = require('mongoose');
require('./backend/src/models/passengerRecord.model');
const Record = mongoose.model('PassengerRecord');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/metroticket_bulk').then(async () => {
  await Record.deleteMany({});

  const batch1 = [
    { passengerId: 'P001', passengerName: 'User 1', stationCode: 'ST01', entryStation: 'A', exitStation: 'B', tripDate: new Date(), fare: 10, paymentMethod: 'card', status: 'completed' },
    { passengerId: 'P002', passengerName: 'User 2', stationCode: 'ST01', entryStation: 'A', exitStation: 'B', tripDate: new Date(), fare: 10, paymentMethod: 'card', status: 'completed' },
  ];
  const batch2 = [
    { passengerId: 'P001', passengerName: 'User 1 Updated', stationCode: 'ST02', entryStation: 'C', exitStation: 'D', tripDate: new Date(), fare: 15, paymentMethod: 'cash', status: 'completed' }, // DUPLICATE!
    { passengerId: 'P003', passengerName: 'User 3', stationCode: 'ST01', entryStation: 'A', exitStation: 'B', tripDate: new Date(), fare: 10, paymentMethod: 'card', status: 'completed' },
  ];

  console.log('=== Batch 1 (2 records) ===');
  const r1 = await Record.insertMany(batch1, { ordered: true });
  console.log('Inserted: ' + r1.length);

  console.log('=== Batch 2 (P001 is DUPLICATE) ===');
  try {
    const r2 = await Record.insertMany(batch2, { ordered: true });
    console.log('Inserted: ' + r2.length);
  } catch (err) {
    console.log('ERROR: ' + err.message);
    console.log('FAILED - ordered:true dừng cả batch!');
  }

  const count = await Record.countDocuments();
  console.log('Total in DB: ' + count);

  await mongoose.disconnect();
});
```

```bash
node test-slow-import.js
```

Kết quả mong đợi:

```
=== Batch 1 (2 records) ===
Inserted: 2
=== Batch 2 (P001 is DUPLICATE) ===
ERROR: E11000 duplicate key error...
FAILED - ordered:true dừng cả batch!
Total in DB: 2
```

> **Quan sát:** P003 hợp lệ nhưng bị mất do batch bị dừng!

#### 2.3. Fix 1 — ordered:false + xử lý writeErrors

```bash
curl -X POST http://localhost:3000/api/import/passengers \
  -H "Content-Type: application/json" \
  -d '{
    "records": [
      {"passengerId":"P001","passengerName":"User 1","stationCode":"ST01","entryStation":"A","exitStation":"B","tripDate":"2026-03-25","fare":10,"paymentMethod":"card","status":"completed"},
      {"passengerId":"P002","passengerName":"User 2","stationCode":"ST01","entryStation":"A","exitStation":"B","tripDate":"2026-03-25","fare":10,"paymentMethod":"card","status":"completed"}
    ],
    "batchSize": 100,
    "onDuplicate": "skip"
  }'
```

Kết quả mong đợi:

```json
{
  "success": true,
  "data": {
    "total": 2,
    "inserted": 2,
    "skipped": 0,
    "elapsedMs": XX
  }
}
```

#### 2.4. Fix 2 — upsert mode

```bash
curl -X POST http://localhost:3000/api/import/passengers \
  -H "Content-Type: application/json" \
  -d '{
    "records": [
      {"passengerId":"P001","passengerName":"User 1","stationCode":"ST01","entryStation":"A","exitStation":"B","tripDate":"2026-03-25","fare":10,"paymentMethod":"card","status":"completed"},
      {"passengerId":"P002","passengerName":"User 2","stationCode":"ST01","entryStation":"A","exitStation":"B","tripDate":"2026-03-25","fare":10,"paymentMethod":"card","status":"completed"}
    ],
    "batchSize": 100,
    "onDuplicate": "upsert"
  }'
```

Kết quả mong đợi:

```json
{
  "success": true,
  "data": {
    "total": 2,
    "inserted": 2,
    "upserted": 2,
    "elapsedMs": XX
  }
}
```

---

### Bài 3: Vấn đề — Export load all RAM

#### 3.1. Mô tả

**Vấn đề:** Khi export dữ liệu lớn, nếu dùng `await Model.find({})`, MongoDB driver sẽ load TOÀN BỘ kết quả vào RAM. Với dataset lớn, server có thể crash vì hết memory.

#### 3.2. Demo — Cách chậm

Tạo file `test-slow-export.js`:

```javascript
const mongoose = require('mongoose');
require('./backend/src/models/passengerRecord.model');
const Record = mongoose.model('PassengerRecord');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/metroticket_bulk').then(async () => {
  const memBefore = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log('Memory before: ' + memBefore.toFixed(2) + ' MB');

  // CÁCH CHẬM: load all vào RAM
  const start = Date.now();
  const all = await Record.find({}).limit(5000).lean();
  const peakMem = process.memoryUsage().heapUsed / 1024 / 1024;
  const elapsed = Date.now() - start;

  console.log('Memory after (all loaded): ' + peakMem.toFixed(2) + ' MB');
  console.log('Delta: ' + (peakMem - memBefore).toFixed(2) + ' MB');
  console.log('Time: ' + elapsed + 'ms');
  console.log('Records loaded: ' + all.length);

  await mongoose.disconnect();
});
```

```bash
node test-slow-export.js
```

Kết quả mong đợi:

```
Memory before: XX.XX MB
Memory after (all loaded): XX.XX MB
Delta: XX.XX MB
Time: XXXms
Records loaded: 5000
```

> **Quan sát:** 5,000 records tiêu tốn ~XX MB RAM. 100,000 records sẽ tiêu tốn nhiều hơn → crash!

#### 3.3. Fix — Cursor stream

Tạo file `test-fast-export.js`:

```javascript
const mongoose = require('mongoose');
require('./backend/src/models/passengerRecord.model');
const Record = mongoose.model('PassengerRecord');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/metroticket_bulk').then(async () => {
  const memBefore = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log('Memory before: ' + memBefore.toFixed(2) + ' MB');

  // CÁCH NHANH: dùng cursor stream
  const start = Date.now();
  let count = 0;
  let peakMem = memBefore;

  const cursor = Record.find({}).limit(5000).lean().cursor({ batchSize: 500 });

  for await (const doc of cursor) {
    count++;
    const currentMem = process.memoryUsage().heapUsed / 1024 / 1024;
    if (currentMem > peakMem) peakMem = currentMem;
  }

  const elapsed = Date.now() - start;
  console.log('Memory peak (stream): ' + peakMem.toFixed(2) + ' MB');
  console.log('Delta: ' + (peakMem - memBefore).toFixed(2) + ' MB');
  console.log('Time: ' + elapsed + 'ms');
  console.log('Records processed: ' + count);

  await mongoose.disconnect();
});
```

```bash
node test-fast-export.js
```

Kết quả mong đợi:

```
Memory before: XX.XX MB
Memory peak (stream): XX.XX MB
Delta: XX.XX MB
Time: XXXms
Records processed: 5000
```

#### 3.4. So sánh

| Phương pháp | Memory Delta | Ghi chú |
|-------------|-------------|---------|
| Load all (`find({})`) | ? MB | Có thể crash khi lớn |
| Cursor stream | ? MB | Ổn định |

**Cải thiện memory: X lần ít hơn**

#### 3.5. Test export endpoints

```bash
# Export JSON (stream)
curl "http://localhost:3000/api/export/passengers/json?limit=1000" -o export.json

# Export CSV (stream)
curl "http://localhost:3000/api/export/passengers/csv?limit=1000" -o export.csv

# Export với filter
curl "http://localhost:3000/api/export/passengers/json?stationCode=ST01&limit=100" -o filtered.json

# Aggregation $merge
curl "http://localhost:3000/api/export/passengers/merge"
```

Kiểm tra file export:

```bash
wc -l export.json export.csv
head -5 export.csv
```

---

### Bài 4: Vấn đề — Pagination chậm với skip()

#### 4.1. Mô tả

**Vấn đề:** `skip(5000)` buộc MongoDB phải SCAN qua 5000 documents để bỏ qua, sau đó mới lấy 100 records tiếp theo. Trang càng sau, thời gian càng lâu.

#### 4.2. Demo — Cách chậm (offset pagination)

Tạo file `test-slow-pagination.js`:

```javascript
const mongoose = require('mongoose');
require('./backend/src/models/passengerRecord.model');
const Record = mongoose.model('PassengerRecord');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/metroticket_bulk').then(async () => {
  const pageSize = 100;
  const pages = [1, 10, 50, 100];

  console.log('OFFSET-BASED PAGINATION (skip/limit):');
  for (const page of pages) {
    const start = Date.now();
    const results = await Record.find({})
      .sort({ _id: 1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();
    const elapsed = Date.now() - start;
    console.log('  Page ' + page + ': ' + elapsed + 'ms (skipped ' + ((page-1)*pageSize) + ' docs)');
  }

  await mongoose.disconnect();
});
```

```bash
node test-slow-pagination.js
```

Kết quả mong đợi:

```
OFFSET-BASED PAGINATION (skip/limit):
  Page 1: XXms (skipped 0 docs)
  Page 10: XXms (skipped 900 docs)
  Page 50: XXms (skipped 4900 docs)
  Page 100: XXms (skipped 9900 docs)
```

> **Quan sát:** Trang càng lớn, thời gian càng tăng nhanh!

#### 4.3. Fix — Cursor-based pagination

Tạo file `test-fast-pagination.js`:

```javascript
const mongoose = require('mongoose');
require('./backend/src/models/passengerRecord.model');
const Record = mongoose.model('PassengerRecord');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/metroticket_bulk').then(async () => {
  const pageSize = 100;
  const totalPages = 100;

  console.log('CURSOR-BASED PAGINATION (_id gt):');

  let lastId = null;
  for (let page = 1; page <= totalPages; page++) {
    const query = lastId ? { _id: { $gt: lastId } } : {};
    const start = Date.now();
    const results = await Record.find(query)
      .sort({ _id: 1 })
      .limit(pageSize)
      .lean();
    const elapsed = Date.now() - start;
    if (page <= 10 || page === 50 || page === 100) {
      console.log('  Page ' + page + ': ' + elapsed + 'ms');
    }
    lastId = results.length > 0 ? results[results.length - 1]._id : null;
  }

  await mongoose.disconnect();
});
```

```bash
node test-fast-pagination.js
```

Kết quả mong đợi:

```
CURSOR-BASED PAGINATION (_id gt):
  Page 1: XXms
  Page 2: XXms
  ...
  Page 50: XXms
  ...
  Page 100: XXms
```

#### 4.4. So sánh

| Method   | Page 1 | Page 10 | Page 50 | Page 100 |
|----------|--------|---------|---------|----------|
| Offset   | ? ms   | ? ms    | ? ms    | ? ms     |
| Cursor   | ? ms   | ? ms    | ? ms    | ? ms     |

**Cải thiện trang 100: X lần nhanh hơn**

#### 4.5. Test qua API

```bash
# Offset pagination
curl "http://localhost:3000/api/passengers?page=1&pageSize=20"

# Cursor pagination
curl "http://localhost:3000/api/passengers/cursor?pageSize=20"

# Compare
curl "http://localhost:3000/api/pagination/compare?pages=1,10,50,100&pageSize=100"
```

---

### Bài 5: Benchmark tổng hợp

```bash
# Seed status
curl http://localhost:3000/api/bulk/seed/status

# Benchmark
curl -X POST http://localhost:3000/api/bulk/benchmark \
  -H "Content-Type: application/json" \
  -d '{"recordCount": 10000}'

# Pagination compare
curl "http://localhost:3000/api/pagination/compare?pages=1,10,50,100,500&pageSize=100"
```

---

### Bài 6: Dọn dẹp

```bash
node backend/seed/seedScript.js --reset
# Hoặc
curl -X POST http://localhost:3000/api/bulk/seed/reset
```

---

### Câu hỏi lý thuyết

Viết câu trả lời vào thư mục `answers/`:

**Bài 1 — Bulk Insert:**

1. `insertMany` vs `bulkWrite`: khác nhau thế nào?
2. Tại sao chia nhỏ batch?
3. `ordered: false` có tác dụng gì?
4. So sánh `writeConcern w:0`, `w:1`, `w:"majority"`.
5. Index ảnh hưởng thế nào đến bulk insert?

**Bài 2 — Import:**

1. `mongoimport` có những options nào để tăng tốc import?
2. Làm sao xử lý duplicate key error?
3. Pre-validation vs post-insert error handling khác nhau thế nào?
4. Khi nào nên dùng `upsert` thay vì `insert`?
5. Progress tracking trong bulk import cài đặt thế nào?

**Bài 3 — Export:**

1. Tại sao không nên load toàn bộ vào RAM?
2. `batchSize` trên cursor ảnh hưởng thế nào?
3. `$out` vs `$merge` khác nhau thế nào?
4. Stream-based export hoạt động ra sao?
5. JSON streaming vs CSV: ưu/nhược điểm?

**Bài 4 — Pagination:**

1. Tại sao `skip()` chậm với dataset lớn?
2. Cursor-based pagination hoạt động thế nào?
3. Streaming response cho download lớn khác gì response thông thường?
4. Compound sort `{ date: -1, _id: 1 }` dùng khi nào?
5. SSE có thể dùng để streaming data không?

---

## PHẦN API REFERENCE

### Seed Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/bulk/seed/stations | Seed 10 stations |
| POST | /api/bulk/seed/passengers | Seed N passenger records |
| POST | /api/bulk/seed/reset | Xóa toàn bộ seed data |
| GET | /api/bulk/seed/status | Trạng thái seed |

### Bulk Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/bulk/insert | Bulk insert records |
| POST | /api/bulk/benchmark | Run performance benchmark |
| GET | /api/bulk/stats | Collection statistics |

### Export Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/export/passengers/json | Export JSON (stream) |
| GET | /api/export/passengers/csv | Export CSV (stream) |
| GET | /api/export/passengers/merge | Aggregation $merge |

### Import Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/import/passengers | Import from JSON body |

### Pagination Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/passengers | List (offset pagination) |
| GET | /api/passengers/cursor | List (cursor pagination) |
| GET | /api/passengers/download | Stream download all |
| GET | /api/pagination/compare | Compare pagination methods |

---

## Lỗi thường gặp

### Lỗi 1: `MongoNetworkError: connect ECONNREFUSED`

**Nguyên nhân:** MongoDB server không chạy.

```bash
# Windows
net start MongoDB
```

### Lỗi 2: `E11000 duplicate key error`

**Nguyên nhân:** Đang cố insert passengerId đã tồn tại.

```bash
# Reset seed data
curl -X POST http://localhost:3000/api/bulk/seed/reset
```

### Lỗi 3: Server không khởi động được

```bash
mongosh mongodb://127.0.0.1:27017/metroticket_bulk
> db.adminCommand('ping')
```

### Lỗi 4: `mongoimport` không hoạt động

Cài MongoDB Database Tools từ https://www.mongodb.com/database-tools hoặc dùng API import thay thế.

---

## Tài liệu tham khảo

- [MongoDB Bulk Operations](https://www.mongodb.com/docs/manual/reference/method/Bulk/)
- [MongoDB Insert Documents](https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/)
- [MongoDB Cursor Methods](https://www.mongodb.com/docs/manual/reference/method/cursor/)
- [MongoDB $merge](https://www.mongodb.com/docs/manual/reference/operator/aggregation/merge/)
- [Node.js Streams](https://nodejs.org/api/stream.html)
- [mongoimport](https://www.mongodb.com/docs/database-tools/mongoimport/)
- [Faker.js](https://fakerjs.dev/)
- [Mongoose Documents](https://mongoosejs.com/docs/documents.html)
