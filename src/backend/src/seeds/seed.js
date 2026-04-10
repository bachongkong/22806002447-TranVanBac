import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { env } from '../config/index.js'
import User from '../models/User.js'
import Company from '../models/Company.js'
import Job from '../models/Job.js'

const seedData = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI)
    console.log('[OK] Connected to MongoDB')

    // Xóa data cũ (nếu có)
    await User.deleteMany({})
    await Company.deleteMany({})
    await Job.deleteMany({})
    console.log('[OK] Cleared old data')

    // === 1. Tạo Admin ===
    const admin = await User.create({
      email: 'admin@smarthire.com',
      passwordHash: 'admin123',
      role: 'admin',
      isEmailVerified: true,
      profile: { fullName: 'System Admin' },
    })
    console.log('[OK] Admin created:', admin.email)

    // === 2. Tạo HR + Company ===
    const hr = await User.create({
      email: 'hr@techcorp.com',
      passwordHash: 'hr123456',
      role: 'hr',
      isEmailVerified: true,
      profile: { fullName: 'Nguyễn Văn HR', roleTitle: 'HR Manager' },
    })

    const company = await Company.create({
      name: 'TechCorp Vietnam',
      description: 'Công ty phần mềm hàng đầu',
      industry: 'Information Technology',
      companySize: '100-500',
      location: 'TP. Hồ Chí Minh',
      status: 'approved',
      hrMembers: [hr._id],
      createdBy: hr._id,
    })

    hr.companyId = company._id
    await hr.save()
    console.log('[OK] Company created:', company.name)

    // === 3. Tạo Candidate ===
    const candidate = await User.create({
      email: 'candidate@gmail.com',
      passwordHash: 'candidate123',
      role: 'candidate',
      isEmailVerified: true,
      profile: {
        fullName: 'Trần Thị Candidate',
        skills: ['JavaScript', 'React', 'Node.js'],
        phone: '0901234567',
      },
    })
    console.log('[OK] Candidate created:', candidate.email)

    // === 4. Tạo Jobs ===
    const jobs = await Job.insertMany([
      {
        companyId: company._id,
        createdByHR: hr._id,
        title: 'Frontend Developer (React)',
        description: 'Tuyển Frontend Developer có kinh nghiệm React, TypeScript',
        requirements: '2+ năm kinh nghiệm React, biết TypeScript',
        benefits: 'Lương 15-25 triệu, WFH 2 ngày/tuần',
        salaryRange: { min: 15000000, max: 25000000 },
        location: 'TP. Hồ Chí Minh',
        employmentType: 'Full-time',
        experienceLevel: 'Junior-Middle',
        skills: ['React', 'TypeScript', 'CSS', 'Git'],
        status: 'published',
      },
      {
        companyId: company._id,
        createdByHR: hr._id,
        title: 'Backend Developer (Node.js)',
        description: 'Tuyển Backend Developer thành thạo Node.js, MongoDB',
        requirements: '2+ năm kinh nghiệm Node.js',
        benefits: 'Lương 18-30 triệu, bảo hiểm sức khỏe',
        salaryRange: { min: 18000000, max: 30000000 },
        location: 'TP. Hồ Chí Minh',
        employmentType: 'Full-time',
        experienceLevel: 'Middle-Senior',
        skills: ['Node.js', 'Express', 'MongoDB', 'Docker'],
        status: 'published',
      },
      {
        companyId: company._id,
        createdByHR: hr._id,
        title: 'UI/UX Designer',
        description: 'Tuyển Designer sáng tạo, am hiểu UX',
        requirements: '1+ năm kinh nghiệm Figma',
        benefits: 'Lương 12-20 triệu',
        salaryRange: { min: 12000000, max: 20000000 },
        location: 'Hà Nội',
        employmentType: 'Full-time',
        experienceLevel: 'Junior',
        skills: ['Figma', 'Adobe XD', 'Photoshop'],
        status: 'published',
      },
    ])
    console.log(`[OK] ${jobs.length} jobs created`)

    // === Done ===
    console.log('\n[DONE] Seed completed!')
    console.log('---')
    console.log('Test accounts:')
    console.log('  Admin:     admin@smarthire.com / admin123')
    console.log('  HR:        hr@techcorp.com / hr123456')
    console.log('  Candidate: candidate@gmail.com / candidate123')

    process.exit(0)
  } catch (error) {
    console.error('[ERROR] Seed error:', error.message)
    process.exit(1)
  }
}

seedData()
