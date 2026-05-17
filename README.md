# Student Performance Prediction System

A full-stack student performance prediction system with:

- Student management APIs
- Rule-based performance ranking
- OpenRouter-powered AI analysis and recommendations
- React dashboard UI
- Render deployment support

## Local Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Configure backend environment in `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student-performance
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openrouter/free
FRONTEND_URL=http://localhost:5173
```

3. Start both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## API Endpoints

- `POST /api/students`
- `GET /api/students`
- `POST /api/performance`
- `POST /api/ai/performance`
- `GET /api/health`

## Render Deployment

1. Push this project to GitHub.
2. Create a MongoDB Atlas cluster and copy the connection string.
3. In Render, create a new Blueprint from this repo using `render.yaml`, or create services manually.
4. Add backend environment variables on Render:

```env
MONGODB_URI=your_mongodb_atlas_uri
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openrouter/free
FRONTEND_URL=https://your-frontend.onrender.com
```

5. Add frontend environment variable:

```env
VITE_API_URL=https://your-backend.onrender.com
```

After deployment, update `FRONTEND_URL` on the backend to match the deployed frontend URL.
