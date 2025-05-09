# Wawona Dome Family Portal

A web application for Wawona Dome family members to access their specific resources.

## Setup

1. Clone the repository
2. Install dependencies with `bun install`
3. Create a `.env.local` file in the root directory with the following Firebase configuration:

```
# Firebase Configuration
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id
```

4. Set up your Firebase project:
   - Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password provider
   - Create a Firestore database
   - Set up the following collections:
     - `users`: for user profiles
     - `links`: for user-specific links with fields:
       - `userId`: string (matching the Firebase Auth UID)
       - `title`: string
       - `url`: string
       - `description`: string (optional)

## Development

Run the development server:

```
bun run dev
```

## Build

Build the application:

```
bun run build
```

## Project Structure

- `src/components/`: React components
- `src/contexts/`: Context providers
- `src/firebase/`: Firebase configuration
- `src/services/`: Service functions for data fetching

## Deployment

This project is configured for deployment to GitHub Pages.

### Manual Deployment

You can manually deploy the app to GitHub Pages with:

```bash
bun run deploy:github
```

This script will:
1. Build the project
2. Create a `.nojekyll` file to bypass Jekyll processing
3. Deploy the `dist` directory to the `gh-pages` branch

### Automated Deployment

This repository includes a GitHub Actions workflow that automatically deploys the app to GitHub Pages whenever changes are pushed to the main branch.

To set up automated deployment:

1. Go to your GitHub repository settings
2. Navigate to "Pages"
3. Set the source to "GitHub Actions"
4. Add the following secrets to your repository settings (Settings > Secrets and variables > Actions):
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_MEASUREMENT_ID`
