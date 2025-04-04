# Prescripto: Medical Appointment Booking System

![Prescripto Logo](frontend/src/assets/prescripto_logo.png)

Prescripto is a comprehensive medical appointment booking platform that connects patients with healthcare providers. The system consists of three main components: a patient-facing frontend, an administration panel, and a doctor panel, all working together to streamline the healthcare appointment process.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Admin Panel Setup](#admin-panel-setup)
  - [Environment Configuration](#environment-configuration)
  - [Database Setup](#database-setup)
  - [Cloudinary Setup](#cloudinary-setup)
  - [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
  - [For Patients](#for-patients)
  - [For Doctors](#for-doctors)
  - [For Administrators](#for-administrators)
  - [Common Tasks](#common-tasks)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [User Endpoints](#user-endpoints)
  - [Doctor Endpoints](#doctor-endpoints)
  - [Admin Endpoints](#admin-endpoints)
- [System Architecture](#system-architecture)
  - [Architecture Overview](#architecture-overview)
  - [Data Models](#data-models)
  - [Authentication Flow](#authentication-flow)
  - [Component Structure](#component-structure)
  - [State Management](#state-management)
- [Deployment](#deployment)
  - [Backend Deployment](#backend-deployment)
  - [Frontend Deployment](#frontend-deployment)
  - [Admin Panel Deployment](#admin-panel-deployment)
- [Security Considerations](#security-considerations)
- [Future Enhancements](#future-enhancements)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

Prescripto simplifies the medical appointment booking process by providing an intuitive platform for patients to discover doctors, book appointments, and manage their healthcare journey. The system offers dedicated interfaces for three types of users:

1. **Patients**: Can browse doctors, book appointments, and manage their profiles
2. **Doctors**: Can view their appointments, update profiles, and manage appointment status
3. **Administrators**: Can manage the entire platform, including doctors, patients, and appointments

## Key Features

### Patient Features
- User registration and authentication
- Doctor discovery with filtering by speciality
- Appointment booking with online/cash payment options
- Profile management
- Appointment history and status tracking

### Doctor Features
- Doctor authentication
- Appointment dashboard
- Appointment management (complete/cancel)
- Availability management
- Profile management

### Admin Features
- Admin authentication
- Doctor management (add, edit, delete)
- Appointment oversight
- Platform analytics
- User management

## Technology Stack

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **Routing**: React Router
- **HTTP Client**: Axios
- **Notifications**: React Toastify

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Validator.js

### Image Storage
- **Cloud Storage**: Cloudinary

## Project Structure

```
prescripto/
├── frontend/             # Patient frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/       # Static assets
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Context API for state management
│   │   ├── pages/        # Page components
│   │   └── App.jsx       # Main app component
│   └── package.json
├── admin/                # Admin and Doctor panel
│   ├── public/
│   ├── src/
│   │   ├── assets/       # Static assets
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Context providers
│   │   ├── pages/        # Admin and Doctor pages
│   │   │   ├── Admin/    # Admin specific pages
│   │   │   └── Doctor/   # Doctor specific pages
│   │   └── App.jsx       # Main app component
│   └── package.json
├── backend/              # Server-side code
│   ├── controllers/      # Route controllers
│   ├── middlewares/      # Custom middlewares
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── .env              # Environment variables
│   └── server.js         # Entry point
└── README.md
```

## Installation & Setup

### Prerequisites

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

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/prescripto.git
   cd prescripto
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/prescripto
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

### Frontend Setup

1. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

2. Create a `.env` file in the frontend directory:
   ```
   VITE_BACKEND_URL=http://localhost:5000
   ```

### Admin Panel Setup

1. Install admin panel dependencies:
   ```bash
   cd ../admin
   npm install
   ```

2. Create a `.env` file in the admin directory:
   ```
   VITE_BACKEND_URL=http://localhost:5000
   ```

### Environment Configuration

#### Backend Environment Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| PORT | The port number for the backend server | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/prescripto |
| JWT_SECRET | Secret key for JWT token generation | your_jwt_secret_key |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | your_cloud_name |
| CLOUDINARY_API_KEY | Cloudinary API key | your_api_key |
| CLOUDINARY_API_SECRET | Cloudinary API secret | your_api_secret |

#### Frontend and Admin Environment Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| VITE_BACKEND_URL | URL of the backend API | http://localhost:5000 |

### Database Setup

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

3. To create an initial admin user, you can use the provided script:
   ```bash
   cd backend
   npm run seed
   ```

   This will create an admin user with the following credentials:
   - Email: admin@prescripto.com
   - Password: admin123

   **Important**: Change these credentials immediately after your first login.

### Cloudinary Setup

Prescripto uses Cloudinary for image storage. Follow these steps to set up your Cloudinary account:

1. Sign up for a free account at [Cloudinary](https://cloudinary.com/users/register/free).
2. After logging in, navigate to the Dashboard.
3. Note your Cloud name, API Key, and API Secret.
4. Update your backend `.env` file with these values.

### Running the Application

#### Development Mode

1. Start the Backend Server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the Frontend:
   ```bash
   cd ../frontend
   npm run dev
   ```

3. Start the Admin Panel:
   ```bash
   cd ../admin
   npm run dev
   ```

#### Production Mode

1. Build the Frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Build the Admin Panel:
   ```bash
   cd admin
   npm run build
   ```

3. Configure the Backend for Production:
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=your_production_mongodb_uri
   JWT_SECRET=your_secure_production_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the Production Server:
   ```bash
   cd backend
   npm start
   ```

## Usage Guide

### For Patients

#### Getting Started

**Creating a New Account**
1. Visit the Prescripto homepage.
2. Click on the "Register" button.
3. Fill in your personal details.
4. Click "Create Account".

**Logging In**
1. Visit the Prescripto homepage.
2. Click on the "Login" button.
3. Enter your registered email and password.
4. Click "Login".

#### Finding a Doctor
1. From your dashboard, click on "Find a Doctor".
2. Browse through the list of available doctors.
3. Use filters to narrow down your search.
4. Click on a doctor's profile to view detailed information.

#### Booking an Appointment
1. From the doctor's profile, click "Book Appointment".
2. Select your preferred date from the calendar.
3. Choose an available time slot.
4. Choose your payment method.
5. Complete the booking process.

#### Managing Your Appointments
1. Navigate to "My Appointments" from your dashboard.
2. View a list of all your appointments.
3. Cancel appointments if needed.

#### Managing Your Profile
1. Click on your profile icon.
2. Select "Profile" from the dropdown menu.
3. Update your personal details and profile picture.
4. Click "Save Changes".

### For Doctors

#### Logging In as a Doctor
1. Navigate to the doctor login page.
2. Enter your email and password provided by the administrator.
3. Click "Login".

#### Managing Your Dashboard
- View statistics and upcoming appointments.
- Monitor your practice activity.

#### Handling Appointments
1. Click on "Appointments" in the sidebar.
2. View a list of all your appointments.
3. Filter appointments by status.
4. Manage individual appointments (complete/cancel).

#### Updating Your Profile
1. Click on your name in the sidebar.
2. Select "Profile" from the dropdown.
3. Update your professional information.
4. Click "Save Changes".

#### Setting Availability
1. Navigate to "Availability" in the sidebar.
2. Set your availability for each day of the week.
3. Specify working hours and consultation duration.
4. Click "Save Schedule".

### For Administrators

#### Admin Dashboard
- View platform statistics and recent activities.
- Monitor the system's performance.

#### Managing Doctors
1. Click on "Doctors" in the sidebar.
2. Add, edit, or remove doctors.
3. Manage doctor profiles and availability.

#### Overseeing Appointments
1. Click on "Appointments" in the sidebar.
2. View all appointments in the system.
3. Filter appointments by various criteria.
4. Manage appointment issues.

#### System Management
1. Navigate to "Users" to manage patient accounts.
2. Configure system-wide settings.

### Common Tasks

#### Logging In and Out
**Logging In**
1. Visit the login page.
2. Enter your credentials and select your user type.
3. Click "Login".

**Logging Out**
1. Click on your profile icon.
2. Select "Logout".

#### Forgotten Password
1. On the login page, click "Forgot Password?".
2. Enter your registered email address.
3. Follow the instructions sent to your email.

#### Updating Profile Picture
1. Navigate to your profile settings.
2. Click on your current profile picture.
3. Upload a new image and save.

## API Documentation

### Base URL

All API endpoints are relative to:
```
http://localhost:5000/api/
```

For production:
```
https://your-api-domain.com/api/
```

### Authentication

The application uses JWT (JSON Web Tokens) for authentication with three token types:

1. **User Token**: `Authorization: Bearer <token>`
2. **Doctor Token**: `dToken: Bearer <token>`
3. **Admin Token**: `aToken: <token>`

### User Endpoints

#### Authentication
```
POST /api/users/register - Register a new patient
POST /api/users/login - Patient login
```

#### Profile
```
GET /api/users/get-profile - Get user profile
POST /api/users/update-profile - Update user profile
```

#### Doctors
```
GET /api/users/get-doctors - Get all doctors
GET /api/users/get-doctor/:id - Get doctor details by ID
```

#### Appointments
```
POST /api/users/book-appointment - Book new appointment
GET /api/users/list-appointment - Get user appointments
POST /api/users/cancel-appointment - Cancel appointment
```

### Doctor Endpoints

#### Authentication
```
POST /api/doctor/login - Doctor login
```

#### Profile
```
GET /api/doctor/profile - Get doctor profile
POST /api/doctor/update-profile - Update doctor profile
```

#### Appointments
```
GET /api/doctor/appointments - Get doctor appointments
POST /api/doctor/complete-appointment - Mark appointment as completed
POST /api/doctor/cancel-appointment - Cancel appointment
POST /api/doctor/change-availability - Update availability
```

### Admin Endpoints

#### Authentication
```
POST /api/admin/login - Admin login
```

#### Doctor Management
```
POST /api/admin/add-doctor - Add a new doctor
GET /api/admin/all-doctors - Get all doctors
POST /api/admin/change-availability - Update doctor availability
```

#### Appointment Management
```
GET /api/admin/appointments - Get all appointments
POST /api/admin/cancel-appointment - Cancel appointment
```

#### Dashboard
```
GET /api/admin/dashboard - Get dashboard data
```

For detailed API documentation with request/response formats, see the API_DOCUMENTATION.md file.

## System Architecture

### Architecture Overview

Prescripto follows a three-tier architecture:

1. **Frontend Tier**: React-based user interfaces
   - Patient Portal (frontend/)
   - Admin & Doctor Portal (admin/)

2. **Backend Tier**: Node.js/Express API server
   - REST API endpoints
   - Business logic
   - Authentication

3. **Data Tier**: MongoDB database
   - User data
   - Doctor data
   - Appointment data

```
┌───────────────┐     ┌───────────────┐     ┌──────────────┐
│  React UIs    │     │ Express API   │     │   MongoDB    │
│ (Patient/     │◄───►│ (Controllers, │◄───►│  (Data       │
│  Admin/Doctor)│     │  Middleware)  │     │   Storage)   │
└───────────────┘     └───────────────┘     └──────────────┘
        ▲                    ▲                     ▲
        │                    │                     │
        └────────────────────┼─────────────────────┘
                             │
                     ┌───────────────┐
                     │  Cloudinary   │
                     │ (Image Store) │
                     └───────────────┘
```

### Data Models

#### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  gender: String,
  dob: String,
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Doctor Model
```javascript
{
  name: String,
  email: String,
  password: String,
  phone: String,
  speciality: String,
  experience: Number,
  fees: Number,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  availability: [
    {
      day: String,
      available: Boolean,
      slots: [String]
    }
  ],
  rating: Number,
  numberOfRatings: Number,
  image: String,
  about: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Appointment Model
```javascript
{
  userId: ObjectId,
  docId: ObjectId,
  userData: {
    name: String,
    email: String,
    dob: String,
    image: String
  },
  docData: {
    name: String,
    speciality: String,
    image: String
  },
  slotDate: String,
  slotTime: String,
  amount: Number,
  payment: Boolean,
  isCompleted: Boolean,
  cancelled: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Admin Model
```javascript
{
  name: String,
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Authentication Flow

1. User logs in with credentials
2. Server validates credentials
3. Server generates JWT token with user information as payload
4. Token is sent to client in response
5. Client stores token in localStorage
6. For subsequent requests, client includes token in header
7. Server middleware verifies token authenticity before processing protected routes

Token format:
- Patient token: `Bearer ${token}`
- Doctor token: `Bearer ${dToken}`
- Admin token: `aToken`

### Component Structure

#### Patient Portal
```
App/
├── AuthRequired/ (Authentication wrapper)
├── Layout/ (Common layout with Navbar and Footer)
├── Pages/
│   ├── Home/
│   ├── Login/
│   ├── Register/
│   ├── Profile/
│   ├── Appointments/
│   ├── DoctorList/
│   └── DoctorDetail/
└── Components/
    ├── AppointmentCard/
    ├── DoctorCard/
    ├── Navbar/
    └── Footer/
```

#### Admin & Doctor Portal
```
App/
├── Layout/ (Common layout with Navbar)
├── Pages/
│   ├── Admin/
│   │   ├── Dashboard/
│   │   ├── AllDoctors/
│   │   ├── AllAppointments/
│   │   ├── AddDoctor/
│   │   └── Login/
│   └── Doctor/
│       ├── Dashboard/
│       ├── Profile/
│       ├── DoctorAppointments/
│       └── Login/
└── Components/
    ├── Navbar/
    ├── Sidebar/
    ├── DashboardCard/
    └── AppointmentItem/
```

### State Management

Prescripto uses React Context API for state management:

#### Patient Portal Contexts
- **AppContext**: General utilities and formatting functions
- **AuthContext**: Authentication and user data management

#### Admin & Doctor Portal Contexts
- **AppContext**: General utilities and formatting
- **AdminContext**: Admin authentication and operations
- **DoctorContext**: Doctor authentication and operations

## Deployment

### Backend Deployment

#### Deploying to Heroku
1. Create a Heroku account and install the Heroku CLI
2. Create a new Heroku app
3. Set up environment variables
4. Deploy the backend code

#### Deploying to AWS EC2
1. Launch an EC2 instance
2. Install Node.js and MongoDB
3. Clone the repository and set up the backend
4. Use PM2 for process management

### Frontend Deployment

1. Build the frontend application:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the build folder to a static hosting service like Netlify, Vercel, or AWS S3

### Admin Panel Deployment

1. Build the admin application:
   ```bash
   cd admin
   npm run build
   ```
2. Deploy the build folder to a static hosting service

## Security Considerations

- Passwords are hashed using bcrypt before storage
- JWT tokens are used for secure authentication
- Protected routes are guarded by authentication middleware
- Input validation is performed on both client and server sides
- Environment variables are used to store sensitive information

## Future Enhancements

- Integration with video consultation services
- SMS/Email notifications for appointments
- Electronic health records (EHR) integration
- Mobile applications for patients and doctors
- Multi-language support
- Online prescription generation
- Integration with health insurance providers

## Troubleshooting

### Common Installation Issues

#### MongoDB Connection Issues
1. Ensure MongoDB is running
2. Check the MONGO_URI in the .env file
3. If using MongoDB Atlas, ensure your IP is whitelisted

#### Node.js Dependencies Issues
1. Clear npm cache
2. Delete node_modules directory and package-lock.json file
3. Reinstall dependencies

#### Authentication Failures
1. Check JWT_SECRET in the .env file
2. Verify token expiration time
3. Clear localStorage and try again

### Common Usage Issues

#### Appointment Booking Errors
1. Ensure you're logged in
2. Check if the time slot is still available
3. Verify your payment method is valid

#### Profile Update Issues
1. Ensure all required fields are filled
2. Check your internet connection
3. Ensure image files are in the correct format and size

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudinary](https://cloudinary.com/)
