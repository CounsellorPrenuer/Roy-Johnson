# Career Plans Cloudflare Worker

This directory contains the backend serverless logic for [careerplans.pro](https://careerplans.pro).

## Setup instructions

### 1. Install Dependencies
Navigate to the `worker` directory and install dependencies:
```bash
cd worker
npm install
```

### 2. Local Development
Run the worker locally to test the endpoints:
```bash
npm run dev
```
This will start a local server, usually at `http://localhost:8787`.

**Test the Health Endpoint:**
Open your browser or use curl:
`http://localhost:8787/health`

### 3. Deploy to Cloudflare
*Note: You need a Cloudflare account and to be logged in via Wrangler.*

Login to Cloudflare (first time only):
```bash
npx wrangler login
```

Deploy the worker:
```bash
npm run deploy
```

The worker will be deployed to your Cloudflare account, and you will receive a URL (e.g., `https://careerplans-worker.<your-subdomain>.workers.dev`).

## Endpoints

### GET /health
Returns the service status.
**Response:**
```json
{
  "status": "ok",
  "service": "cloudflare-worker",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
