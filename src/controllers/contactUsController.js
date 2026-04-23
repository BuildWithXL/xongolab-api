'use strict'

const { sendFormEmails } = require('../services/emailService')
const { generateThankYouEmail, generateAdminEmail } = require('../services/templateService')

const FORM_NAME = 'Contact Us'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

  for await (const part of request.parts()) {
    if (part.type === 'file') {
      if (!ALLOWED_MIME_TYPES.has(part.mimetype)) {
        await part.toBuffer().catch(() => {})
        return reply.status(400).send({
          success: false,
          message: `Invalid file type "${part.mimetype}". Accepted: PDF, DOCX, ODT, ODS, PPT, XLS, RTF, TXT`
        })
      }

      const buffer = await part.toBuffer()

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

  const { fname, lname, email, country, phone, subject, budget, comments } = fields

  // fname + optional lname → single display name (mirrors contact.ts)
  const fullName = lname ? `${fname} ${lname}` : fname

  if (!fname || !email) {
    return reply.status(400).send({ success: false, message: 'Name and email are required' })
  }
  if (!EMAIL_REGEX.test(email)) {
    return reply.status(400).send({ success: false, message: 'Please enter a valid email address' })
  }

  await sendFormEmails({
    userEmail: email,
    adminEmail: process.env.ADMIN_EMAIL,
    formName: FORM_NAME,
    thankYouTemplate: generateThankYouEmail(fullName, FORM_NAME),
    adminTemplate: generateAdminEmail(FORM_NAME, {
      'Full Name': fullName,
      'Email': email,
      ...(country  && { 'Country': country }),
      ...(phone    && { 'Phone': phone }),
      ...(subject  && { 'Subject': subject }),
      ...(budget   && { 'Estimated Budget': budget }),
      ...(comments && { 'Message': comments }),
      ...(attachments.length > 0 && { 'Attached File': `${attachments[0].filename} (attached)` })
    }),
    attachments
  })

  return reply.send({ success: true, message: 'Your message has been sent successfully!' })
}

module.exports = { submit }
