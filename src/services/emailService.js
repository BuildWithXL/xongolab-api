'use strict'

const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

/**
 * Send a single email via SendGrid.
 * @param {string}   to              Recipient address
 * @param {string}   subject         Subject line
 * @param {string}   html            HTML body
 * @param {string}   [text='']       Plain-text alternative (reduces spam score)
 * @param {Array}    [attachments=[]] SendGrid attachment objects
 */
const sendEmail = async (to, subject, html, text = '', attachments = []) => {
  const msg = {
    to,
    from: {
      email: process.env.FROM_EMAIL,
      name: process.env.FROM_NAME || 'Xongolab'
    },
    subject,
    html,
    text,
    ...(attachments.length > 0 && { attachments })
  }

  try {
    await sgMail.send(msg)
    console.log(`[email] Sent → ${to} | "${subject}"`)
  } catch (err) {
    const sgError = err.response
      ? `SendGrid ${err.response.statusCode}: ${JSON.stringify(err.response.body)}`
      : err.message
    console.error(`[email] Failed → ${to} | ${sgError}`)
    throw new Error(`Email delivery failed: ${sgError}`)
  }
}

/**
 * Send both the user thank-you and admin notification emails in parallel.
 * @param {Object}  options
 * @param {string}  options.userEmail
 * @param {string}  options.adminEmail
 * @param {string}  options.formName
 * @param {{ html: string, text: string }} options.thankYouTemplate
 * @param {{ html: string, text: string }} options.adminTemplate
 * @param {Array}   [options.attachments=[]]  Forwarded to admin email only
 */
const sendFormEmails = async ({ userEmail, adminEmail, formName, thankYouTemplate, adminTemplate, attachments = [] }) => {
  console.log(thankYouTemplate.html);
  console.log(adminTemplate.html);
  
  await Promise.all([
    sendEmail(userEmail, 'Thank you for contacting us — Xongolab', thankYouTemplate.html, thankYouTemplate.text),
    sendEmail(adminEmail, `New Form Submission — ${formName}`, adminTemplate.html, adminTemplate.text, attachments)
  ])
}

module.exports = { sendEmail, sendFormEmails }
