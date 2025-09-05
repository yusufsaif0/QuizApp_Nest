# Next.js Quiz App — README

**Project:** Simple multi-step Quiz built with Next.js (App Router)

**What this repo contains**

* A Next.js app (App Router) that shows a 5-question multi-step quiz.
* Client UI (React) saves answers and posts to a server API route.
* Server route saves results to MongoDB (Atlas) and sends a confirmation email via ZeptoMail.
* Responsive CSS in `app/globals.css` and components in `app/components/`.

---

## Table of contents

1. Overview
2. Tech stack
3. Project structure
4. Prerequisites
5. Local setup (step-by-step)
6. Environment variables (explain each)
7. MongoDB Atlas setup
8. ZeptoMail setup (quick)
9. Run & test locally
10. Build for production
11. Deploy to Vercel (step-by-step)
12. Updating the app (after deploy)
13. Manual deploy with Vercel CLI
14. Preview deployments & branching
15. Troubleshooting & tips
16. Security considerations
17. FAQ
18. License

---

## 1 — Overview

This repository implements a small, end-to-end example:

* A **multi-part quiz** UI (client-side React in Next.js).
* A **server-side API** (Next.js route handler) that computes score and personalized recommendation, writes a document to **MongoDB**, and sends an email via **ZeptoMail**.

The README focuses on how to get the app running locally and how to deploy it to **Vercel** (recommended for Next.js apps).

---

## 2 — Tech stack

* Next.js (App Router) — UI + server route handlers
* React (client components)
* MongoDB Atlas (hosted DB)
* ZeptoMail (transactional email provider)
* Vercel (deployment platform)
* Node.js 18.18+ (runtime)

---

## 3 — Project structure (important files)

```
my-quiz-app/
├─ app/
│  ├─ layout.jsx
│  ├─ page.jsx
│  ├─ globals.css
│  ├─ components/QuizForm.jsx
│  └─ api/submit/route.js
├─ lib/mongodb.js
├─ package.json
└─ .env.local (local, NOT committed)
```

**Key server file**: `app/api/submit/route.js` — receives `{ name, email, answers }`, computes score, saves result to `results` collection and sends email via ZeptoMail.

**Mongo util**: `lib/mongodb.js` — caches Mongo client across serverless invocations.

---

## 4 — Prerequisites

* Node.js 18.18 or newer (use `nvm` to manage versions if needed)
* Git and a GitHub account (for Vercel integration)
* MongoDB Atlas account (free tier available)
* ZeptoMail (Zoho) account — you can test with a verified single email while account is under validation
* Vercel account (free tier)

---

## 5 — Local setup (step-by-step)

1. Clone the repo

```bash
git clone https://github.com/<your-username>/quiz-app.git
cd quiz-app
```

2. Install dependencies

```bash
npm install
# or
# yarn
```

3. Create a `.env.local` file at the project root (see next section for variables)
4. Start the dev server

```bash
npm run dev
# opens at http://localhost:3000
```

---

## 6 — Environment variables

Create `.env.local` with the following variables (example):

```bash
# .env.local (do NOT commit)
NODE_ENV=development
MONGODB_URI="mongodb+srv://<dbUser>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
MONGODB_DB="quizdb"
ZEPTOMAIL_TOKEN="<your_zeptomail_sendmail_token>"
ZEPTOMAIL_FROM="verified@yourdomain.com"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**Descriptions**:

* `MONGODB_URI` — connection string from MongoDB Atlas. Replace `<dbUser>` and `<password>` with the DB user you created.
* `MONGODB_DB` — database name the server uses (default `quizdb`).
* `ZEPTOMAIL_TOKEN` — Send Mail Token from ZeptoMail Mail Agent (server-side secret).
* `ZEPTOMAIL_FROM` — Verified "from" email or domain (must be verified in ZeptoMail).
* `NEXT_PUBLIC_BASE_URL` — optional base URL used for links in email; in prod set to your Vercel URL.

> **Important**: never commit `.env.local` to source control. Use Vercel’s Environment Variables UI for production.

---

## 7 — MongoDB Atlas setup (quick)

1. Sign up at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (Shared Tier)
3. Create a Database User (username/password) in Security → Database Access
4. Network Access → add your IP or use `0.0.0.0/0` for testing (less secure)
5. Connect → Choose "Connect your application" to get the `MONGODB_URI` string and paste into `.env.local`.

Security tip: restrict IPs or use private networking for production.

---

## 8 — ZeptoMail setup (short)

1. Sign in to ZeptoMail (Zoho) and create a **Mail Agent**.
2. Inside the Mail Agent: add/verify your **sender domain** or a single **email address** (quick test). Verify the email by clicking the link ZeptoMail sends.
3. In the Mail Agent → **SMTP / API** (or Setup Info) → **Generate Send Mail Token** and copy it.
4. Set `ZEPTOMAIL_TOKEN` and `ZEPTOMAIL_FROM` in `.env.local` and in Vercel environment variables.

While ZeptoMail account is under validation you can test using a single verified email address.

---

## 9 — Run & test locally

Start dev server:

```bash
npm run dev
```

Open `http://localhost:3000` and submit the quiz.

