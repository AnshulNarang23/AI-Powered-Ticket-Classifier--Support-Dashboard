# AI-Powered Ticket Classifier & Support Dashboard

A small, practical support tool that lets users submit tickets and automatically tags each one by **type** and **priority**, then shows everything in an **admin-style dashboard**.

It’s intentionally lightweight: one Node/Express API, a JSON “database”, and a single-page React + Tailwind UI (loaded from CDNs). Easy to read, easy to walk through in an interview.

---

## 1. What this app does

- **Ticket submission**
  - User enters **name**, **email**, **ticket description**.
  - On submit, the backend runs a simple text classifier.
- **AI-style classification**
  - Predicts a **category**:
    - Bug Report
    - Feature Request
    - Billing Issue
    - Technical Query
    - General
  - Predicts a **priority**:
    - High / Medium / Low
- **Support dashboard**
  - Table of all tickets with:
    - Category and priority chips
    - Search by text/email
    - Filter by category and priority
    - Click a row to open a details modal

Under the hood, the “AI” is a focused NLP-style classifier based on keywords. In a real project you could swap it for a HuggingFace model without changing the rest of the app.

---

## 2. Tech stack

- **Frontend**
  - React 18 (UMD build, no bundler)
  - Tailwind CSS via CDN
- **Backend**
  - Node.js + Express
  - CORS, JSON body parsing
- **Storage**
  - `tickets.json` file as a tiny datastore

This keeps the codebase small but still shows full‑stack skills: routing, state management, API calls, and basic text classification.

---

## 3. Running the project locally

### Prerequisites

- Node.js 18+ installed

### Step 1 – Install dependencies

From the project root:

```bash
cd "AI-Powered-Ticket-Classifier---Support-Dashboard"
npm install
```

### Step 2 – Start the backend API

```bash
npm run dev
```

You should see:

```bash
API server listening on http://localhost:4000
```

Leave this terminal window open.

### Step 3 – Open the frontend dashboard

There’s no build step; the frontend is a single HTML file that pulls in React and Tailwind from CDNs.

- Option A (quick):
  - Double‑click `frontend.html` to open it in your browser.
- Option B (recommended if you have Live Server):
  - Open the project in VS Code.
  - Right‑click `frontend.html` → “Open with Live Server”.

The page expects the API at `http://localhost:4000`, which matches the dev server.

---

## 4. How the classifier works (plain English)

The classifier lives in `server.js` as `classifyTicket(description)`.

- It lowercases the ticket description.
- Looks for certain **keywords**:
  - If it sees words like `bug`, `error`, `crash` → **Bug Report**
  - Words like `feature`, `enhancement`, `improvement` → **Feature Request**
  - Words like `bill`, `payment`, `invoice`, `refund` → **Billing Issue**
  - Words like `how to`, `help`, `cannot`, `can't` → **Technical Query**
  - Otherwise falls back to **General**
- Priority is decided in a similar way:
  - `urgent`, `asap`, `immediately`, `production down`, `critical` → **High**
  - `low priority`, `whenever`, `nice to have` → **Low**
  - Everything else → **Medium**

This gives you just enough “AI” behaviour to talk about **text classification, heuristics, and how you’d swap in a real model** (HuggingFace, fine‑tuned DistilBERT, etc.).

---

## 5. API overview

### `GET /api/health`

Simple health check.

### `GET /api/tickets`

Returns all tickets, newest last (the frontend reverses them).

Optional query parameters:

- `category` – exact category string (e.g. `Bug Report`)
- `priority` – `High`, `Medium`, or `Low`
- `search` – full‑text search over name, email and description

### `POST /api/tickets`

Create a new ticket.

**Request body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "description": "Checkout crashes when I click pay. Urgent, blocking prod."
}
```

The server:

1. Validates the fields.
2. Classifies the ticket.
3. Appends it to `tickets.json`.
4. Returns the created ticket (with id, category, priority, timestamp).

---

## 6. How to talk about this project

You can describe this project in an interview roughly like this:

> I built a small support tool where users can submit tickets and the backend automatically classifies each one by type and urgency. The frontend is a React + Tailwind dashboard that shows all tickets, with filters, search, and a details modal. On the backend I used Node and Express, storing tickets in a JSON file for simplicity. The classifier is a lightweight NLP-style component based on keywords, but I designed the API so it would be easy to plug in a HuggingFace or custom model later.

That hits:

- React, API integration, UI state handling
- Node/Express API design
- Text classification and how you’d improve it with a real ML model

---

## 7. Possible next improvements

If you want to extend this beyond a one‑day build:

- Replace the keyword classifier with a **HuggingFace** model (e.g. DistilBERT text classifier).
- Persist tickets to **MongoDB** instead of a JSON file.
- Add **auth** (simple JWT) for the dashboard view.
- Add basic charts (e.g. tickets by category over time) with Chart.js or Recharts.

Each of these is easy to layer on top of the current structure.


