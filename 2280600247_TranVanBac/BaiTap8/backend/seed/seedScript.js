"use strict";

/**
 * BaiTap8 — Seed Data CLI Script
 *
 * Usage:
 *   node seed/seedScript.js --count=10000 --batch=2500
 *   node seed/seedScript.js --count=50000 --batch=2500 --reset
 *   node seed/seedScript.js --reset
 *   node seed/seedScript.js --status
 *
 * Options:
 *   --count=<N>    Number of passenger records to generate (default: 10000)
 *   --batch=<N>    Batch size for bulk insert (default: 2500)
 *   --reset        Drop all seeded collections before seeding
 *   --status       Show current seed status
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const { connectDB, disconnectDB } = require("../src/config/db");
const PassengerRecord = require("../src/models/passengerRecord.model");
const Station = require("../src/models/station.model");
const { faker } = require("@faker-js/faker");

// ============================================================
// CLI ARGUMENT PARSER
// ============================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    count: 10000,
    batch: 2500,
    reset: false,
    status: false,
    stationsOnly: false,
    passengersOnly: false,
  };

  for (const arg of args) {
    if (arg.startsWith("--count=")) {
      options.count = parseInt(arg.split("=")[1], 10);
    } else if (arg.startsWith("--batch=")) {
      options.batch = parseInt(arg.split("=")[1], 10);
    } else if (arg === "--reset") {
      options.reset = true;
    } else if (arg === "--status") {
      options.status = true;
    } else if (arg === "--stations-only") {
      options.stationsOnly = true;
    } else if (arg === "--passengers-only") {
      options.passengersOnly = true;
    }
  }

  return options;
}

// ============================================================
// STATION SEED
// ============================================================

async function seedStations() {
  const existing = await Station.countDocuments();
  if (existing > 0) {
    console.log(`[Seed] Stations already exist: ${existing} records`);
    return;
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
  console.log(`[Seed] Stations seeded: ${stations.length} records`);
}

// ============================================================
// PASSENGER GENERATOR (streaming / memory-efficient)
// ============================================================

function* passengerGenerator(totalRecords, timestamp) {
  const stations = ["ST01", "ST02", "ST03", "ST04", "ST05"];
  const statuses = [
    { value: "completed", weight: 85 },
    { value: "cancelled", weight: 10 },
    { value: "pending", weight: 5 },
  ];
  const paymentMethods = ["cash", "card", "mobile"];

  for (let i = 0; i < totalRecords; i++) {
    const entryIdx = i % stations.length;
    const exitIdx = (i + 1) % stations.length;
    const rand = Math.random() * 100;
    let status = "completed";
    let cumWeight = 0;
    for (const s of statuses) {
      cumWeight += s.weight;
      if (rand < cumWeight) {
        status = s.value;
        break;
      }
    }

    yield {
      passengerId: `pax-${timestamp}-${i}`,
      passengerName: faker.person.fullName(),
      stationCode: stations[entryIdx],
      entryStation: stations[entryIdx],
      exitStation: stations[exitIdx],
      tripDate: faker.date.between({ from: "2025-01-01", to: "2026-03-24" }),
      fare: Math.round((Math.random() * 50 + 10) * 100) / 100,
      paymentMethod: paymentMethods[i % paymentMethods.length],
      status,
    };
  }
}

// ============================================================
// PASSENGER SEED (streaming batch insert)
// ============================================================

async function seedPassengers(count, batchSize) {
  const timestamp = Date.now();
  const generator = passengerGenerator(count, timestamp);

  let inserted = 0;
  let batchBuffer = [];

  for (const record of generator) {
    batchBuffer.push(record);

    if (batchBuffer.length === batchSize) {
      const result = await PassengerRecord.insertMany(batchBuffer, { ordered: false });
      inserted += result.length;
      process.stdout.write(`\r[Seed] Progress: ${inserted}/${count} (${Math.round((inserted / count) * 100)}%)`);
      batchBuffer = [];
    }
  }

  // Flush remaining
  if (batchBuffer.length > 0) {
    const result = await PassengerRecord.insertMany(batchBuffer, { ordered: false });
    inserted += result.length;
  }

  console.log(`\n[Seed] Passengers seeded: ${inserted} records`);
  return inserted;
}

// ============================================================
// RESET
// ============================================================

async function resetCollections() {
  const collections = ["passengerrecords", "stations", "station_summary"];
  for (const coll of collections) {
    await PassengerRecord.db.db.collection(coll).deleteMany({});
  }
  console.log("[Seed] Collections reset: " + collections.join(", "));
}

// ============================================================
// STATUS
// ============================================================

async function showStatus() {
  const [paxCount, stationCount] = await Promise.all([
    PassengerRecord.countDocuments(),
    Station.countDocuments(),
  ]);
  console.log(`[Status]`);
  console.log(`  PassengerRecords: ${paxCount}`);
  console.log(`  Stations: ${stationCount}`);
}

// ============================================================
// MEMORY UTILITY
// ============================================================

function measureMemory() {
  const usage = process.memoryUsage();
  return {
    heapUsedMB: Math.round((usage.heapUsed / 1024 / 1024) * 100) / 100,
    heapTotalMB: Math.round((usage.heapTotal / 1024 / 1024) * 100) / 100,
    rssMB: Math.round((usage.rss / 1024 / 1024) * 100) / 100,
  };
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  const opts = parseArgs();

  console.log("=".repeat(60));
  console.log("BaiTap8 — MongoDB Performance Seed Script");
  console.log("=".repeat(60));
  console.log(`MongoDB URI: ${process.env.MONGO_URI || "(not set)"}`);
  console.log(`Options: ${JSON.stringify(opts, null, 2)}`);
  console.log("-".repeat(60));

  await connectDB();

  if (opts.status) {
    await showStatus();
    await disconnectDB();
    return;
  }

  if (opts.reset) {
    await resetCollections();
  }

  if (!opts.passengersOnly) {
    await seedStations();
  }

  if (!opts.stationsOnly) {
    const memBefore = measureMemory();
    const start = Date.now();

    const inserted = await seedPassengers(opts.count, opts.batch);

    const elapsed = Date.now() - start;
    const memAfter = measureMemory();

    console.log("-".repeat(60));
    console.log(`[Stats] Total time:  ${elapsed} ms`);
    console.log(`[Stats] Records/sec: ${Math.round((inserted / elapsed) * 1000)}`);
    console.log(`[Stats] Memory:      ${memBefore.heapUsedMB} MB → ${memAfter.heapUsedMB} MB (delta: +${memAfter.heapUsedMB - memBefore.heapUsedMB} MB)`);
  }

  await disconnectDB();
  console.log("=".repeat(60));
  console.log("Seed complete.");
}

main().catch(async (err) => {
  console.error("[Error]", err.message);
  try {
    await disconnectDB();
  } catch (_) {}
  process.exit(1);
});
