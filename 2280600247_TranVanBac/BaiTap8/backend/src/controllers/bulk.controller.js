"use strict";

const mongoose = require("mongoose");
const PassengerRecord = require("../models/passengerRecord.model");
const Station = require("../models/station.model");
const { faker } = require("@faker-js/faker");
const { Readable } = require("stream");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const AppError = require("../utils/appError");

// ============================================================
// UTILITY
// ============================================================

function measureMemory() {
  const usage = process.memoryUsage();
  return {
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
    rss: Math.round(usage.rss / 1024 / 1024),
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// PART 1: BULK INSERT / UPLOAD
// ============================================================

/**
 * POST /api/bulk/insert
 * Bulk insert records with configurable batch size and write concern.
 */
async function bulkInsert(req, res, next) {
  try {
    const {
      records = [],
      batchSize = 1000,
      writeConcern = "w:1",
      ordered = true,
    } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return errorResponse(res, "records must be a non-empty array", 400);
    }

    const wcMap = {
      "w:0": { w: 0 },
      "w:1": { w: 1 },
      "w:majority": { w: "majority" },
    };
    const wc = wcMap[writeConcern] || { w: 1 };

    const memBefore = measureMemory();
    const start = Date.now();

    let inserted = 0;
    let failed = 0;
    const errors = [];
    let indexCreated = false;

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);

      // Try to create unique index after first batch (collection now exists)
      if (!indexCreated && inserted > 0) {
        try {
          await PassengerRecord.collection.createIndex(
            { passengerId: 1 },
            { unique: true, background: true }
          );
          indexCreated = true;
        } catch (_) {
          // May fail if already exists
        }
      }

      try {
        const result = await PassengerRecord.insertMany(batch, {
          ordered,
          writeConcern: wc,
        });
        inserted += result.length;
      } catch (err) {
        if (err.writeErrors) {
          inserted += batch.length - err.writeErrors.length;
          failed += err.writeErrors.length;
          err.writeErrors.forEach((we, idx) => {
            errors.push({ index: i + idx, error: we.errmsg });
          });
        } else {
          failed += batch.length;
        }
      }
    }

    const elapsed = Date.now() - start;
    const memAfter = measureMemory();

    return successResponse(res, "Bulk insert completed", {
      total: records.length,
      inserted,
      failed,
      elapsedMs: elapsed,
      recordsPerSec: Math.round((inserted / elapsed) * 1000),
      errors: errors.slice(0, 10),
      memory: {
        before: memBefore,
        after: memAfter,
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /api/bulk/benchmark
 * Compare bulk insert performance across different configurations.
 */
async function bulkBenchmark(req, res, next) {
  try {
    const {
      recordCount = 10000,
      configs = [
        { batchSize: 100, writeConcern: "w:1", ordered: true },
        { batchSize: 500, writeConcern: "w:1", ordered: true },
        { batchSize: 1000, writeConcern: "w:1", ordered: true },
        { batchSize: 2500, writeConcern: "w:1", ordered: true },
        { batchSize: 5000, writeConcern: "w:1", ordered: true },
        { batchSize: 2500, writeConcern: "w:0", ordered: true },
        { batchSize: 2500, writeConcern: "w:1", ordered: false },
      ],
    } = req.body;

    // Generate base data once
    const baseData = Array.from({ length: recordCount }, (_, i) => ({
      passengerId: `bench-pax-${i}-${Date.now()}`,
      passengerName: faker.person.fullName(),
      stationCode: `ST0${(i % 5) + 1}`,
      entryStation: `ST0${(i % 5) + 1}`,
      exitStation: `ST0${((i + 1) % 5) + 1}`,
      tripDate: faker.date.between({ from: "2025-01-01", to: "2026-03-24" }),
      fare: Math.round((Math.random() * 50 + 10) * 100) / 100,
      paymentMethod: faker.helpers.arrayElement(["cash", "card", "mobile"]),
      status: "completed",
    }));

    const results = [];

    for (const config of configs) {
      // Clear collection before each run
      await PassengerRecord.deleteMany({});

      const wcMap = {
        "w:0": { w: 0 },
        "w:1": { w: 1 },
        "w:majority": { w: "majority" },
      };
      const wc = wcMap[config.writeConcern] || { w: 1 };

      const memBefore = measureMemory();
      const start = Date.now();

      let inserted = 0;
      for (let i = 0; i < baseData.length; i += config.batchSize) {
        const batch = baseData.slice(i, i + config.batchSize);
        try {
          const result = await PassengerRecord.insertMany(batch, {
            ordered: config.ordered,
            writeConcern: wc,
          });
          inserted += result.length;
        } catch (err) {
          if (err.writeErrors) {
            inserted += batch.length - err.writeErrors.length;
          }
        }
      }

      const elapsed = Date.now() - start;
      const memAfter = measureMemory();

      results.push({
        config,
        recordCount,
        inserted,
        elapsedMs: elapsed,
        recordsPerSec: Math.round((inserted / elapsed) * 1000),
        memoryDelta: memAfter.heapUsed - memBefore.heapUsed,
      });
    }

    return successResponse(res, "Benchmark completed", { results });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/bulk/stats
 * Show collection statistics.
 */
async function getStats(req, res, next) {
  try {
    const db = PassengerRecord.db.db;

    const [count, indexes] = await Promise.all([
      PassengerRecord.countDocuments(),
      PassengerRecord.collection.indexes(),
    ]);

    return successResponse(res, "Collection stats", {
      collection: "passengerrecords",
      documentCount: count,
      indexes: indexes.map((idx) => ({
        name: idx.name,
        key: idx.key,
        unique: idx.unique || false,
      })),
    });
  } catch (error) {
    return next(error);
  }
}

// ============================================================
// PART 2: EXPORT LARGE DATA
// ============================================================

/**
 * GET /api/export/passengers/json
 * Stream export to JSON format.
 */
async function exportJSON(req, res, next) {
  try {
    const { limit = 10000, stationCode } = req.query;
    const query = {};
    if (stationCode) query.stationCode = stationCode;

    const cursor = PassengerRecord.find(query)
      .select("passengerId passengerName stationCode entryStation exitStation tripDate fare paymentMethod status tripDate")
      .limit(Math.min(Number(limit), 100000))
      .lean()
      .cursor({ batchSize: 500 });

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=passengers.json");
    res.write("[\n");

    let first = true;
    for await (const doc of cursor) {
      if (!first) res.write(",\n");
      res.write(JSON.stringify(doc));
      first = false;
    }

    res.write("\n]");
    res.end();
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/export/passengers/csv
 * Stream export to CSV format.
 */
async function exportCSV(req, res, next) {
  try {
    const { limit = 10000, stationCode } = req.query;
    const query = {};
    if (stationCode) query.stationCode = stationCode;

    const cursor = PassengerRecord.find(query)
      .select("passengerId passengerName stationCode entryStation exitStation tripDate fare paymentMethod status")
      .limit(Math.min(Number(limit), 100000))
      .lean()
      .cursor({ batchSize: 500 });

    const headers = "passengerId,passengerName,stationCode,entryStation,exitStation,tripDate,fare,paymentMethod,status\n";

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=passengers.csv");
    res.write(headers);

    for await (const doc of cursor) {
      const row = [
        doc.passengerId,
        `"${doc.passengerName}"`,
        doc.stationCode,
        doc.entryStation,
        doc.exitStation,
        new Date(doc.tripDate).toISOString(),
        doc.fare,
        doc.paymentMethod,
        doc.status,
      ].join(",");
      res.write(row + "\n");
    }

    res.end();
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/export/passengers/merge
 * Aggregation $merge to a summary collection.
 */
async function exportMerge(req, res, next) {
  try {
    const { stationCode, fromDate, toDate } = req.query;
    const match = {};
    if (stationCode) match.stationCode = stationCode;
    if (fromDate || toDate) {
      match.tripDate = {};
      if (fromDate) match.tripDate.$gte = new Date(fromDate);
      if (toDate) match.tripDate.$lte = new Date(toDate);
    }

    // Ensure unique index on station_summary.stationCode for $merge
    try {
      await mongoose.connection.db.collection("station_summary").createIndex(
        { stationCode: 1 },
        { unique: true, background: true }
      );
    } catch (_) {
      // Index may already exist
    }

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: "$stationCode",
          totalTrips: { $sum: 1 },
          totalRevenue: { $sum: "$fare" },
          avgFare: { $avg: "$fare" },
          completedTrips: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          cancelledTrips: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
        },
      },
      { $sort: { totalTrips: -1 } },
      {
        $project: {
          _id: 0,
          stationCode: "$_id",
          totalTrips: 1,
          totalRevenue: { $round: ["$totalRevenue", 2] },
          avgFare: { $round: ["$avgFare", 2] },
          completedTrips: 1,
          cancelledTrips: 1,
        },
      },
      {
        $merge: {
          into: "station_summary",
          on: "stationCode",
          whenMatched: "replace",
          whenNotMatched: "insert",
        },
      },
    ];

    await PassengerRecord.aggregate(pipeline).option({ allowDiskUse: true });

    return successResponse(res, "Aggregation $merge completed", {
      outputCollection: "station_summary",
      matchCriteria: match,
    });
  } catch (error) {
    return next(error);
  }
}

// ============================================================
// PART 3: IMPORT LARGE DATA
// ============================================================

/**
 * POST /api/import/passengers
 * Import passengers from JSON body.
 */
async function importPassengers(req, res, next) {
  try {
    const {
      records = [],
      batchSize = 1000,
      onDuplicate = "skip", // "skip" | "upsert"
    } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return errorResponse(res, "records must be a non-empty array", 400);
    }

    const start = Date.now();
    let inserted = 0;
    let skipped = 0;
    let upserted = 0;
    const errors = [];

    // Ensure unique index for duplicate detection
    try {
      await PassengerRecord.collection.createIndex(
        { passengerId: 1 },
        { unique: true, sparse: true, background: true }
      );
    } catch (_) {}

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);

      if (onDuplicate === "upsert") {
        // Use bulkWrite with upsert
        const ops = batch.map((record) => ({
          updateOne: {
            filter: { passengerId: record.passengerId },
            update: { $set: record },
            upsert: true,
          },
        }));

        const result = await PassengerRecord.bulkWrite(ops, { ordered: false });
        upserted += result.upsertedCount;
        inserted += result.modifiedCount;
      } else {
        // Skip duplicates with ordered:false
        try {
          const result = await PassengerRecord.insertMany(batch, {
            ordered: false,
          });
          inserted += result.length;
        } catch (err) {
          if (err.writeErrors) {
            inserted += batch.length - err.writeErrors.length;
            skipped += err.writeErrors.length;
            err.writeErrors.forEach((we, idx) => {
              errors.push({ index: i + idx, error: we.errmsg });
            });
          }
        }
      }
    }

    const elapsed = Date.now() - start;

    return successResponse(res, "Import completed", {
      total: records.length,
      inserted,
      skipped,
      upserted,
      failed: errors.length,
      elapsedMs: elapsed,
      recordsPerSec: Math.round((records.length / elapsed) * 1000),
      errors: errors.slice(0, 10),
    });
  } catch (error) {
    return next(error);
  }
}

// ============================================================
// PART 4: PAGINATION & DOWNLOAD
// ============================================================

/**
 * GET /api/passengers
 * Offset-based pagination (baseline).
 */
async function listPassengers(req, res, next) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 20));
    const { stationCode, status, fromDate, toDate } = req.query;

    const filter = {};
    if (stationCode) filter.stationCode = stationCode;
    if (status) filter.status = status;
    if (fromDate || toDate) {
      filter.tripDate = {};
      if (fromDate) filter.tripDate.$gte = new Date(fromDate);
      if (toDate) filter.tripDate.$lte = new Date(toDate);
    }

    const [records, total] = await Promise.all([
      PassengerRecord.find(filter)
        .sort({ tripDate: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean(),
      PassengerRecord.countDocuments(filter),
    ]);

    return successResponse(res, "Passengers retrieved", {
      data: records,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/passengers/cursor
 * Cursor-based pagination (optimized for large datasets).
 */
async function listPassengersCursor(req, res, next) {
  try {
    const { cursor, pageSize = 20, stationCode, status, fromDate, toDate } = req.query;
    const limit = Math.min(100, Math.max(1, Number(pageSize)));

    const filter = {};
    if (stationCode) filter.stationCode = stationCode;
    if (status) filter.status = status;
    if (fromDate || toDate) {
      filter.tripDate = {};
      if (fromDate) filter.tripDate.$gte = new Date(fromDate);
      if (toDate) filter.tripDate.$lte = new Date(toDate);
    }

    if (cursor) {
      filter._id = { $gt: cursor };
    }

    const records = await PassengerRecord.find(filter)
      .sort({ _id: 1 })
      .limit(limit)
      .lean();

    const hasNext = records.length === limit;
    const nextCursor = hasNext
      ? records[records.length - 1]._id.toString()
      : null;

    return successResponse(res, "Passengers retrieved (cursor)", {
      data: records,
      pagination: {
        pageSize: limit,
        hasNext,
        nextCursor,
        method: "cursor",
      },
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/passengers/download
 * Full streaming download of all records matching filter.
 */
async function downloadPassengers(req, res, next) {
  try {
    const { stationCode, status, format = "json" } = req.query;
    const filter = {};
    if (stationCode) filter.stationCode = stationCode;
    if (status) filter.status = status;

    const cursor = PassengerRecord.find(filter)
      .select("passengerId passengerName stationCode entryStation exitStation tripDate fare paymentMethod status")
      .lean()
      .cursor({ batchSize: 500 });

    if (format === "csv") {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=passengers.csv");
      res.write(
        "passengerId,passengerName,stationCode,entryStation,exitStation,tripDate,fare,paymentMethod,status\n"
      );

      for await (const doc of cursor) {
        const row = [
          doc.passengerId,
          `"${doc.passengerName}"`,
          doc.stationCode,
          doc.entryStation,
          doc.exitStation,
          new Date(doc.tripDate).toISOString(),
          doc.fare,
          doc.paymentMethod,
          doc.status,
        ].join(",");
        res.write(row + "\n");
      }
    } else {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", "attachment; filename=passengers.json");
      res.write("[\n");

      let first = true;
      for await (const doc of cursor) {
        if (!first) res.write(",\n");
        res.write(JSON.stringify(doc));
        first = false;
      }

      res.write("\n]");
    }

    res.end();
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/pagination/compare
 * Compare offset vs cursor pagination performance.
 */
async function comparePagination(req, res, next) {
  try {
    const { pages = [1, 10, 50, 100, 500], pageSize = 100 } = req.query;
    const pageList = pages.split(",").map((p) => Number(p)).filter((p) => p > 0);
    const ps = Math.min(100, Math.max(1, Number(pageSize)));

    const results = [];

    for (const page of pageList) {
      // Offset method
      const offsetStart = Date.now();
      await PassengerRecord.find({})
        .sort({ tripDate: -1 })
        .skip((page - 1) * ps)
        .limit(ps)
        .lean();
      const offsetTime = Date.now() - offsetStart;

      // Cursor method (approximate with $lt on _id of page*ps document)
      let cursorTime = 0;
      let cursorRecords = 0;
      if (page > 1) {
        // Find the last _id of offset page to simulate cursor position
        const baseline = await PassengerRecord.find({})
          .sort({ _id: -1 })
          .skip((page - 1) * ps)
          .limit(1)
          .select({ _id: 1 })
          .lean();

        if (baseline.length > 0) {
          const cursorStart = Date.now();
          cursorRecords = await PassengerRecord.countDocuments({
            _id: { $lt: baseline[0]._id },
          });
          cursorTime = Date.now() - cursorStart;
        }
      } else {
        const cursorStart = Date.now();
        cursorRecords = await PassengerRecord.countDocuments({});
        cursorTime = Date.now() - cursorStart;
      }

      results.push({
        page,
        pageSize: ps,
        offset: { timeMs: offsetTime },
        cursor: { timeMs: cursorTime, countEstimate: cursorRecords },
      });
    }

    return successResponse(res, "Pagination comparison completed", { results });
  } catch (error) {
    return next(error);
  }
}

// ============================================================
// PART 5: SEED DATA
// ============================================================

/**
 * POST /api/bulk/seed/stations
 * Seed station data.
 */
async function seedStations(req, res, next) {
  try {
    const existingCount = await Station.countDocuments();
    if (existingCount > 0) {
      return successResponse(res, "Stations already seeded", {
        count: existingCount,
      });
    }

    const stations = [
      { stationCode: "ST01", stationName: "Ben Thanh", line: "Line1", zone: 1, coordinates: { lat: 10.7798, lng: 106.6982 }, isActive: true },
      { stationCode: "ST02", stationName: "Saigon Center", line: "Line1", zone: 1, coordinates: { lat: 10.7781, lng: 106.7034 }, isActive: true },
      { stationCode: "ST03", stationName: "Opera House", line: "Line1", zone: 1, coordinates: { lat: 10.7765, lng: 106.7079 }, isActive: true },
      { stationCode: "ST04", stationName: "Ba Son", line: "Line1", zone: 1, coordinates: { lat: 10.7739, lng: 106.7114 }, isActive: true },
      { stationCode: "ST05", stationName: "Van Thanh", line: "Line1", zone: 2, coordinates: { lat: 10.7698, lng: 106.7182 }, isActive: true },
      { stationCode: "ST06", stationName: "Diem", line: "Line2", zone: 2, coordinates: { lat: 10.7620, lng: 106.6899 }, isActive: true },
      { stationCode: "ST07", stationName: "Hang Xanh", line: "Line2", zone: 2, coordinates: { lat: 10.7971, lng: 106.7084 }, isActive: true },
      { stationCode: "ST08", stationName: "Thao Dien", line: "Line2", zone: 3, coordinates: { lat: 10.8048, lng: 106.7205 }, isActive: true },
      { stationCode: "ST09", stationName: "An Phu", line: "Line2", zone: 3, coordinates: { lat: 10.8098, lng: 106.7279 }, isActive: true },
      { stationCode: "ST10", stationName: "Thu Thiem", line: "Line2", zone: 3, coordinates: { lat: 10.8149, lng: 106.7328 }, isActive: true },
    ];

    await Station.insertMany(stations);

    return successResponse(res, "Stations seeded successfully", {
      count: stations.length,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /api/bulk/seed/passengers
 * Seed passenger records using streaming generator pattern.
 */
async function seedPassengers(req, res, next) {
  try {
    const {
      count = 10000,
      batchSize = 2500,
    } = req.body;

    const total = Math.min(Number(count), 100000);
    const batch = Math.min(Math.max(Number(batchSize), 100), 10000);

    const start = Date.now();
    const stations = ["ST01", "ST02", "ST03", "ST04", "ST05"];

    // Generator function for memory-efficient data generation
    function* passengerGenerator(totalRecords) {
      for (let i = 0; i < totalRecords; i++) {
        const entryIdx = i % stations.length;
        const exitIdx = (i + 1) % stations.length;
        yield {
          passengerId: `pax-${Date.now()}-${i}`,
          passengerName: faker.person.fullName(),
          stationCode: stations[entryIdx],
          entryStation: stations[entryIdx],
          exitStation: stations[exitIdx],
          tripDate: faker.date.between({ from: "2025-01-01", to: "2026-03-24" }),
          fare: Math.round((Math.random() * 50 + 10) * 100) / 100,
          paymentMethod: faker.helpers.arrayElement(["cash", "card", "mobile"]),
          status: faker.helpers.weightedArrayElement([
            { value: "completed", weight: 85 },
            { value: "cancelled", weight: 10 },
            { value: "pending", weight: 5 },
          ]),
        };
      }
    }

    let inserted = 0;
    let batchBuffer = [];

    for (const record of passengerGenerator(total)) {
      batchBuffer.push(record);

      if (batchBuffer.length === batch) {
        await PassengerRecord.insertMany(batchBuffer, { ordered: false });
        inserted += batchBuffer.length;
        batchBuffer = [];
      }
    }

    // Flush remaining
    if (batchBuffer.length > 0) {
      await PassengerRecord.insertMany(batchBuffer, { ordered: false });
      inserted += batchBuffer.length;
    }

    const elapsed = Date.now() - start;
    const memAfter = measureMemory();

    return successResponse(res, "Passengers seeded successfully", {
      totalRequested: total,
      totalInserted: inserted,
      elapsedMs: elapsed,
      recordsPerSec: Math.round((inserted / elapsed) * 1000),
      memory: memAfter,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /api/bulk/seed/reset
 * Reset all seeded data.
 */
async function seedReset(req, res, next) {
  try {
    await Promise.all([
      PassengerRecord.deleteMany({}),
      Station.deleteMany({}),
    ]);

    // station_summary is created by $merge, delete it too
    try {
      await mongoose.connection.db.collection("station_summary").deleteMany({});
    } catch (_) {
      // May not exist yet
    }

    return successResponse(res, "Seed data reset successfully", {
      cleared: ["passengerrecords", "stations", "station_summary"],
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * GET /api/bulk/seed/status
 * Get seed status.
 */
async function seedStatus(req, res, next) {
  try {
    const [passengerCount, stationCount, summaryCount] = await Promise.all([
      PassengerRecord.countDocuments(),
      Station.countDocuments(),
      mongoose.connection.db.collection("station_summary").countDocuments(),
    ]);

    return successResponse(res, "Seed status", {
      passengerRecords: passengerCount,
      stations: stationCount,
      stationSummary: summaryCount,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  // Part 1
  bulkInsert,
  bulkBenchmark,
  getStats,
  // Part 2
  exportJSON,
  exportCSV,
  exportMerge,
  // Part 3
  importPassengers,
  // Part 4
  listPassengers,
  listPassengersCursor,
  downloadPassengers,
  comparePagination,
  // Part 5
  seedStations,
  seedPassengers,
  seedReset,
  seedStatus,
};
