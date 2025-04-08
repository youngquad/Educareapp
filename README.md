# Educare Backend

## Deployment to Heroku

1. Fork this repository
2. Create a new Heroku app
3. Connect your GitHub repository
4. Set the following environment variables in Heroku:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong secret for JWT
   - `NODE_ENV`: Set to "production"
   - `ALLOWED_ORIGINS`: Comma-separated list of allowed origins
   - `RATE_LIMIT_MAX`: Maximum requests per window (default: 100)
5. Enable automatic deploys from GitHub

## Local Development

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file with the same variables
4. Run `npm run dev`
