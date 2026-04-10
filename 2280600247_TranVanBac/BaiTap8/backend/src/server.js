"use strict";

const dotenv = require("dotenv");
const app = require("./app");
const { connectDB } = require("./config/db");

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`BaiTap8 Server running at http://localhost:${PORT}`);
      // eslint-disable-next-line no-console
      console.log(`Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("DB connection failed", error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
