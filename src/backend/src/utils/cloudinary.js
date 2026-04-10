import crypto from 'crypto'
import fetch from 'node-fetch'
import FormData from 'form-data'
import { env } from '../config/index.js'
import { ApiError } from '../common/index.js'

export function isCloudinaryConfigured() {
  return Boolean(
    env.CLOUDINARY_CLOUD_NAME &&
      env.CLOUDINARY_API_KEY &&
      env.CLOUDINARY_API_SECRET
  )
}

export async function uploadImageBufferToCloudinary({
  buffer,
  folder,
  publicId,
  filename,
}) {
  if (!isCloudinaryConfigured()) {
    return null
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`
  const signature = crypto
    .createHash('sha1')
    .update(`${paramsToSign}${env.CLOUDINARY_API_SECRET}`)
    .digest('hex')

  const formData = new FormData()
  formData.append('file', buffer, {
    filename,
    contentType: 'image/webp',
  })
  formData.append('api_key', env.CLOUDINARY_API_KEY)
  formData.append('timestamp', String(timestamp))
  formData.append('folder', folder)
  formData.append('public_id', publicId)
  formData.append('signature', signature)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  const payload = await response.json()

  if (!response.ok) {
    throw ApiError.internal(payload?.error?.message || 'Failed to upload image to Cloudinary')
  }

  return payload.secure_url || payload.url
}
