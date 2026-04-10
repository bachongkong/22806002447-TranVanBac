import { Router } from 'express'

import authRoutes from '../modules/auth/auth.routes.js'
import userRoutes from '../modules/user/user.routes.js'
import companyRoutes from '../modules/company/company.routes.js'
import jobRoutes from '../modules/job/job.routes.js'
import applicationRoutes from '../modules/application/application.routes.js'
import cvRoutes from '../modules/cv/cv.routes.js'
import interviewRoutes from '../modules/interview/interview.routes.js'
import notificationRoutes from '../modules/notification/notification.routes.js'
import chatRoutes from '../modules/chat/chat.routes.js'
import adminRoutes from '../modules/admin/admin.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/companies', companyRoutes)
router.use('/jobs', jobRoutes)
router.use('/applications', applicationRoutes)
router.use('/cvs', cvRoutes)
router.use('/interviews', interviewRoutes)
router.use('/notifications', notificationRoutes)
router.use('/chat', chatRoutes)
router.use('/admin', adminRoutes)

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router
