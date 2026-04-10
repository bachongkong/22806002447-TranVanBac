const { successResponse } = require("../utils/apiResponse");

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getUsersDataset(req, res, next) {
  try {
    const size = Math.min(Math.max(Number(req.query.size) || 1500, 100), 8000);
    const delayMs = Math.min(Math.max(Number(req.query.delayMs) || 0, 0), 3000);

    if (delayMs > 0) {
      await wait(delayMs);
    }

    const roles = ["passenger", "staff", "inspector", "admin"];
    const stations = ["ST01", "ST02", "ST03", "ST04", "ST05"];

    const users = Array.from({ length: size }, (_, index) => {
      const order = index + 1;
      const role = roles[index % roles.length];
      const station = stations[index % stations.length];
      const isActive = index % 11 !== 0;

      return {
        id: `perf-user-${order}`,
        name: `Perf User ${order}`,
        email: `perf.user.${order}@metro.local`,
        role,
        stationCode: station,
        isActive,
        monthlyTrips: (order * 7) % 220,
        violationCount: order % 9,
        balance: Number(((order * 3.14) % 500).toFixed(2)),
        tags: [
          role,
          station,
          isActive ? "active" : "inactive",
          order % 2 === 0 ? "vip" : "standard",
        ],
      };
    });

    return successResponse(res, "Performance dataset generated", {
      users,
      meta: {
        size,
        delayMs,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsersDataset,
};
