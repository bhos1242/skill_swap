# �️ Setup Guide

Quick setup guide to get Skill Swap running locally.

## Prerequisites

- Node.js (v18+)
- MongoDB database (MongoDB Atlas recommended)
- Google Cloud account (for OAuth)

## Setup Steps

1. **Clone and install**
   ```bash
   git clone https://github.com/bhos1242/skill_swap.git
   cd skill_swap
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your `.env.local`:
   ```bash
   DATABASE_URL="your-mongodb-connection-string"
   NEXTAUTH_SECRET="random-secret-string"
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"
   ```

3. **Database setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

Visit `http://localhost:8888` to see your app!

## Getting Your Credentials

### MongoDB Atlas
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Add it as `DATABASE_URL`

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:8888/api/auth/callback/google`
6. Use Client ID and Secret in your env file

## Common Issues

- **Prisma errors**: Run `npx prisma generate`
- **Port in use**: Kill process or use different port
- **Auth errors**: Check your Google OAuth settings

Need help? Open an issue on GitHub!
