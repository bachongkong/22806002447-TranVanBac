"use strict";

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { faker } = require("@faker-js/faker");

let mongoServer;
let app;

const PassengerRecord = require("../backend/src/models/passengerRecord.model");
const Station = require("../backend/src/models/station.model");
const bulkRoutes = require("../backend/src/routes/bulk.routes");

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create unique index synchronously (before any documents) to avoid disk space issues
  try {
    await PassengerRecord.collection.createIndex(
      { passengerId: 1 },
      { unique: true }
    );
  } catch (e) {
    // May fail in constrained environments
  }

  app = require("../backend/src/app");
  app.use("/api/bulk", bulkRoutes);
  app.use("/api", bulkRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Promise.all([
    PassengerRecord.deleteMany({}),
    Station.deleteMany({}),
  ]);
  try {
    await PassengerRecord.db.db.collection("station_summary").deleteMany({});
  } catch (_) {}
});

// ============================================================
// PART 1: BULK INSERT
// ============================================================

describe("Part 1: Bulk Insert / Upload", () => {
  test("POST /api/bulk/insert inserts records successfully", async () => {
    const records = Array.from({ length: 100 }, (_, i) => ({
      passengerId: `test-pax-${i}-${Date.now()}`,
      passengerName: `Test Passenger ${i}`,
      stationCode: "ST01",
      entryStation: "ST01",
      exitStation: "ST02",
      tripDate: new Date(),
      fare: 15.0,
      paymentMethod: "card",
      status: "completed",
    }));

    const res = await request(app)
      .post("/api/bulk/insert")
      .send({ records, batchSize: 50, writeConcern: "w:1", ordered: true });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.inserted).toBe(100);
    expect(res.body.data.elapsedMs).toBeGreaterThan(0);
  });

  test("POST /api/bulk/insert handles duplicate keys with ordered:false", async () => {
    // First batch: IDs 0-49
    const firstBatch = Array.from({ length: 50 }, (_, i) => ({
      passengerId: `dup-pax-${i}`,
      passengerName: `Test ${i}`,
      stationCode: "ST01",
      entryStation: "ST01",
      exitStation: "ST02",
      tripDate: new Date(),
      fare: 15.0,
      paymentMethod: "card",
      status: "completed",
    }));

    // Second batch: IDs 0-29 (duplicates) + IDs 50-69 (20 new records)
    const secondBatch = [
      // First 30: duplicates (IDs 0-29)
      ...Array.from({ length: 30 }, (_, i) => ({
        passengerId: `dup-pax-${i}`,
        passengerName: `Dup ${i}`,
        stationCode: "ST01",
        entryStation: "ST01",
        exitStation: "ST02",
        tripDate: new Date(),
        fare: 15.0,
        paymentMethod: "card",
        status: "completed",
      })),
      // Last 20: new (IDs 50-69)
      ...Array.from({ length: 20 }, (_, i) => ({
        passengerId: `dup-pax-new-${i}`,
        passengerName: `New ${i}`,
        stationCode: "ST02",
        entryStation: "ST01",
        exitStation: "ST02",
        tripDate: new Date(),
        fare: 20.0,
        paymentMethod: "card",
        status: "completed",
      })),
    ];

    // Insert first batch
    await request(app)
      .post("/api/bulk/insert")
      .send({ records: firstBatch, batchSize: 50 });

    // Insert second batch with ordered:false
    // Expected: 20 new inserted, 30 duplicates failed
    const res = await request(app)
      .post("/api/bulk/insert")
      .send({ records: secondBatch, batchSize: 50, ordered: false });

    expect(res.status).toBe(200);
    expect(res.body.data.inserted).toBe(20);
    expect(res.body.data.failed).toBe(30);
  });

  test("GET /api/bulk/stats returns collection statistics", async () => {
    // Seed some data
    await PassengerRecord.insertMany(
      Array.from({ length: 20 }, (_, i) => ({
        passengerId: `stats-pax-${i}`,
        passengerName: `Pax ${i}`,
        stationCode: "ST01",
        entryStation: "ST01",
        exitStation: "ST02",
        tripDate: new Date(),
        fare: 15,
        paymentMethod: "card",
        status: "completed",
      }))
    );

    const res = await request(app).get("/api/bulk/stats");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.documentCount).toBe(20);
    expect(res.body.data.indexes).toBeDefined();
  });
});

