# HealthMonitor

Enterprise-grade health monitoring system with a decoupled architecture.

## Tech Stack
- **Frontend:** React (Vite), TypeScript, Tailwind CSS v4, Lucide Icons.
- **Backend:** Node.js, Express, TypeScript, Redis.
- **Infrastructure:** Docker, Docker Compose, GitHub Actions.

## Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 20+

### Local Development (No Docker)
1. **Redis:** Ensure Redis is running on `localhost:6379`.
2. **Server:**
   ```bash
   cd server
   npm install
   npm run dev
   ```
3. **Client:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

### Using Docker Compose
```bash
docker-compose up --build
```
Access the dashboard at `http://localhost:3000`.

## Architecture
- **Nginx:** Serves the React build and proxies API requests.
- **Node-TS Server:** Periodic monitoring logic and Redis storage.
- **Redis:** Persistent storage for health statuses.
