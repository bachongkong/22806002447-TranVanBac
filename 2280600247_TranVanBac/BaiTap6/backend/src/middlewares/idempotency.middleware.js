const AppError = require("../utils/appError");
const crypto = require("crypto");
const IdempotencyKey = require("../models/idempotency.model");

const IDEMPOTENCY_TTL_MS = 60 * 60 * 1000;

function createRequestHash(req) {
  const payload = JSON.stringify({ body: req.body ?? {}, query: req.query ?? {} });
  return crypto.createHash("sha256").update(payload).digest("hex");
}

async function enforceIdempotency(req, res, next) {
  try {
    const key = req.header("Idempotency-Key");
    if (!key) {
      return next(new AppError("Idempotency-Key header is required", 400));
    }
    const requestHash = createRequestHash(req);
    const existing = await IdempotencyKey.findOne({
      key,
      method: req.method,
      path: req.baseUrl + req.path,
      expiresAt: { $gt: new Date() },
    }).lean();
    if (existing) {
      if (existing.requestHash !== requestHash) {
        return next(new AppError("Idempotency-Key already used with different payload", 409));
      }
      return res.status(existing.statusCode).json(existing.responseBody);
    }
    req.idempotency = { key, requestHash, method: req.method, path: req.baseUrl + req.path };
    return next();
  } catch (error) {
    return next(error);
  }
}

async function saveIdempotencyResponse(req, statusCode, body) {
  if (!req?.idempotency?.key) {
    return;
  }
  await IdempotencyKey.findOneAndUpdate(
    { key: req.idempotency.key, method: req.idempotency.method, path: req.idempotency.path },
    {
      key: req.idempotency.key,
      method: req.idempotency.method,
      path: req.idempotency.path,
      requestHash: req.idempotency.requestHash,
      statusCode,
      responseBody: body,
      expiresAt: new Date(Date.now() + IDEMPOTENCY_TTL_MS),
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );
}

module.exports = {
  enforceIdempotency,
  saveIdempotencyResponse,
};
