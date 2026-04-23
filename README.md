# Xongolab API

Production-ready Node.js + Fastify backend for handling form submissions and sending emails via SendGrid.

---

## Tech Stack

| Layer | Package |
|---|---|
| Framework | [Fastify v5](https://fastify.dev) |
| Env validation | `@fastify/env` |
| CORS | `@fastify/cors` |
| API docs | `@fastify/swagger` + `@fastify/swagger-ui` |
| Email | `@sendgrid/mail` |

---

## Prerequisites

- Node.js **v20+**
- A [SendGrid](https://sendgrid.com) account with a verified sender email
- A SendGrid API key

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=no-reply@yourdomain.com
FROM_NAME=Xongolab

ADMIN_EMAIL=admin@yourdomain.com
HR_EMAIL=hr@yourdomain.com

# Comma-separated origins for CORS (Astro dev default shown)
CORS_ORIGIN=http://localhost:4321,https://yourdomain.com
```

### 3. Run

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

Server output:

```
  Server   : http://localhost:3000
  Docs     : http://localhost:3000/documentation
  Health   : http://localhost:3000/health
```

---

## Project Structure

```
xongolab-api/
├── server.js                    # Entry point — loads .env, starts server
├── src/
│   ├── app.js                   # Fastify instance, plugin/route registration
│   ├── plugins/
│   │   ├── env.js               # @fastify/env — validates required env vars
│   │   ├── cors.js              # @fastify/cors — CORS for Astro frontend
│   │   └── swagger.js           # OpenAPI docs at /documentation
│   ├── schemas/
│   │   ├── freeConsultationSchema.js
│   │   ├── contactUsSchema.js
│   │   ├── discussRequirementsSchema.js
│   │   └── applyJobSchema.js
│   ├── services/
│   │   ├── emailService.js      # sendEmail / sendFormEmails (SendGrid wrapper)
│   │   └── templateService.js   # generateThankYouEmail / generateAdminEmail
│   ├── controllers/
│   │   ├── freeConsultationController.js
│   │   ├── contactUsController.js
│   │   ├── discussRequirementsController.js
│   │   └── applyJobController.js
│   └── routes/
│       ├── index.js             # Aggregates all route modules
│       ├── freeConsultation.js
│       ├── contactUs.js
│       ├── discussRequirements.js
│       └── applyJob.js
├── .env.example
└── package.json
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/free-consultation` | Free consultation form |
| POST | `/api/contact-us` | Contact us form |
| POST | `/api/discuss-requirements` | Project requirements form |
| POST | `/api/apply-job` | Job application form |

Interactive docs: **http://localhost:3000/documentation**

---

## Email Flow

Every form submission triggers **two emails in parallel**:

1. **Thank-you email → user** — professional HTML email acknowledging the submission.
2. **Admin notification → ADMIN_EMAIL** (or HR_EMAIL for job applications) — clean data table with all submitted fields.

---

## Test Examples

### Health Check

```bash
curl http://localhost:3000/health
```

---

### 1. Free Consultation

```bash
curl -X POST http://localhost:3000/api/free-consultation \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1-555-0100",
    "service": "Web Development",
    "budget": "$10K–$50K",
    "message": "We need a new e-commerce platform."
  }'
```

**Success response:**
```json
{ "success": true, "message": "Form submitted successfully" }
```

**Validation error (missing required field):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "message": "must have required property 'phone'" }]
}
```

---

### 2. Contact Us

```bash
curl -X POST http://localhost:3000/api/contact-us \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Johnson",
    "email": "sarah@example.com",
    "phone": "+44-20-7946-0958",
    "subject": "Partnership Inquiry",
    "message": "We are interested in partnering with Xongolab for our upcoming project."
  }'
```

---

### 3. Discuss Requirements

```bash
curl -X POST http://localhost:3000/api/discuss-requirements \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Raj Patel",
    "email": "raj@startupco.com",
    "phone": "+91-98765-43210",
    "company": "StartupCo",
    "projectType": "SaaS Product",
    "budget": "$15K–$50K",
    "timeline": "3–6 Months",
    "details": "We need a multi-tenant SaaS dashboard with role-based access, analytics, and Stripe billing integration."
  }'
```

---

### 4. Apply for Job

```bash
curl -X POST http://localhost:3000/api/apply-job \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Emily Chen",
    "email": "emily@example.com",
    "phone": "+1-415-555-0199",
    "position": "Senior Full-Stack Developer",
    "experience": "5–8 Years",
    "resumeUrl": "https://drive.google.com/file/d/example/view",
    "portfolioUrl": "https://emilychen.dev",
    "linkedinUrl": "https://linkedin.com/in/emilychen",
    "skills": "React, Node.js, TypeScript, PostgreSQL, AWS",
    "coverLetter": "I am excited to apply for the Senior Full-Stack Developer role at Xongolab..."
  }'
```

---

## HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Form submitted and emails sent successfully |
| 400 | Request body failed schema validation |
| 500 | Internal error (e.g. SendGrid delivery failure) |

---

## Postman Collection

Import the OpenAPI spec directly into Postman:

1. Open Postman → Import
2. Select **Link** → paste `http://localhost:3000/documentation/json`
3. Postman auto-generates requests from the OpenAPI spec.

---

## Deployment Notes

- Set `NODE_ENV=production` to disable `pino-pretty` and reduce log verbosity.
- Ensure `FROM_EMAIL` is a **verified sender** in SendGrid (domain or single-sender verification).
- `CORS_ORIGIN` accepts comma-separated origins for multi-domain setups.
- For high-volume use, consider switching to SendGrid Dynamic Templates.
