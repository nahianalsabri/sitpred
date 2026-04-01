# SitPred — Situation Predictor
### Game Theory × AI · Powered by Google Gemini (Free)

---

## Step 1 — Get your FREE Gemini API key (2 minutes, no credit card)

1. Go to **aistudio.google.com**
2. Sign in with your Google account
3. Click **"Get API Key"** in the top left
4. Click **"Create API key"**
5. Copy the key — it looks like: `AIzaSy...`

That's it. Free. No credit card. 1,500 requests/day.

---

## Step 2 — Put files on GitHub

1. Go to **github.com** and create a free account
2. Click the green **"New"** button
3. Name it `sitpred` → set to Public → click **"Create repository"**
4. Click **"uploading an existing file"**
5. Drag and drop ALL your files (keep the `public/` folder structure)
6. Click **"Commit changes"**

---

## Step 3 — Deploy FREE on Render.com

1. Go to **render.com** → sign up free with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your `sitpred` repo
4. Fill in:
   - **Name:** sitpred
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free
5. Click **"Advanced"** → **"Add Environment Variable"**
   - Key: `GEMINI_API_KEY`
   - Value: paste your key from aistudio.google.com
6. Click **"Create Web Service"**

Wait ~2 minutes → you get a live URL like:
**https://sitpred.onrender.com**

Share that link on LinkedIn!

---

## Run locally (optional)

```bash
npm install
cp .env.example .env
# Paste your Gemini key into .env
npm start
# Open http://localhost:3000
```

---

Built by Nahian Al Sabri · Powered by Google Gemini
