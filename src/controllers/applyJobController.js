'use strict'

const { sendFormEmails } = require('../services/emailService')
const { generateThankYouEmail, generateAdminEmail } = require('../services/templateService')

const FORM_NAME = 'Job Application'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Mirrors the extensions listed in the UI: .pdf .docx .odt .ods .ppt .xls .rtf .text
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.oasis.opendocument.spreadsheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/rtf',
  'text/rtf',
  'text/plain'
])

const submit = async (request, reply) => {
  const fields = {}
  const attachments = []

  // Iterate all multipart parts (text fields + optional file)
  for await (const part of request.parts()) {
    if (part.type === 'file') {
      if (!ALLOWED_MIME_TYPES.has(part.mimetype)) {
        // Must drain the stream before replying
        await part.toBuffer().catch(() => {})
        return reply.status(400).send({
          success: false,
          message: `Invalid file type "${part.mimetype}". Accepted: PDF, DOCX, ODT, ODS, PPT, XLS, RTF, TXT`
        })
      }

      const buffer = await part.toBuffer()

      // @fastify/multipart enforces the fileSize limit set in app.js,
      // but we double-check here in case it was bypassed.
      if (buffer.length > 10 * 1024 * 1024) {
        return reply.status(400).send({ success: false, message: 'File size exceeds the 10 MB limit' })
      }

      if (buffer.length > 0) {
        attachments.push({
          content: buffer.toString('base64'),
          filename: part.filename,
          type: part.mimetype,
          disposition: 'attachment'
        })
      }
    } else {
      fields[part.fieldname] = part.value?.trim() ?? ''
    }
  }

  const { fname, email, phone, comments, consent } = fields

  // Required field validation
  if (!fname || !email || !phone) {
    return reply.status(400).send({ success: false, message: 'Name, email and phone are required' })
  }
  if (!EMAIL_REGEX.test(email)) {
    return reply.status(400).send({ success: false, message: 'Please enter a valid email address' })
  }

  const adminEmail = process.env.HR_EMAIL || process.env.ADMIN_EMAIL

  await sendFormEmails({
    userEmail: email,
    adminEmail,
    formName: FORM_NAME,
    thankYouTemplate: generateThankYouEmail(fname, FORM_NAME),
    adminTemplate: generateAdminEmail(FORM_NAME, {
      'Full Name': fname,
      'Email': email,
      'Phone': phone,
      ...(comments && { 'Message': comments }),
      'Email Consent': consent === 'yes' ? '✓ Yes' : '✗ No',
      ...(attachments.length > 0 && { 'Resume': `${attachments[0].filename} (attached)` })
    }),
    attachments  // resume forwarded as attachment on the admin email only
  })

  return reply.send({ success: true, message: 'Application submitted successfully' })
}

module.exports = { submit }
