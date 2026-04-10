const express = require("express");
const {
  getMe,
  getUsers,
  updateUserRole,
} = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validate.middleware");
const {
  updateRoleSchema,
  getUsersQuerySchema,
} = require("../validators/user.validator");

const router = express.Router();

router.get("/me", authenticate, getMe);
router.get(
  "/",
  authenticate,
  authorizeRoles("admin"),
  validate(getUsersQuerySchema, "query"),
  getUsers
);
router.patch(
  "/:id/role",
  authenticate,
  authorizeRoles("admin"),
  validate(updateRoleSchema),
  updateUserRole
);

module.exports = router;
