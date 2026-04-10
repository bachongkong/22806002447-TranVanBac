const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const DEMO_USERS = [
  {
    name: "Admin User",
    email: "admin@metro.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Staff User",
    email: "staff@metro.com",
    password: "staff123",
    role: "staff",
  },
  {
    name: "Inspector User",
    email: "inspector@metro.com",
    password: "inspector123",
    role: "inspector",
  },
  {
    name: "Passenger User",
    email: "passenger@metro.com",
    password: "passenger123",
    role: "passenger",
  },
];

async function ensureDemoUsers() {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  for (const demoUser of DEMO_USERS) {
    const passwordHash = await bcrypt.hash(demoUser.password, 10);
    await User.updateOne(
      { email: demoUser.email },
      {
        $set: {
          name: demoUser.name,
          role: demoUser.role,
          isActive: true,
          password: passwordHash,
        },
      },
      { upsert: true }
    );
  }
}

module.exports = {
  ensureDemoUsers,
};
