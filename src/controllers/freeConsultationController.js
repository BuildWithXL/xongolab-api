'use strict'

const { sendFormEmails } = require('../services/emailService')
const { generateThankYouEmail, generateAdminEmail } = require('../services/templateService')

const FORM_NAME = 'Free Consultation'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const submit = async (request, reply) => {
  const fields = {}

  for await (const part of request.parts()) {
    if (part.type !== 'file') {
      fields[part.fieldname] = part.value?.trim() ?? ''
    }
  }

  const { fname, lname, email, phone, subject, budget, comments } = fields

  // Both first and last name are required (mirrors consultation.ts)
  if (!fname || !lname || !email) {
    return reply.status(400).send({ success: false, message: 'First name, last name and email are required' })
  }
  if (!EMAIL_REGEX.test(email)) {
    return reply.status(400).send({ success: false, message: 'Please enter a valid email address' })
  }

  const fullName = `${fname} ${lname}`

  await sendFormEmails({
    userEmail: email,
    adminEmail: process.env.ADMIN_EMAIL,
    formName: FORM_NAME,
    thankYouTemplate: generateThankYouEmail(fullName, FORM_NAME),
    adminTemplate: generateAdminEmail(FORM_NAME, {
      'First Name': fname,
      'Last Name': lname,
      'Email': email,
      ...(phone    && { 'Phone': phone }),
      ...(subject  && { 'Subject': subject }),
      ...(budget   && { 'Estimated Budget': budget }),
      ...(comments && { 'Requirement/Comments': comments })
    })
  })

  return reply.send({ success: true, message: "Thank you! We'll be in touch shortly." })
}

module.exports = { submit }
