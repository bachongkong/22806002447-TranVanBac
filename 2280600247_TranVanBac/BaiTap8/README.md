# BaiTap8 — MongoDB Performance Lab

Xử lý dữ liệu lớn với MongoDB: Bulk Insert, Export, Import, Pagination, Seed Data.

## Quick Start

```bash
cd BaiTap8
npm install
cp .env.example .env

# Chạy server
npm run dev

# Chạy tests
npm test

# Seed data (CLI)
npm run seed          # 10,000 records, batch 2500
npm run seed:50k      # 50,000 records
npm run seed:reset    # Xóa toàn bộ seed data
```

## API Endpoints

### Bulk Insert
```bash
# Benchmark tất cả configs
curl -X POST http://localhost:3000/api/bulk/benchmark \
  -H "Content-Type: application/json" \
  -d '{"recordCount": 10000}'

# Bulk insert records
curl -X POST http://localhost:3000/api/bulk/insert \
  -H "Content-Type: application/json" \
  -d '{"records": [...], "batchSize": 2500}'

# Collection stats
curl http://localhost:3000/api/bulk/stats
```

### Export
```bash
# Export JSON (stream)
curl http://localhost:3000/api/export/passengers/json?limit=10000 > export.json

# Export CSV (stream)
curl http://localhost:3000/api/export/passengers/csv?limit=10000 > export.csv

# Aggregation $merge
curl http://localhost:3000/api/export/passengers/merge?stationCode=ST01
```

### Import
```bash
# Import from JSON body
curl -X POST http://localhost:3000/api/import/passengers \
  -H "Content-Type: application/json" \
  -d '{"records": [...], "batchSize": 1000, "onDuplicate": "skip"}'

# Import with upsert
curl -X POST http://localhost:3000/api/import/passengers \
  -H "Content-Type: application/json" \
  -d '{"records": [...], "batchSize": 1000, "onDuplicate": "upsert"}'
```

### Pagination
```bash
# Offset pagination (baseline)
curl "http://localhost:3000/api/passengers?page=1&pageSize=20"

# Cursor pagination (optimized)
curl "http://localhost:3000/api/passengers/cursor?pageSize=20"
curl "http://localhost:3000/api/passengers/cursor?cursor=<nextCursor>&pageSize=20"

# Compare pagination methods
curl "http://localhost:3000/api/pagination/compare?pages=1,10,50,100"
```

### Seed
```bash
# Seed stations
curl -X POST http://localhost:3000/api/bulk/seed/stations

# Seed passengers (10,000 records)
curl -X POST http://localhost:3000/api/bulk/seed/passengers \
  -H "Content-Type: application/json" \
  -d '{"count": 10000, "batchSize": 2500}'

# Reset seed data
curl -X POST http://localhost:3000/api/bulk/seed/reset

# Seed status
curl http://localhost:3000/api/bulk/seed/status
```

## Seed Data CLI

```bash
# Seed 10,000 passengers
node backend/seed/seedScript.js --count=10000 --batch=2500

# Seed 50,000 passengers
node backend/seed/seedScript.js --count=50000 --batch=2500

# Status
node backend/seed/seedScript.js --status

# Reset
node backend/seed/seedScript.js --reset
```

## Benchmarking

Sau khi seed dữ liệu, chạy benchmark:

```bash
# Bulk insert benchmark
curl -X POST http://localhost:3000/api/bulk/benchmark \
  -H "Content-Type: application/json" \
  -d '{"recordCount": 10000}'

# Pagination comparison (cần có 10,000 records)
curl "http://localhost:3000/api/pagination/compare?pages=1,10,50,100,500&pageSize=100"
```

Kết quả benchmark điền vào bảng trong `baitap8.md`.

## Architecture

- **Framework**: Express 5 + Mongoose 9
- **Database**: MongoDB
- **Seed data**: @faker-js/faker + streaming generator pattern
- **Testing**: Jest + mongodb-memory-server + Supertest

## Models

### PassengerRecord
Bản ghi chuyến đi metro với indexes cho:
- `passengerId` (unique)
- `stationCode`
- `tripDate`
- Compound: `{ stationCode, tripDate }`, `{ status, tripDate }`

### Station
Danh sách 10 ga metro (Line 1 + Line 2).
