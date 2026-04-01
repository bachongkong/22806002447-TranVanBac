import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import User from '../../models/User.js'
import { ApiError } from '../../common/index.js'

/**
 * Upload and resize user avatar
 * @param {string} userId
 * @param {Buffer} fileBuffer
 * @returns {Promise<string>} public URL of the avatar
 */
const uploadAvatar = async (userId, fileBuffer) => {
  if (!fileBuffer) {
    throw ApiError.badRequest('Please upload an image file')
  }

  // Ensure public directory exists
  const uploadDir = path.join(process.cwd(), 'public/uploads/avatars')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const filename = `avatar-${userId}-${Date.now()}.webp`
  const filepath = path.join(uploadDir, filename)

  try {
    // Resize to 150x150, crop to cover, save as webp
    await sharp(fileBuffer)
      .resize(150, 150, { fit: 'cover' })
      .toFormat('webp')
      .webp({ quality: 80 })
      .toFile(filepath)
  } catch (err) {
    throw ApiError.internal('Failed to process and save image')
  }

  const publicUrl = `/public/uploads/avatars/${filename}`

  // Update user profile in DB
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { 'profile.avatar': publicUrl } },
    { new: true }
  )

  if (!updatedUser) {
    throw ApiError.notFound('User not found')
  }

  return publicUrl
}

const userService = {
  uploadAvatar,
}

export default userService
