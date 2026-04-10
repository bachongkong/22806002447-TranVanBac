const path = require("path");
const { Readable } = require("stream");
const { Worker } = require("worker_threads");
const AppError = require("../utils/appError");
const Report = require("../models/report.model");
const { domainEvents, DOMAIN_EVENTS } = require("../events/domainEvents");
const workerPath = path.resolve(__dirname, "../workers/report.worker.js");

async function queueReportGeneration(report) {
  if (!report?._id) {
    throw new AppError("Report is required", 400);
  }

  await Report.findByIdAndUpdate(report._id, { status: "processing", errorMessage: null });
  domainEvents.emit(DOMAIN_EVENTS.REPORT_STATUS_CHANGED, {
    reportId: String(report._id),
    status: "processing",
  });

  return new Promise((resolve) => {
    const worker = new Worker(workerPath, {
      workerData: {
        fromDate: report.fromDate,
        toDate: report.toDate,
      },
    });

    worker.once("message", async (result) => {
      try {
        if (result?.error) {
          await Report.findByIdAndUpdate(report._id, {
            status: "failed",
            errorMessage: result.error,
          });
          domainEvents.emit(DOMAIN_EVENTS.REPORT_STATUS_CHANGED, {
            reportId: String(report._id),
            status: "failed",
            errorMessage: result.error,
          });
          return resolve();
        }

        await Report.findByIdAndUpdate(report._id, {
          status: "completed",
          totalEntries: result.totalEntries || 0,
          totalInspections: result.totalInspections || 0,
          workerDurationMs: result.workerDurationMs || 0,
          errorMessage: null,
        });

        domainEvents.emit(DOMAIN_EVENTS.REPORT_STATUS_CHANGED, {
          reportId: String(report._id),
          status: "completed",
          totalEntries: result.totalEntries || 0,
          totalInspections: result.totalInspections || 0,
          workerDurationMs: result.workerDurationMs || 0,
        });
        return resolve();
      } catch (_) {
        return resolve();
      }
    });

    worker.once("error", async (error) => {
      await Report.findByIdAndUpdate(report._id, {
        status: "failed",
        errorMessage: error.message || "Worker failed",
      });
      domainEvents.emit(DOMAIN_EVENTS.REPORT_STATUS_CHANGED, {
        reportId: String(report._id),
        status: "failed",
        errorMessage: error.message || "Worker failed",
      });
      resolve();
    });

    worker.once("exit", async (code) => {
      if (code !== 0) {
        const current = await Report.findById(report._id).lean();
        if (current && current.status === "processing") {
          await Report.findByIdAndUpdate(report._id, {
            status: "failed",
            errorMessage: `Worker stopped with exit code ${code}`,
          });
          domainEvents.emit(DOMAIN_EVENTS.REPORT_STATUS_CHANGED, {
            reportId: String(report._id),
            status: "failed",
            errorMessage: `Worker stopped with exit code ${code}`,
          });
        }
      }
      resolve();
    });
  });
}

function createCsvStream(report) {
  if (!report) {
    throw new AppError("Report is required", 400);
  }
  if (report.status !== "completed") {
    throw new AppError("Report is not ready for download", 409);
  }

  const rows = [
    "reportId,title,type,status,fromDate,toDate,totalEntries,totalInspections,workerDurationMs,generatedAt\n",
    [
      report._id,
      report.title,
      report.type,
      report.status,
      new Date(report.fromDate).toISOString(),
      new Date(report.toDate).toISOString(),
      report.totalEntries ?? 0,
      report.totalInspections ?? 0,
      report.workerDurationMs ?? 0,
      new Date(report.updatedAt || Date.now()).toISOString(),
    ]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`)
      .join(",")
      .concat("\n"),
  ];

  return Readable.from(rows, {
    encoding: "utf8",
  });
}

module.exports = {
  queueReportGeneration,
  createCsvStream,
};
