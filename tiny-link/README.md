# TinyLink

TinyLink is a small URL shortener (bit.ly style) built as a take-home assignment.

It lets you:

- Create short links (with optional custom code)
- Redirect `/code` → original URL
- Track total clicks and last clicked time
- View stats for a single link
- Delete links
- Expose a `/healthz` endpoint for automated checks

---

## Tech Stack

- **Framework**: Next.js (App Router + Pages Router)
- **Language**: TypeScript
- **Database**: Postgres (Neon)
- **ORM/DB Client**: `pg` (no Prisma)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (recommended)

---

## Main Routes (Pages)

### `/` – Dashboard

- Lists all links in a table:
  - Short code
  - Target URL
  - Total clicks
  - Last clicked
- Shows empty / loading / error states.
- Includes a form to create a new link:
  - Target URL (required)
  - Custom code (optional)
- Supports search/filter by code or URL.
- Allows deleting a link from the table.

### `/code/:code` – Stats Page

- Shows stats for a single short code:
  - Short URL: `/:code`
  - Target URL
  - Total clicks
  - Last clicked
  - Created at
- Handles:
  - Loading state
  - “Not found” state for unknown codes
  - General error state
- Implemented as a **client component** that calls the stats API.

### `/:code` – Redirect

- Dynamic route implemented with **Pages Router** (`pages/[code].tsx`).
- Behavior:
  - Looks up the code in the database.
  - If found:
    - Increments `clicks`
    - Updates `last_clicked_at`
    - Issues a **302 redirect** to the original URL.
  - If not found:
    - Returns a 404 page.

### `/healthz` – Health Check

- Simple public healthcheck endpoint.
- Always returns status `200` with JSON like:

```json
{
  "ok": true,
  "version": "1.0"
}



API Endpoints

All APIs are implemented under app/api/links.

POST /api/links – Create Link

Body (JSON):

{
  "url": "https://example.com/very/long/url",
  "code": "Custom01" // optional
}


Validates URL.

Validates code (alphanumeric / simple pattern).

If code is omitted, the server generates a random code.

Codes are globally unique.

If the code already exists, returns 409 Conflict.

Responses:

201 Created (or 200 OK depending on implementation) with the created link:

{
  "id": 1,
  "code": "Abc123",
  "url": "https://example.com/very/long/url",
  "clicks": 0,
  "last_clicked_at": null,
  "created_at": "2025-01-01T12:00:00.000Z"
}


400 Bad Request – invalid URL or invalid code format.

409 Conflict – code already exists.

500 Internal Server Error – unexpected error.

GET /api/links – List All Links

Response:

[
  {
    "id": 1,
    "code": "Abc123",
    "url": "https://example.com",
    "clicks": 10,
    "last_clicked_at": "2025-01-02T10:00:00.000Z",
    "created_at": "2025-01-01T12:00:00.000Z"
  },
  {
    "id": 2,
    "code": "Docs01",
    "url": "https://docs.example.com",
    "clicks": 3,
    "last_clicked_at": null,
    "created_at": "2025-01-03T08:30:00.000Z"
  }
]


Used by the Dashboard (/) to render the table of links.

GET /api/links/:code – Stats for a Single Code

Response (on success):

{
  "id": 1,
  "code": "Abc123",
  "url": "https://example.com",
  "clicks": 10,
  "last_clicked_at": "2025-01-02T10:00:00.000Z",
  "created_at": "2025-01-01T12:00:00.000Z"
}


Error cases:

400 Bad Request – invalid code format.

404 Not Found – code not found.

500 Internal Server Error – unexpected error.

Used by the stats page /code/:code.

DELETE /api/links/:code – Delete a Link

Behavior:

Validates the code.

Deletes the link if it exists.

After deletion:

/api/links/:code returns 404.

/:code redirect returns 404.

Responses:

200 OK with { "ok": true } on success.

400 Bad Request – invalid code format.

404 Not Found – code doesn’t exist.

500 Internal Server Error – unexpected error.

Used from the Dashboard table’s “Delete” button.

Data Model

Postgres table (simplified):

CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  url TEXT NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  last_clicked_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


The app uses the pg client (Pool) to run queries.

Environment Variables

Create a .env file in the tiny-link directory:

DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require


On Vercel, configure the same DATABASE_URL in the project settings.

BASE_URL is not required; the app uses relative URLs for API calls and short URLs.

Getting Started (Local)

Clone & install

git clone https://github.com/JAIRAJ28/URL_SHORTNER.git
cd URL_SHORTNER/tiny-link
npm install


Set up database

Create a Postgres database (e.g. on Neon).

Run the CREATE TABLE statement above.

Set DATABASE_URL in .env.

Run dev server

npm run dev


Visit:

Dashboard – http://localhost:3000/

Stats – http://localhost:3000/code/:code

Redirect – http://localhost:3000/:code

Health – http://localhost:3000/healthz


npm run dev


