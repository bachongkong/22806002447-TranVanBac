const express = require("express");
const {
  validateEntry,
  manualInspection,
} = require("../controllers/metro.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { createRateLimit } = require("../middlewares/rateLimit.middleware");
const {
  validateEntrySchema,
  manualInspectionSchema,
} = require("../validators/metro.validator");

const router = express.Router();

router.post(
  "/tickets/:ticketCode/validate-entry",
  authenticate,
  authorizeRoles("staff", "admin"),
  createRateLimit({ windowMs: 60_000, limit: 30 }),
  validate(validateEntrySchema),
  validateEntry
);

router.post(
  "/tickets/:ticketCode/manual-inspection",
  authenticate,
  authorizeRoles("inspector", "admin"),
  createRateLimit({ windowMs: 60_000, limit: 15 }),
  validate(manualInspectionSchema),
  manualInspection
);

module.exports = router;
