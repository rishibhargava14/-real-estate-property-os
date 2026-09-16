# Real Estate Property OS — Backend

Express + MongoDB backend for the Real Estate Property OS.

## Local setup

1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Set `MONGODB_URI` and `JWT_SECRET`.
5. Run `npm run dev`.
6. Open `http://localhost:5000/api/health`.

## API groups

- `/api/auth`
- `/api/properties`
- `/api/sitevisits`
- `/api/leads`
- `/api/photo`
- `/api/whatsapp`
- `/api/audit`

## Deployment

Recommended first deployment:
- MongoDB Atlas for database
- Render or Railway for the Node/Express API

Important: local filesystem uploads are suitable for development only. For production, use Cloudinary/S3-compatible object storage because many cloud hosts use ephemeral filesystems.
