'use strict'

// Actual form fields (from Free Consultation UI):
//   fname*, lname*, email*, phone, subject, budget, comments
//
// Content-Type: multipart/form-data — validation is done manually in the controller.

const freeConsultationSchema = {
  tags: ['Free Consultation'],
  summary: 'Submit free consultation form',
  description:
    'Accepts `multipart/form-data`.\n\n' +
    '**Required fields:** `fname`, `lname`, `email`\n\n' +
    '**Optional fields:** `phone`, `subject`, `budget` (Estimated Budget), `comments` (Requirement/Comments)\n\n' +
    'Sends a thank-you email to the user and a notification to the admin.',
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

module.exports = { freeConsultationSchema }