**Check the DB**: In Atlas UI, open Collections → `quizdb` → `results` to see saved documents.

**Email test**: If ZeptoMail is configured correctly and your `ZF_TOKEN` + `FROM` are set, the API route will send confirmation email. Check the recipient inbox.

If you want a standalone test:

* Create a small Node script `test-mail.js` (example in repo) that imports `zeptomail` and calls `sendMail` using the same token.

---

## 10 — Build for production

```bash
npm run build
npm start    # or let Vercel handle serving in prod
```

Local `npm start` runs the optimized production server if you want to test production mode.

---

## 11 — Deploy to Vercel (detailed step-by-step)

### Step A — Prepare repository

1. Push your project to GitHub:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step B — Import into Vercel

1. Log in to [https://vercel.com](https://vercel.com) using your GitHub account.
2. Click **New Project** → **Import Git Repository** → pick your repo.
3. Vercel will detect Next.js and set recommended build settings:

   * Build Command: `npm run build` (default)
   * Output Directory: (auto)
4. Click **Deploy** (you can configure environment variables first — recommended).

### Step C — Add environment variables in Vercel

1. In the Project → Settings → Environment Variables, add:

   * `MONGODB_URI` (value from Atlas)
   * `MONGODB_DB` (optional)
   * `ZEPTOMAIL_TOKEN`
   * `ZEPTOMAIL_FROM`
   * `NEXT_PUBLIC_BASE_URL` = `https://<your-vercel-url>`
2. Add separate variables for **Production**, **Preview**, and **Development** as needed.

> After adding env vars, trigger a redeploy (by pushing a new commit or click Redeploy in the Deployments tab).

### Step D — Wait for build & visit site

1. Vercel will run the build. Monitor build logs in the Vercel dashboard.
2. After successful build, open the assigned domain (e.g., `https://quiz-app.vercel.app`).

---

## 12 — Updating the app (after deploy)

**Workflow (recommended)**

1. Make code changes locally.
2. `git add` → `git commit -m "..."` → `git push origin main` (or push to a branch).
3. Vercel will auto-trigger a new build & deploy for the branch.
4. For feature branches, Vercel provides Preview URLs automatically.

**Manual deploy**: Use `vercel --prod` from the project directory (instructions in section 13).

---

## 13 — Manual deploy with Vercel CLI

1. Install CLI:

```bash
npm install -g vercel
```

2. Link project and login:

```bash
vercel login
vercel   # follow prompts (first-time will link project)
```

3. Deploy to production explicitly:

```bash
vercel --prod
```

This deploys the current working tree to production.

---

## 14 — Preview deployments & branching

* Push feature branches: Vercel creates a unique preview URL for each branch (e.g. `https://your-project-git-feature-xyz-username.vercel.app`).
* Use preview URLs for QA before merging to `main`.

---

## 15 — Troubleshooting & common issues

**1. `MONGODB_URI` connection errors**

* Ensure Atlas Network Access allows connections (IP allowlist). For dev, you can allow `0.0.0.0/0` but restrict for prod.
* Confirm username/password are correct and the DB user has read/write permissions.

**2. ZeptoMail errors ("sender not verified" / token invalid)**

* Verify the `ZEPTOMAIL_FROM` address or domain in ZeptoMail Mail Agent.
* Regenerate the Send Mail Token if suspect compromised and update env vars.

**3. Build fails on Vercel**

* Check build logs in Vercel dashboard for the exact error.
* Confirm `NODE_ENV`, `MONGODB_URI` and other required env vars are set in Vercel.

**4. Production email not sending**

* Your ZeptoMail account may be under validation — sending may be restricted.
* Verify SPF/DKIM DNS records for a domain for better deliverability.

---

## 16 — Security & Best Practices

* **Never** commit `.env.local` or secrets to git. Add `.env.local` to `.gitignore`.
* Use Vercel’s environment variables UI to store secrets.
* Rotate tokens and credentials periodically.
* Restrict MongoDB Atlas IP access and use least privileged DB user.
* Use HTTPS for production URLs (Vercel provides this by default).


