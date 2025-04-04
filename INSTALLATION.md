# Prescripto Installation and Setup Guide

This guide provides detailed instructions for setting up the Prescripto medical appointment booking system on your local or production environment. Follow these steps to get the entire application up and running.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Admin Panel Setup](#admin-panel-setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Cloudinary Setup](#cloudinary-setup)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before beginning the installation, ensure you have the following software installed on your system:

- **Node.js** (v14.0.0 or later)
- **npm** (v6.0.0 or later) or **yarn** (v1.22.0 or later)
- **MongoDB** (v4.4 or later)
- **Git** (for cloning the repository)

You can check your installed versions with the following commands:

```bash
node -v
npm -v # or yarn -v
mongo --version
git --version
```

## Backend Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/prescripto.git
cd prescripto
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
# or
yarn install
```

### 3. Create Environment Variables

Create a `.env` file in the backend directory with the following content:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/prescripto
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Replace the placeholders with your actual configuration values. For development on your local machine, you can use the MongoDB URI shown above.

## Frontend Setup

### 1. Install Frontend Dependencies

```bash
cd ../frontend
npm install
# or
yarn install
```

### 2. Create Environment Variables

Create a `.env` file in the frontend directory:

```
VITE_BACKEND_URL=http://localhost:5000
```

## Admin Panel Setup

### 1. Install Admin Panel Dependencies

```bash
cd ../admin
npm install
# or
yarn install
```

### 2. Create Environment Variables

Create a `.env` file in the admin directory:

```
VITE_BACKEND_URL=http://localhost:5000
```

## Environment Configuration

### Backend Environment Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| PORT | The port number for the backend server | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/prescripto |
| JWT_SECRET | Secret key for JWT token generation | your_jwt_secret_key |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | your_cloud_name |
| CLOUDINARY_API_KEY | Cloudinary API key | your_api_key |
| CLOUDINARY_API_SECRET | Cloudinary API secret | your_api_secret |

### Frontend and Admin Environment Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| VITE_BACKEND_URL | URL of the backend API | http://localhost:5000 |

## Database Setup

### Setting Up MongoDB

1. Ensure MongoDB is running on your system:
   ```bash
   # For Linux/Mac
   sudo service mongod start
   # or
   brew services start mongodb-community
   
   # For Windows
   # Ensure MongoDB service is running in Services
   ```

2. The backend will automatically create the required database and collections when you start the application for the first time.

### Initial Data Setup

To create an initial admin user, you can use the provided script:

```bash
cd backend
npm run seed
# or
yarn seed
```

This will create an admin user with the following credentials:
- Email: admin@prescripto.com
- Password: admin123

**Important**: Change these credentials immediately after your first login.

## Cloudinary Setup

Prescripto uses Cloudinary for image storage. Follow these steps to set up your Cloudinary account:

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/users/register/free).
2. After logging in, navigate to the Dashboard.
3. Note your Cloud name, API Key, and API Secret.
4. Update your backend `.env` file with these values.

## Running the Application

### Development Mode

To run all components of the application in development mode:

#### 1. Start the Backend Server

```bash
cd backend
npm run dev
# or
yarn dev
```

The server will start on http://localhost:5000 (or the port you specified in the `.env` file).

#### 2. Start the Frontend

In a new terminal:

```bash
cd frontend
npm run dev
# or
yarn dev
```

The frontend development server will start, typically on http://localhost:3000.

#### 3. Start the Admin Panel

In another new terminal:

```bash
cd admin
npm run dev
# or
yarn dev
```

The admin panel will start, typically on http://localhost:3001.

### Production Mode

For production deployment, you'll need to build the frontend and admin applications:

#### 1. Build the Frontend

```bash
cd frontend
npm run build
# or
yarn build
```

#### 2. Build the Admin Panel

```bash
cd admin
npm run build
# or
yarn build
```

#### 3. Configure the Backend for Production

Update the `.env` file in the backend directory:

```
NODE_ENV=production
PORT=5000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_production_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### 4. Start the Production Server

```bash
cd backend
npm start
# or
yarn start
```

## Deployment

### Backend Deployment (Node.js)

#### Deploying to Heroku

1. Create a Heroku account and install the Heroku CLI.
2. Log in to Heroku:
   ```bash
   heroku login
   ```

3. Create a new Heroku app:
   ```bash
   heroku create prescripto-backend
   ```

4. Set up environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set PORT=5000
   heroku config:set MONGO_URI=your_production_mongodb_uri
   heroku config:set JWT_SECRET=your_secure_production_jwt_secret
   heroku config:set CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   heroku config:set CLOUDINARY_API_KEY=your_cloudinary_api_key
   heroku config:set CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

5. Deploy the backend:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend deployment"
   git push heroku master
   ```

#### Deploying to AWS EC2

1. Launch an EC2 instance with Amazon Linux 2.
2. Connect to your instance via SSH.
3. Install Node.js:
   ```bash
   curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
   sudo yum install -y nodejs
   ```

4. Install MongoDB:
   ```bash
   sudo nano /etc/yum.repos.d/mongodb-org-4.4.repo
   ```
   Add the following content:
   ```
   [mongodb-org-4.4]
   name=MongoDB Repository
   baseurl=https://repo.mongodb.org/yum/amazon/2/mongodb-org/4.4/x86_64/
   gpgcheck=1
   enabled=1
   gpgkey=https://www.mongodb.org/static/pgp/server-4.4.asc
   ```
   Then install and start MongoDB:
   ```bash
   sudo yum install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

5. Clone the repository and set up the backend:
   ```bash
   git clone https://github.com/yourusername/prescripto.git
   cd prescripto/backend
   npm install
   ```

6. Create and configure the `.env` file.

7. Set up PM2 for process management:
   ```bash
   npm install pm2 -g
   pm2 start server.js
   pm2 startup
   pm2 save
   ```

### Frontend and Admin Panel Deployment

#### Deploying to Netlify

1. Build the frontend and admin applications as described in the Production Mode section.

2. Install the Netlify CLI:
   ```bash
   npm install netlify-cli -g
   ```

3. Deploy the frontend:
   ```bash
   cd frontend
   netlify deploy
   ```
   Follow the prompts to set up your new site or connect to an existing one.

4. Deploy the admin panel:
   ```bash
   cd admin
   netlify deploy
   ```

5. Set environment variables in the Netlify dashboard for both sites:
   - VITE_BACKEND_URL=https://your-backend-url.com

#### Deploying to Vercel

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy the frontend:
   ```bash
   cd frontend
   vercel
   ```

3. Deploy the admin panel:
   ```bash
   cd admin
   vercel
   ```

4. Set environment variables in the Vercel dashboard for both projects.

## Troubleshooting

### Common Installation Issues

#### MongoDB Connection Issues

**Problem**: Unable to connect to MongoDB.

**Solution**:
1. Ensure MongoDB is running: `sudo systemctl status mongod`
2. Check your MongoDB URI in the `.env` file
3. If using MongoDB Atlas, ensure your IP is whitelisted

#### Node.js Dependencies Issues

**Problem**: Errors when installing dependencies.

**Solution**:
1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules directory and package-lock.json file
3. Reinstall dependencies: `npm install`

#### Environment Variables Not Loading

**Problem**: Environment variables not being recognized.

**Solution**:
1. Ensure `.env` files are in the correct directories
2. Make sure variable names are correct (check for typos)
3. Try using the dotenv package explicitly in your code:
   ```javascript
   require('dotenv').config();
   ```

#### CORS Issues

**Problem**: API requests failing due to CORS errors.

**Solution**:
1. Ensure the backend CORS configuration includes your frontend domains
2. Check that API URLs in the frontend and admin panel have the correct protocol (http/https)

### Getting Help

If you encounter any issues not covered in this guide:

1. Check the GitHub repository issues section for similar problems
2. Consult the documentation
3. Reach out to the project maintainers

## Post-Installation

After successfully installing Prescripto, you should:

1. Change the default admin credentials
2. Configure email settings for notifications
3. Test the entire application flow
4. Set up regular database backups
5. Configure monitoring for your production deployment 