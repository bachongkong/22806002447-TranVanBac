import nodemailer from 'nodemailer'
import { env } from '../config/index.js'

/**
 * Tạo Nodemailer transporter
 * Development: dùng Ethereal (fake SMTP) nếu không cấu hình SMTP
 * Production: dùng SMTP thật (Gmail, SendGrid, Mailgun...)
 */
const createTransporter = () => {
  // Nếu có cấu hình SMTP thật
  if (env.SMTP_HOST && env.SMTP_USER) {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT) || 587,
      secure: Number(env.SMTP_PORT) === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    })
  }

  // Development fallback: log ra console
  return null
}

let transporter = null

/**
 * Gửi email
 * @param {{ to, subject, html }} options
 */
export const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    transporter = createTransporter()
  }

  // Nếu không có transporter (dev mode, chưa config SMTP)
  // => log ra console thay vì gửi thật
  if (!transporter) {
    console.log('============================================')
    console.log('[DEV EMAIL] No SMTP configured — email logged below')
    console.log(`  To:      ${to}`)
    console.log(`  Subject: ${subject}`)
    console.log(`  Body:    ${html}`)
    console.log('============================================')
    return { messageId: 'dev-mode', preview: 'logged-to-console' }
  }

  const mailOptions = {
    from: env.EMAIL_FROM || `"SmartHire" <noreply@smarthire.com>`,
    to,
    subject,
    html,
  }

  const info = await transporter.sendMail(mailOptions)
  return info
}

/**
 * Gửi email xác thực tài khoản
 * @param {{ email, fullName, verificationUrl }} params
 */
export const sendVerificationEmail = async ({ email, fullName, verificationUrl }) => {
  const subject = 'SmartHire — Xác thực tài khoản email'
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2563eb;">Xin chào ${fullName},</h2>
      <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>SmartHire</strong>.</p>
      <p>Vui lòng nhấn nút bên dưới để xác thực email của bạn:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}"
           style="background-color: #2563eb; color: white; padding: 12px 32px;
                  text-decoration: none; border-radius: 6px; font-weight: bold;
                  display: inline-block;">
          Xác thực email
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">
        Hoặc copy đường link sau vào trình duyệt:<br/>
        <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
      </p>
      <p style="color: #6b7280; font-size: 14px;">
        Link này sẽ hết hạn sau <strong>24 giờ</strong>.
      </p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="color: #9ca3af; font-size: 12px;">
        Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.
      </p>
    </div>
  `

  return sendEmail({ to: email, subject, html })
}
