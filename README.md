

# Prescripto - Healthcare Appointment Management System

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [API Documentation](#api-documentation)
6. [Setup Instructions](#setup-instructions)
7. [User Guide](#user-guide)

## Overview
Prescripto is a comprehensive healthcare appointment management system that connects patients with doctors. The platform allows users to book appointments, manage their profiles, and interact with healthcare providers seamlessly.

## Features

### User Features
- **User Authentication**
  - Registration and Login
  - Profile management with image upload
  - Secure password handling

- **Appointment Management**
  - Book appointments with doctors
  - View available time slots
  - Cancel appointments
  - View appointment history

- **Doctor Search**
  - Browse available doctors
  - Filter by speciality
  - View doctor profiles and details

### Doctor Features
- **Profile Management**
  - Professional details
  - Availability management
  - Appointment schedule

### Admin Features
- **Doctor Management**
  - Add/Remove doctors
  - Update doctor information
  - Monitor appointments

## Technology Stack

### Frontend
- React.js
- Tailwind CSS
- Axios for API calls
- React Router for navigation
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage
- Bcrypt for password hashing

## Project Structure

```
prescripto/
├── frontend/
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   ├── Context/
│   │   ├── assets/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── config/
│   └── server.js
│
└── README.md
```

## API Documentation

### User APIs

#### Authentication
```javascript
POST /api/users/register
// Register new user
Body: {
  name: string,
  email: string,
  password: string
}

POST /api/users/login
// User login
Body: {
  email: string,
  password: string
}
```

#### Profile Management
```javascript
GET /api/users/get-profile
// Get user profile
Headers: {
  Authorization: Bearer token
}

POST /api/users/update-profile
// Update user profile
Headers: {
  Authorization: Bearer token
}
Body: FormData {
  name: string,
  phone: string,
  address: JSON string,
  gender: string,
  dob: string,
  image: file (optional)
}
```

#### Appointments
```javascript
POST /api/users/book-appointment
// Book new appointment
Headers: {
  Authorization: Bearer token
}
Body: {
  userId: string,
  docId: string,
  slotDate: string,
  slotTime: string
}

GET /api/users/appointments
// Get user appointments
Headers: {
  Authorization: Bearer token
}

POST /api/users/cancel-appointment
// Cancel appointment
Headers: {
  Authorization: Bearer token
}
Body: {
  appointmentId: string
}
```

### Doctor APIs
```javascript
POST /api/doctor/login
GET /api/doctor/appointments
POST /api/doctor/update-profile
```

### Admin APIs
```javascript
POST /api/admin/add-doctor
POST /api/admin/remove-doctor
GET /api/admin/doctors
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account
- npm or yarn

### Environment Variables
Create `.env` file in backend directory:
```env
PORT=4000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd prescripto
```

2. **Backend Setup**
```bash
cd backend
npm install
npm start
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

## User Guide

### For Patients

1. **Registration/Login**
   - Create account using email and password
   - Login with credentials
   - Update profile with personal information

2. **Booking Appointments**
   - Browse available doctors
   - Select preferred time slot
   - Confirm appointment
   - View booking in appointments list

3. **Managing Profile**
   - Update personal information
   - Upload profile picture
   - View appointment history

### For Doctors

1. **Login**
   - Use credentials provided by admin
   - Update professional profile

2. **Managing Appointments**
   - View upcoming appointments
   - Check patient details
   - Update availability

### For Administrators

1. **Doctor Management**
   - Add new doctors
   - Update doctor information
   - Monitor appointment system

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Secure file upload
- Input validation
- Error handling

## Error Handling

The application implements comprehensive error handling:
- Input validation
- API error responses
- Frontend error notifications
- Loading states
- Network error handling

## Best Practices

- Responsive design
- Code organization
- Security measures
- Performance optimization
- Clean code principles
- Proper documentation

Would you like me to expand on any particular section or add more specific details about certain features?
