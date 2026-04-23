'use strict'

// Actual form fields (from contact form UI):
//   fname* (first name), lname (last name), email*, country*, phone*,
//   subject, budget, comments, file (optional attachment)
//
// Content-Type: multipart/form-data — validation is done manually in the controller.

const contactUsSchema = {
  tags: ['Contact Us'],
  summary: 'Submit contact us form',
  description:
    'Accepts `multipart/form-data`.\n\n' +
    '**Required fields:** `fname`, `email`, `country`, `phone`\n\n' +
    '**Optional fields:** `lname`, `subject`, `budget`, `comments` (project description), ' +
    '`file` (attachment — PDF, DOCX, ODT, ODS, PPT, XLS, RTF, TXT · max 10 MB)\n\n' +
    'Sends a thank-you email to the user and a notification (with attachment if any) to the admin.',
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      }
    },
    400: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      }
    }
  }
}

module.exports = { contactUsSchema }
