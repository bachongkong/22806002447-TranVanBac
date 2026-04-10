const { Server } = require("socket.io");
const { verifyAccessToken } = require("../services/token.service");
const User = require("../models/user.model");
const { domainEvents, DOMAIN_EVENTS } = require("../events/domainEvents");

let ioInstance = null;
let detachDomainEventListeners = null;

function attachDomainEventListeners(io) {
  const onEntryValidated = (payload) => {
    io.to("role:admin").emit("metro.ticket.entryValidated", payload);
    io.to("role:staff").emit("metro.ticket.entryValidated", payload);
  };
  const onManualInspectionCreated = (payload) => {
    io.to("role:inspector").emit("metro.ticket.manualInspectionCreated", payload);
    io.to("role:admin").emit("metro.ticket.manualInspectionCreated", payload);
  };
  const onReportCreated = (payload) => io.to("role:admin").emit("report.created", payload);
  const onReportStatusChanged = (payload) => io.to("role:admin").emit("report.statusChanged", payload);
  domainEvents.on(DOMAIN_EVENTS.TICKET_ENTRY_VALIDATED, onEntryValidated);
  domainEvents.on(DOMAIN_EVENTS.TICKET_MANUAL_INSPECTION_CREATED, onManualInspectionCreated);
  domainEvents.on(DOMAIN_EVENTS.REPORT_CREATED, onReportCreated);
  domainEvents.on(DOMAIN_EVENTS.REPORT_STATUS_CHANGED, onReportStatusChanged);
  return () => {
    domainEvents.off(DOMAIN_EVENTS.TICKET_ENTRY_VALIDATED, onEntryValidated);
    domainEvents.off(DOMAIN_EVENTS.TICKET_MANUAL_INSPECTION_CREATED, onManualInspectionCreated);
    domainEvents.off(DOMAIN_EVENTS.REPORT_CREATED, onReportCreated);
    domainEvents.off(DOMAIN_EVENTS.REPORT_STATUS_CHANGED, onReportStatusChanged);
  };
}

async function socketAuth(socket, next) {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select("-password");
    if (!user || !user.isActive) {
      return next(new Error("Unauthorized"));
    }

    socket.user = user;
    return next();
  } catch (error) {
    return next(new Error("Unauthorized"));
  }
}

function initializeSocket(server) {
  if (ioInstance) {
    return ioInstance;
  }

  ioInstance = new Server(server, {
    cors: { origin: "*" },
  });

  ioInstance.use(socketAuth);

  ioInstance.on("connection", (socket) => {
    socket.join(`role:${socket.user.role}`);
    socket.join(`user:${socket.user._id}`);

    socket.emit("socket.ready", {
      userId: socket.user._id,
      role: socket.user.role,
    });
  });

  detachDomainEventListeners = attachDomainEventListeners(ioInstance);

  return ioInstance;
}

function getIo() {
  return ioInstance;
}

async function closeSocket() {
  if (ioInstance) {
    if (detachDomainEventListeners) {
      detachDomainEventListeners();
      detachDomainEventListeners = null;
    }
    await ioInstance.close();
    ioInstance = null;
  }
}

module.exports = {
  initializeSocket,
  getIo,
  closeSocket,
};
