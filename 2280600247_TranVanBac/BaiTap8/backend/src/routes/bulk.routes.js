"use strict";

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  bulkInsert,
  bulkBenchmark,
  getStats,
  exportJSON,
  exportCSV,
  exportMerge,
  importPassengers,
  listPassengers,
  listPassengersCursor,
  downloadPassengers,
  comparePagination,
  seedStations,
  seedPassengers,
  seedReset,
  seedStatus,
} = require("../controllers/bulk.controller");

// ============================================================
// PART 1: BULK INSERT / UPLOAD
// ============================================================
router.post("/insert", bulkInsert);
router.post("/benchmark", bulkBenchmark);
router.get("/stats", getStats);

// ============================================================
// PART 5: SEED DATA
// ============================================================
router.post("/seed/stations", seedStations);
router.post("/seed/passengers", seedPassengers);
router.post("/seed/reset", seedReset);
router.get("/seed/status", seedStatus);

// ============================================================
// EXPORT
// ============================================================
router.get("/export/passengers/json", exportJSON);
router.get("/export/passengers/csv", exportCSV);
router.get("/export/passengers/merge", exportMerge);

// ============================================================
// IMPORT
// ============================================================
router.post("/import/passengers", importPassengers);

// ============================================================
// PAGINATION & DOWNLOAD
// ============================================================
router.get("/passengers", listPassengers);
router.get("/passengers/cursor", listPassengersCursor);
router.get("/passengers/download", downloadPassengers);
router.get("/pagination/compare", comparePagination);

module.exports = router;
