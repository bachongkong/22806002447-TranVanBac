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

/**
 * Gửi email đặt lại mật khẩu
 * @param {{ email, fullName, resetUrl }} params
 */
export const sendResetPasswordEmail = async ({ email, fullName, resetUrl }) => {
  const subject = 'SmartHire — Yêu cầu đặt lại mật khẩu'
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2563eb;">Xin chào ${fullName},</h2>
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản <strong>SmartHire</strong> của bạn.</p>
      <p>Vui lòng nhấn nút bên dưới để tiến hành đặt lại mật khẩu mới:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}"
           style="background-color: #2563eb; color: white; padding: 12px 32px;
                  text-decoration: none; border-radius: 6px; font-weight: bold;
                  display: inline-block;">
          Đặt lại mật khẩu
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">
        Hoặc copy đường link sau vào trình duyệt:<br/>
        <a href="${resetUrl}" style="color: #2563eb; word-break: break-all;">${resetUrl}</a>
      </p>
      <p style="color: #6b7280; font-size: 14px;">
        Link này sẽ hết hạn sau <strong>1 giờ</strong>.
      </p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="color: #9ca3af; font-size: 12px;">
        Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này. Mật khẩu của bạn vẫn an toàn.
      </p>
    </div>
  `

  return sendEmail({ to: email, subject, html })
}

/**
 * Gửi email mời phỏng vấn
 */
export const sendInterviewInviteEmail = async ({ email, candidateName, jobTitle, companyName, scheduledAt, type, location, meetingLink }) => {
  const subject = `[${companyName}] Thư mời phỏng vấn - ${jobTitle}`
  const modeText = type === 'online' ? 'Trực tuyến (Online)' : 'Trực tiếp (Offline)'
  const addressHtml = type === 'online' 
    ? `<strong>Link tham gia:</strong> <a href="${meetingLink}" style="color: #2563eb;">${meetingLink}</a>`
    : `<strong>Địa điểm:</strong> ${location}`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2563eb;">Kính gửi ${candidateName},</h2>
      <p>Cảm ơn bạn đã quan tâm và ứng tuyển vị trí <strong>${jobTitle}</strong> tại <strong>${companyName}</strong>.</p>
      <p>Chúng tôi rất ấn tượng với hồ sơ của bạn và mong muốn hiểu rõ hơn về bạn thông qua buổi phỏng vấn sắp tới.</p>
      
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1f2937;">Thông tin buổi phỏng vấn:</h3>
        <p><strong>Thời gian:</strong> ${new Date(scheduledAt).toLocaleString('vi-VN')}</p>
        <p><strong>Hình thức:</strong> ${modeText}</p>
        <p>${addressHtml}</p>
      </div>

      <p>Vui lòng xác nhận khả năng tham dự bằng cách phản hồi lại email này. Nếu có bất kỳ thay đổi nào, hãy báo cho chúng tôi càng sớm càng tốt.</p>
      <p>Trân trọng,<br/><strong>Bộ phận Nhân sự - ${companyName}</strong></p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="color: #9ca3af; font-size: 12px;">Được gửi tự động từ hệ thống SmartHire.</p>
    </div>
  `

  return sendEmail({ to: email, subject, html })
}

/**
 * Gửi email báo hủy phỏng vấn
 */
export const sendInterviewCancelEmail = async ({ email, candidateName, jobTitle, companyName, scheduledAt }) => {
  const subject = `[${companyName}] Thông báo hủy lịch phỏng vấn - ${jobTitle}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #ef4444;">Kính gửi ${candidateName},</h2>
      <p>Chúng tôi rất tiếc phải thông báo rằng buổi phỏng vấn cho vị trí <strong>${jobTitle}</strong> tại <strong>${companyName}</strong> dự kiến vào lúc <strong>${new Date(scheduledAt).toLocaleString('vi-VN')}</strong> đã bị hủy.</p>
      <p>Mong bạn thông cảm cho sự bất tiện này. Chúng tôi sẽ liên hệ lại nếu có lịch thay thế hoặc cơ hội khác phù hợp hơn trong tương lai.</p>
      <p>Chúc bạn nhiều sức khỏe và thành công,</p>
      <p>Trân trọng,<br/><strong>Bộ phận Nhân sự - ${companyName}</strong></p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="color: #9ca3af; font-size: 12px;">Được gửi tự động từ hệ thống SmartHire.</p>
    </div>
  `

  return sendEmail({ to: email, subject, html })
}
