# TrialGuard Pro Deployment Guide

This frontend is configured for an **architect-level production deployment** using Next.js.

## 🚀 Recommended Hosting
We recommend **Vercel** or **Netlify** for hosting this application, as they natively support the Next.js Server-Side Proxy configured in `next.config.ts`.

## 🔑 Environment Variables & Secrets
You must configure the following environment variables in your hosting provider (e.g., Vercel Project Settings > Environment Variables) or GitHub Secrets.

| Variable Name | Description | Value (Production) |
|--------------|-------------|-------------------|
| `BACKEND_API_URL` | The HTTP URL of your Python backend. The Next.js server will securely proxy requests to this URL. | `http://3.25.54.95` |
| `NEXT_PUBLIC_API_KEY` | Your secure API key for backend authentication. | `[Your Secret Key]` |

## 🛡️ Architecture Highlights
1.  **Secure Proxy**: Requests go from `Client -> Next.js Server (/api/proxy) -> Python Backend`. This hides your backend URL and solves Mixed Content (HTTPS/HTTP) issues.
2.  **GitHub Actions**: A CI/CD workflow is set up in `.github/workflows/production.yml` to Lint and Build your application on every push.
3.  **Production Optimization**: The app is configured for strict mode, minification, and optimized asset loading.

## 📦 How to Deploy
1.  Push the `frontend` branch to GitHub.
2.  Import the repository into Vercel/Netlify.
3.  Add the **Environment Variables** listed above.
4.  Deploy!
