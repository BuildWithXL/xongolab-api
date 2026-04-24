'use strict'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const year = () => new Date().getFullYear()

const submittedAt = () =>
  new Date().toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'UTC'
  }) + ' UTC'

// ─── Thank-you email (sent to user) ──────────────────────────────────────────

/**
 * @param {string} name     User's name
 * @param {string} formName Human-readable form name
 * @returns {{ html: string, text: string }}
 */
const generateThankYouEmail = (name, formName) => {
  const fromEmail = process.env.FROM_EMAIL || ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Thank you — Xongolab</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#0D0D0D;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:28px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" width="540" cellpadding="0" cellspacing="0"
             style="max-width:540px;width:100%;background-color:#FFFFFF;border:1px solid #dddddd;">

        <!-- Header -->
        <tr>
          <td style="background-color:#0D0D0D;padding:22px 28px;text-align:center;">
            <p style="margin:0;color:#FFFFFF;font-size:20px;font-weight:bold;letter-spacing:1px;">XONGOLAB</p>
            <p style="margin:5px 0 0;color:#DE788B;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Technologies LLP</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:28px 28px 20px;">
            <p style="margin:0 0 14px;font-size:17px;font-weight:bold;color:#0D0D0D;">Hi, ${escapeHtml(name)},</p>
            <p style="margin:0 0 18px;font-size:14px;line-height:1.75;color:#7E7E7E;">
              We are in receipt of your inquiry along with the details provided by you. An engagement manager @ XongoLab will go through it. You may receive a call or email regarding the same.
            </p>

            <p style="margin:0 0 10px;font-size:14px;line-height:1.75;color:#7E7E7E;">You can also reach out to us with the following contacts:</p>

            <!-- Contact details box -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background-color:#fff0f3;border-left:3px solid #E43C5C;padding:14px 16px;">
                  <p style="margin:0 0 6px;font-size:13px;color:#0D0D0D;"><strong>Whatsapp Number : +91 990 9262 648</strong></p>
                  <p style="margin:0;font-size:13px;color:#0D0D0D;"><strong>Call us On : +91 990 9262 648</strong></p>
                </td>
              </tr>
            </table>

            <p style="margin:20px 0 6px;font-size:13px;line-height:1.7;color:#7E7E7E;text-align:center;">
              We feel honored to have your initial trust.
            </p>
            <p style="margin:0;font-size:13px;font-weight:bold;line-height:1.7;color:#0D0D0D;text-align:center;">
              Once again, thank you for choosing XongoLab Technologies LLP.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:#f8f8f8;padding:14px 28px;border-top:1px solid #dddddd;text-align:center;">
            <p style="margin:0;font-size:11px;color:#7E7E7E;">
              &copy; ${year()} XongoLab Technologies LLP. All rights reserved.<br>
              This is an automated message &#8212; please do not reply directly.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`

  const text = `Thank you for contacting XongoLab
=====================================

Hi ${name},

We are in receipt of your inquiry along with the details provided by you. An engagement manager @ XongoLab will go through it. You may receive a call or email regarding the same.

You can also reach out to us with the following contacts:
  Whatsapp Number : +91 990 9262 648
  Call us On      : +91 990 9262 648

We feel honored to have your initial trust.

Once again, thank you for choosing XongoLab Technologies LLP.

--
© ${year()} XongoLab Technologies LLP. All rights reserved.
This is an automated message — please do not reply directly.`

  return { html, text }
}

// ─── Admin notification email ─────────────────────────────────────────────────

/**
 * @param {string} formName Human-readable form name
 * @param {Object} data     All form fields as key-value pairs
 * @returns {{ html: string, text: string }}
 */
const generateAdminEmail = (formName, data) => {
  const date = submittedAt()

  // ── HTML rows ──
  const htmlRows = Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([key, value], i) => {
      const bg = i % 2 === 0 ? '#FFFFFF' : '#f8f8f8'
      return `
        <tr style="background-color:${bg};">
          <td style="padding:10px 12px;border:1px solid #dddddd;font-size:13px;font-weight:bold;
                     color:#7E7E7E;width:36%;vertical-align:top;">${escapeHtml(key)}</td>
          <td style="padding:10px 12px;border:1px solid #dddddd;font-size:13px;
                     color:#0D0D0D;word-break:break-word;">${escapeHtml(String(value))}</td>
        </tr>`
    })
    .join('\n')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>New Submission — ${escapeHtml(formName)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#0D0D0D;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:28px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0"
             style="max-width:560px;width:100%;background-color:#FFFFFF;border:1px solid #dddddd;">

        <!-- Header -->
        <tr>
          <td style="background-color:#0D0D0D;padding:20px 28px;">
            <p style="margin:0;color:#FFFFFF;font-size:16px;font-weight:bold;">Xongolab Admin</p>
            <p style="margin:4px 0 0;color:#DE788B;font-size:12px;">New Form Submission Alert</p>
          </td>
        </tr>

        <!-- Meta -->
        <tr>
          <td style="padding:18px 28px 12px;">
            <p style="margin:0;font-size:14px;font-weight:bold;color:#0D0D0D;">Form: ${escapeHtml(formName)}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#7E7E7E;">Submitted: ${date}</p>
          </td>
        </tr>

        <!-- Data table -->
        <tr>
          <td style="padding:0 28px 28px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                   style="border-collapse:collapse;border:1px solid #dddddd;">
              <tr style="background-color:#fff0f3;">
                <th style="padding:9px 12px;border:1px solid #dddddd;text-align:left;font-size:12px;
                           text-transform:uppercase;letter-spacing:0.4px;color:#E43C5C;width:36%;">Field</th>
                <th style="padding:9px 12px;border:1px solid #dddddd;text-align:left;font-size:12px;
                           text-transform:uppercase;letter-spacing:0.4px;color:#E43C5C;">Value</th>
              </tr>
              ${htmlRows}
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:#f8f8f8;padding:14px 28px;border-top:1px solid #dddddd;text-align:center;">
            <p style="margin:0;font-size:11px;color:#7E7E7E;">
              Xongolab Admin Notification &mdash; ${year()}
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`

  // ── Plain text ──
  const separator = '----------------------------------------'
  const textRows = Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')

  const text = `NEW FORM SUBMISSION — ${formName}
${separator}
Submitted: ${date}

${textRows}

${separator}
Xongolab Admin Notification — ${year()}`

  return { html, text }
}

module.exports = { generateThankYouEmail, generateAdminEmail }
