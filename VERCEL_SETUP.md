# Vercel Deployment Setup

Use this guide during the "Import Project" step on Vercel.

## 1. Project Configuration
- **Framework Preset**: Next.js
- **Root Directory**: ./ (default)
- **Build Command**: `next build` (default)
- **Output Directory**: `.next` (default)

## 2. Environment Variables ⚠️ (CRITICAL)
Expand the **Environment Variables** section and add these exactly:

| Name (Key) | Value |
|------------|-------|
| `BACKEND_API_URL` | `http://3.25.54.95` |
| `NEXT_PUBLIC_API_KEY` | *(Paste your actual secret key here)* |

## 3. Post-Deployment
- Go to your deployment URL (e.g., https://trialguard-pro.vercel.app)
- Test the "Check API Status" button to ensure connection to `3.25.54.95` succeeds.
