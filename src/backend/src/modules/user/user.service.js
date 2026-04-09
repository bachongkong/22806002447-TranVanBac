import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import User from '../../models/User.js'
import { ApiError } from '../../common/index.js'
import { uploadImageBufferToCloudinary } from '../../utils/index.js'

const AVATAR_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'avatars')
const AVATAR_CLOUDINARY_FOLDER = 'recruitment-platform/avatars'

async function findUserProfileById(userId) {
  const user = await User.findById(userId)
    .populate('companyId')
    .select('-passwordHash -refreshToken -emailVerificationToken -emailVerificationExpires')

  if (!user) {
    throw ApiError.notFound('User not found')
  }

  return user
}

async function processAvatarImage(fileBuffer) {
  try {
    return await sharp(fileBuffer)
      .resize(150, 150, { fit: 'cover' })
      .toFormat('webp')
      .webp({ quality: 80 })
      .toBuffer()
  } catch {
    throw ApiError.internal('Failed to process and save image')
  }
}

function saveAvatarToLocalStorage(userId, processedBuffer) {
  if (!fs.existsSync(AVATAR_UPLOAD_DIR)) {
    fs.mkdirSync(AVATAR_UPLOAD_DIR, { recursive: true })
  }

  const filename = `avatar-${userId}-${Date.now()}.webp`
  const filePath = path.join(AVATAR_UPLOAD_DIR, filename)
  fs.writeFileSync(filePath, processedBuffer)

  return `/public/uploads/avatars/${filename}`
}

const uploadAvatar = async (userId, fileBuffer) => {
  if (!fileBuffer) {
    throw ApiError.badRequest('Please upload an image file')
  }

  const processedBuffer = await processAvatarImage(fileBuffer)
  const publicId = `avatar-${userId}-${Date.now()}`

  const cloudinaryUrl = await uploadImageBufferToCloudinary({
    buffer: processedBuffer,
    folder: AVATAR_CLOUDINARY_FOLDER,
    publicId,
    filename: `${publicId}.webp`,
  })

  const avatarUrl = cloudinaryUrl || saveAvatarToLocalStorage(userId, processedBuffer)

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { 'profile.avatar': avatarUrl } },
    { new: true }
  )

  if (!updatedUser) {
    throw ApiError.notFound('User not found')
  }

  return avatarUrl
}

const userService = {
  getProfile: async (userId) => {
    return findUserProfileById(userId)
  },

  updateProfile: async (userId, updateData) => {
    const user = await findUserProfileById(userId)

    Object.assign(user.profile, updateData)
    await user.save()

    return findUserProfileById(userId)
  },

  changePassword: async (userId, oldPassword, newPassword) => {
    const user = await User.findById(userId).select('+passwordHash')

    if (!user) {
      throw ApiError.notFound('User not found')
    }

    const isMatch = await user.comparePassword(oldPassword)
    if (!isMatch) {
      throw ApiError.badRequest('Incorrect old password')
    }

    user.passwordHash = newPassword
    await user.save()

    return { success: true }
  },

  uploadAvatar,
}

export default userService
