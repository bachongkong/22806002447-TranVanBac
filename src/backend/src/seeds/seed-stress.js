import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { env } from '../config/index.js'
import User from '../models/User.js'
import Company from '../models/Company.js'
import Job from '../models/Job.js'

const TITLES = [
  'Frontend Developer', 'Backend Developer', 'Fullstack Developer',
  'Mobile Developer', 'DevOps Engineer', 'QA Engineer',
  'UI/UX Designer', 'Product Manager', 'Data Engineer',
  'ML Engineer', 'Cloud Architect', 'Security Engineer',
  'Tech Lead', 'Scrum Master', 'Business Analyst',
  'Project Manager', 'SysAdmin', 'DBA', 'Game Developer', 'Embedded Engineer',
]

const SKILLS = [
  'React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript',
  'Node.js', 'Python', 'Java', 'Go', 'Rust',
  'Docker', 'K8s', 'AWS', 'MongoDB', 'PostgreSQL',
  'Redis', 'GraphQL', 'REST', 'CI/CD', 'Git',
  'Figma', 'Tailwind', 'Next.js', 'Express', 'Flutter',
]

const LOCS = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Remote', 'Bình Dương']
const TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
const LEVELS = ['Fresher', 'Junior', 'Junior-Middle', 'Middle', 'Middle-Senior', 'Senior', 'Lead']

const pick = (a) => a[Math.floor(Math.random() * a.length)]
const pickN = (a, n) => [...a].sort(() => Math.random() - 0.5).slice(0, n)

const COMPS = [
  'TechCorp Vietnam', 'FPT Software', 'VNG Corporation', 'Shopee Vietnam',
  'Grab Vietnam', 'Tiki Corp', 'MoMo', 'NashTech', 'KMS Technology', 'Axon Active',
]

const run = async () => {
  await mongoose.connect(env.MONGODB_URI)
  console.log('[OK] Connected')

  await Job.deleteMany({})
  console.log('[OK] Cleared jobs')

  let hr = await User.findOne({ role: 'hr' })
  if (!hr) {
    hr = await User.create({
      email: 'hr@techcorp.com', passwordHash: 'hr123456', role: 'hr',
      isEmailVerified: true, profile: { fullName: 'HR Manager' },
    })
  }

  const compDocs = []
  for (const name of COMPS) {
    let c = await Company.findOne({ name })
    if (!c) {
      c = await Company.create({
        name, description: name + ' - Top company', industry: 'IT',
        companySize: pick(['50-100', '100-500', '500-1000']),
        location: pick(LOCS), status: 'approved',
        hrMembers: [hr._id], createdBy: hr._id,
      })
    }
    compDocs.push(c)
  }

  const TOTAL = 1000
  const BATCH = 200
  for (let b = 0; b < TOTAL / BATCH; b++) {
    const jobs = []
    for (let i = 0; i < BATCH; i++) {
      const n = b * BATCH + i + 1
      const comp = pick(compDocs)
      const salMin = pick([8, 10, 15, 20, 25, 30]) * 1e6
      jobs.push({
        companyId: comp._id, createdByHR: hr._id,
        title: `${pick(TITLES)} #${n}`,
        description: `Vị trí tại ${comp.name}. Tìm ứng viên tài năng.`,
        requirements: `Yêu cầu ${pickN(SKILLS, 2).join(', ')}`,
        benefits: 'Lương cạnh tranh, BHSK, WFH',
        salaryRange: { min: salMin, max: salMin + pick([5, 10, 15, 20]) * 1e6 },
        location: pick(LOCS), employmentType: pick(TYPES),
        experienceLevel: pick(LEVELS), skills: pickN(SKILLS, 3 + Math.floor(Math.random() * 4)),
        status: 'published',
      })
    }
    await Job.insertMany(jobs)
    console.log(`  [${(b + 1) * BATCH}/${TOTAL}] created`)
  }

  console.log(`\n[DONE] ${TOTAL} jobs seeded!`)
  process.exit(0)
}

run().catch(e => { console.error(e); process.exit(1) })
