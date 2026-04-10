"use strict";

const express = require("express");
const cors = require("cors");
const bulkRoutes = require("./routes/bulk.routes");
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/health", (req, res) => {
  res.json({ success: true, message: "ok" });
});

app.use("/api/bulk", bulkRoutes);
app.use("/api", bulkRoutes); // also mount at /api for passenger routes

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
