const express = require("express");
const { getUsersDataset } = require("../controllers/performance.controller");
const { createRateLimit } = require("../middlewares/rateLimit.middleware");

const router = express.Router();

router.get(
  "/datasets/users",
  createRateLimit({ windowMs: 60_000, limit: 60 }),
  getUsersDataset
);

module.exports = router;