// ============================================================
// PART 2: EXPORT
// ============================================================

describe("Part 2: Export Large Data", () => {
  beforeEach(async () => {
    // Seed 200 records for export tests
    await PassengerRecord.insertMany(
      Array.from({ length: 200 }, (_, i) => ({
        passengerId: `export-pax-${i}`,
        passengerName: `Export Pax ${i}`,
        stationCode: i % 2 === 0 ? "ST01" : "ST02",
        entryStation: "ST01",
        exitStation: "ST02",
        tripDate: new Date(),
        fare: 15,
        paymentMethod: "card",
        status: "completed",
      }))
    );
  });

  test("GET /api/export/passengers/json exports JSON stream", async () => {
    const res = await request(app)
      .get("/api/export/passengers/json")
      .query({ limit: 100 });

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("application/json");
    expect(res.headers["content-disposition"]).toContain("passengers.json");
    // Check JSON structure
    const body = res.text;
    expect(body.trim().startsWith("[")).toBe(true);
    expect(body.trim().endsWith("]")).toBe(true);
    const parsed = JSON.parse(body);
    expect(parsed.length).toBeLessThanOrEqual(100);
  });

  test("GET /api/export/passengers/csv exports CSV stream", async () => {
    const res = await request(app)
      .get("/api/export/passengers/csv")
      .query({ limit: 50 });

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/csv");
    expect(res.headers["content-disposition"]).toContain("passengers.csv");
    const lines = res.text.trim().split("\n");
    expect(lines[0]).toBe("passengerId,passengerName,stationCode,entryStation,exitStation,tripDate,fare,paymentMethod,status");
    expect(lines.length).toBeGreaterThan(1);
  });

  test("GET /api/export/passengers/merge runs aggregation", async () => {
    const res = await request(app)
      .get("/api/export/passengers/merge");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.outputCollection).toBe("station_summary");
  });
});

// ============================================================
// PART 3: IMPORT
// ============================================================

