# Reverse Mortgage Backend API

Backend API for the Mutual of Omaha reverse mortgage application form with Auth0 integration.

## Setup Instructions

### 1. Auth0 Machine-to-Machine App Setup

1. Go to Auth0 Dashboard → Applications → Create Application
2. Name: "Reverse Mortgage Backend API"
3. Type: **Machine to Machine Applications**
4. Authorize for: **Auth0 Management API**
5. Scopes: Select `read:users` and `update:users`
6. Copy the Client ID and Client Secret

### 2. Deploy to Vercel

1. Upload all files to GitHub repository
2. Go to vercel.com and sign up with GitHub
3. Import your repository
4. Add environment variables:
   - AUTH0_DOMAIN = dev-33kbhhk62a0lfqfo.us.auth0.com
   - AUTH0_M2M_CLIENT_ID = your_client_id
   - AUTH0_M2M_CLIENT_SECRET = your_client_secret

### 3. Update Your Form

Replace API URL in postloginform.html:
```javascript
const API_URL = 'https://your-project-name.vercel.app/api/submit-application';
