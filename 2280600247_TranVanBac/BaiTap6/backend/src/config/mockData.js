// Mock data for development when MongoDB is not available

// Mock users
const mockUsers = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@metro.com',
    password: '$2a$10$xGJ9Q7K5X8M0YNw5ZK8YuO5Yv8Q6W5K8Yv9Z0A1B2C3D4E5F6G7H8', // admin123
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    name: 'Staff User',
    email: 'staff@metro.com',
    password: '$2a$10$xGJ9Q7K5X8M0YNw5ZK8YuO5Yv8Q6W5K8Yv9Z0A1B2C3D4E5F6G7H8', // staff123
    role: 'staff',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '3',
    name: 'Inspector User',
    email: 'inspector@metro.com',
    password: '$2a$10$xGJ9Q7K5X8M0YNw5ZK8YuO5Yv8Q6W5K8Yv9Z0A1B2C3D4E5F6G7H8', // inspector123
    role: 'inspector',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '4',
    name: 'Passenger User',
    email: 'passenger@metro.com',
    password: '$2a$10$xGJ9Q7K5X8M0YNw5ZK8YuO5Yv8Q6W5K8Yv9Z0A1B2C3D4E5F6G7H8', // passenger123
    role: 'passenger',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Mock tickets
const mockTickets = [
  { code: 'TKT001', valid: true, expiredAt: '2026-12-31', type: 'single' },
  { code: 'TKT002', valid: false, expiredAt: '2025-01-01', type: 'single' },
  { code: 'TKT003', valid: true, expiredAt: '2026-12-31', type: 'day_pass' },
  { code: 'TKT004', valid: true, expiredAt: '2026-12-31', type: 'month_pass' },
  { code: 'TKT005', valid: true, expiredAt: '2027-06-30', type: 'single' }
]

// Mock inspections
const mockInspections = []

module.exports = {
  mockUsers,
  mockTickets,
  mockInspections
}