describe("Part 3: Import Large Data", () => {
  test("POST /api/import/passengers imports records with skip duplicates", async () => {
    const records = Array.from({ length: 100 }, (_, i) => ({
      passengerId: `import-pax-${i}`,
      passengerName: `Import Pax ${i}`,
      stationCode: "ST01",
      entryStation: "ST01",
      exitStation: "ST02",
      tripDate: new Date(),
      fare: 15,
      paymentMethod: "card",
      status: "completed",
    }));

    const res = await request(app)
      .post("/api/import/passengers")
      .send({ records, batchSize: 50, onDuplicate: "skip" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.inserted).toBe(100);
    expect(res.body.data.skipped).toBe(0);
  });

  test("POST /api/import/passengers skips duplicates correctly", async () => {
    const records = Array.from({ length: 50 }, (_, i) => ({
      passengerId: `imp-dup-test-${i}`,
      passengerName: `Imp Dup ${i}`,
      stationCode: "ST01",
      entryStation: "ST01",
      exitStation: "ST02",
      tripDate: new Date(),
      fare: 15,
      paymentMethod: "card",
      status: "completed",
    }));

    // First import
    await request(app)
      .post("/api/import/passengers")
      .send({ records, batchSize: 50 });

    // Second import with same IDs (same array reference = same IDs)
    const res = await request(app)
      .post("/api/import/passengers")
      .send({ records, batchSize: 50, onDuplicate: "skip" });

    expect(res.body.data.inserted).toBe(0);
    expect(res.body.data.skipped).toBe(50);
  });

  test("POST /api/import/passengers upsert mode works", async () => {
    const records = Array.from({ length: 50 }, (_, i) => ({
      passengerId: `upsert-pax-${i}`,
      passengerName: `Upsert Pax ${i}`,
      stationCode: "ST01",
      entryStation: "ST01",
      exitStation: "ST02",
      tripDate: new Date(),
      fare: 15,
      paymentMethod: "card",
      status: "completed",
    }));

    // First import
    const r1 = await request(app)
      .post("/api/import/passengers")
      .send({ records, batchSize: 50, onDuplicate: "upsert" });
    expect(r1.body.data.upserted).toBe(50);

    // Second import — should update (upsert)
    const updated = records.map((r) => ({ ...r, fare: 25 }));
    const r2 = await request(app)
      .post("/api/import/passengers")
      .send({ records: updated, batchSize: 50, onDuplicate: "upsert" });
    expect(r2.body.data.upserted).toBe(0);
    expect(r2.body.data.inserted).toBe(50);

    // Verify updated fare
    const count = await PassengerRecord.countDocuments({ fare: 25 });
    expect(count).toBe(50);
  });
});

// ============================================================
// PART 4: PAGINATION & DOWNLOAD
// ============================================================

describe("Part 4: Pagination & Download", () => {
  beforeEach(async () => {
    await PassengerRecord.insertMany(
      Array.from({ length: 250 }, (_, i) => ({
        passengerId: `pager-pax-${i}`,
        passengerName: `Pager Pax ${i}`,
        stationCode: i % 3 === 0 ? "ST01" : i % 3 === 1 ? "ST02" : "ST03",
        entryStation: "ST01",
        exitStation: "ST02",
        tripDate: new Date(2025, 0, 1 + (i % 30)),
        fare: 15,
        paymentMethod: "card",
        status: i % 5 === 0 ? "cancelled" : "completed",
      }))
    );
  });

  test("GET /api/passengers uses offset pagination", async () => {
    const res = await request(app)
      .get("/api/passengers")
      .query({ page: 1, pageSize: 20 });

    expect(res.status).toBe(200);
    expect(res.body.data.data).toHaveLength(20);
    expect(res.body.data.pagination.page).toBe(1);
    expect(res.body.data.pagination.total).toBe(250);
    expect(res.body.data.pagination.totalPages).toBe(13);
  });

  test("GET /api/passengers filters work correctly", async () => {
    const res = await request(app)
      .get("/api/passengers")
      .query({ stationCode: "ST01", pageSize: 50 });

    expect(res.status).toBe(200);
    const allStation1 = res.body.data.data.every(
      (p) => p.stationCode === "ST01"
    );
    expect(allStation1).toBe(true);
  });

  test("GET /api/passengers/cursor uses cursor-based pagination", async () => {
    // Get first page
    const r1 = await request(app)
      .get("/api/passengers/cursor")
      .query({ pageSize: 20 });

    expect(r1.status).toBe(200);
    expect(r1.body.data.data).toHaveLength(20);
    expect(r1.body.data.pagination.method).toBe("cursor");

    // Get next page using cursor
    const r2 = await request(app)
      .get("/api/passengers/cursor")
      .query({ cursor: r1.body.data.pagination.nextCursor, pageSize: 20 });

    expect(r2.status).toBe(200);
    expect(r2.body.data.data.length).toBeGreaterThan(0);

    // Verify no overlap
    const ids1 = r1.body.data.data.map((p) => p._id);
    const ids2 = r2.body.data.data.map((p) => p._id);
    const overlap = ids1.filter((id) => ids2.includes(id));
    expect(overlap.length).toBe(0);
  });

  test("GET /api/passengers/download streams JSON download", async () => {
    const res = await request(app)
      .get("/api/passengers/download")
      .query({ format: "json" });

    expect(res.status).toBe(200);
    expect(res.headers["content-disposition"]).toContain("passengers.json");
    const parsed = JSON.parse(res.text);
    expect(parsed.length).toBe(250);
  });

  test("GET /api/passengers/download streams CSV download", async () => {
    const res = await request(app)
      .get("/api/passengers/download")
      .query({ format: "csv", stationCode: "ST01" });

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/csv");
    const lines = res.text.trim().split("\n");
    // 1 header + data rows (filtered to ST01 = ~83 records)
    expect(lines.length).toBeGreaterThan(1);
    expect(lines[1]).toContain("ST01");
  });

  test("GET /api/pagination/compare compares offset vs cursor", async () => {
    const res = await request(app)
      .get("/api/pagination/compare")
      .query({ pages: "1,10,50", pageSize: 10 });

    expect(res.status).toBe(200);
    expect(res.body.data.results).toHaveLength(3);
    for (const r of res.body.data.results) {
      expect(r.page).toBeDefined();
      expect(r.offset).toBeDefined();
      expect(r.cursor).toBeDefined();
      expect(r.offset.timeMs).toBeGreaterThanOrEqual(0);
    }
  });
});

// ============================================================
// PART 5: SEED DATA
// ============================================================

describe("Part 5: Seed Data", () => {
  test("POST /api/bulk/seed/stations seeds 10 stations", async () => {
    const res = await request(app)
      .post("/api/bulk/seed/stations");

    expect(res.status).toBe(200);
    expect(res.body.data.count).toBe(10);

    // Verify idempotent
    const r2 = await request(app).post("/api/bulk/seed/stations");
    expect(r2.body.data.count).toBe(10);
  });

  test("POST /api/bulk/seed/passengers seeds records with generator pattern", async () => {
    const res = await request(app)
      .post("/api/bulk/seed/passengers")
      .send({ count: 500, batchSize: 100 });

    expect(res.status).toBe(200);
    expect(res.body.data.totalInserted).toBe(500);
    expect(res.body.data.elapsedMs).toBeGreaterThan(0);
    expect(res.body.data.recordsPerSec).toBeGreaterThan(0);

    // Verify data actually inserted
    const count = await PassengerRecord.countDocuments();
    expect(count).toBe(500);
  });

  test("POST /api/bulk/seed/reset clears data", async () => {
    // Seed some data first
    await PassengerRecord.insertMany(
      Array.from({ length: 10 }, (_, i) => ({
        passengerId: `reset-pax-${i}`,
        passengerName: `Reset ${i}`,
        stationCode: "ST01",
        entryStation: "ST01",
        exitStation: "ST02",
        tripDate: new Date(),
        fare: 15,
        paymentMethod: "card",
        status: "completed",
      }))
    );

    const res = await request(app)
      .post("/api/bulk/seed/reset");

    expect(res.status).toBe(200);
    const count = await PassengerRecord.countDocuments();
    expect(count).toBe(0);
  });

  test("GET /api/bulk/seed/status returns counts", async () => {
    await PassengerRecord.insertMany(
      Array.from({ length: 30 }, (_, i) => ({
        passengerId: `status-pax-${i}`,
        passengerName: `Status ${i}`,
        stationCode: "ST01",
        entryStation: "ST01",
        exitStation: "ST02",
        tripDate: new Date(),
        fare: 15,
        paymentMethod: "card",
        status: "completed",
      }))
    );
    await Station.insertMany([
      { stationCode: "ST01", stationName: "Ben Thanh", line: "Line1", zone: 1, isActive: true },
    ]);

    const res = await request(app).get("/api/bulk/seed/status");

    expect(res.status).toBe(200);
    expect(res.body.data.passengerRecords).toBe(30);
    expect(res.body.data.stations).toBe(1);
  });

  test("POST /api/bulk/benchmark runs benchmark suite", async () => {
    const res = await request(app)
      .post("/api/bulk/benchmark")
      .send({ recordCount: 1000, configs: [
        { batchSize: 100, writeConcern: "w:1", ordered: true },
        { batchSize: 500, writeConcern: "w:1", ordered: true },
      ]});

    expect(res.status).toBe(200);
    expect(res.body.data.results).toHaveLength(2);
    for (const r of res.body.data.results) {
      expect(r.elapsedMs).toBeGreaterThan(0);
      expect(r.recordsPerSec).toBeGreaterThan(0);
    }
  });
});
