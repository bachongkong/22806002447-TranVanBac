import User from '../../models/User.js'
import Company from '../../models/Company.js'
import { ApiError } from '../../common/index.js'

const userService = {
  getProfile: async (userId) => {
    const user = await User.findById(userId)
      .populate('companyId')
      .select('-passwordHash -refreshToken -emailVerificationToken -emailVerificationExpires')
      
    if (!user) throw ApiError.notFound('User not found')
    return user
  },

  updateProfile: async (userId, updateData) => {
    const user = await User.findById(userId).select('-passwordHash -refreshToken -emailVerificationToken -emailVerificationExpires')
    if (!user) throw ApiError.notFound('User not found')

    // Update the profile subdocument
    Object.assign(user.profile, updateData)
    
    await user.save()
    return user
  },

  changePassword: async (userId, oldPassword, newPassword) => {
    // Need to explicitly select passwordHash
    const user = await User.findById(userId).select('+passwordHash')
    if (!user) throw ApiError.notFound('User not found')

    const isMatch = await user.comparePassword(oldPassword)
    if (!isMatch) throw ApiError.badRequest('Incorrect old password')

    user.passwordHash = newPassword 
    await user.save()
    
    return { success: true }
  }
}

export default userService
