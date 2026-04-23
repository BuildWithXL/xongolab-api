'use strict'

// Actual form fields (from careers form UI):
//   fname*, email*, phone*, comments, consent (yes/no), file (resume attachment)
//
// Content-Type: multipart/form-data — Fastify JSON schema validation is skipped;
// all field validation is done manually in the controller.

const applyJobSchema = {
  tags: ['Apply for Job'],
  summary: 'Submit job application form',
  description:
    'Accepts `multipart/form-data`.\n\n' +
    '**Required fields:** `fname`, `email`, `phone`\n\n' +
    '**Optional fields:** `comments` (message/cover letter), `consent` (`yes`|`no`), ' +
    '`file` (resume — PDF, DOCX, ODT, ODS, PPT, XLS, RTF, TXT · max 10 MB)\n\n' +
    'Sends a thank-you email to the applicant and forwards all details + attached resume to HR.',
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

module.exports = { applyJobSchema }
