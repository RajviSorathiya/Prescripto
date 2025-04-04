# Prescripto - Technical Documentation

This document provides detailed technical information about the Prescripto medical appointment booking system, including architecture, data models, API documentation, and implementation details.

## System Architecture

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

### Architecture Diagram

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

## Data Models

### User Model

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

### Doctor Model

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

### Appointment Model

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

### Admin Model

```javascript
{
  name: String,
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Documentation

### Authentication APIs

#### User Authentication

```
POST /api/users/register
Description: Register a new patient
Request Body: {
  name: string,
  email: string,
  password: string
}
Response: {
  success: boolean,
  message: string,
  token: string (JWT),
  data: { user object }
}
```

```
POST /api/users/login
Description: Patient login
Request Body: {
  email: string,
  password: string
}
Response: {
  success: boolean,
  message: string,
  token: string (JWT),
  data: { user object }
}
```

#### Doctor Authentication

```
POST /api/doctor/login
Description: Doctor login
Request Body: {
  email: string,
  password: string
}
Response: {
  success: boolean,
  message: string,
  token: string (JWT),
  data: { doctor object }
}
```

#### Admin Authentication

```
POST /api/admin/login
Description: Admin login
Request Body: {
  email: string,
  password: string
}
Response: {
  success: boolean,
  message: string,
  token: string (JWT),
  data: { admin object }
}
```

### User APIs

```
GET /api/users/get-profile
Description: Get user profile
Headers: {
  Authorization: Bearer token
}
Response: {
  success: boolean,
  message: string,
  data: { user object }
}
```

```
POST /api/users/update-profile
Description: Update user profile
Headers: {
  Authorization: Bearer token
}
Request Body (FormData): {
  name: string,
  phone: string,
  address: JSON string,
  gender: string,
  dob: string,
  image: file (optional)
}
Response: {
  success: boolean,
  message: string,
  data: { updated user object }
}
```

```
GET /api/users/get-doctors
Description: Get all doctors
Headers: {
  Authorization: Bearer token
}
Response: {
  success: boolean,
  doctors: array of doctor objects
}
```

```
GET /api/users/get-doctor/:id
Description: Get doctor details by ID
Headers: {
  Authorization: Bearer token
}
Response: {
  success: boolean,
  doctor: doctor object,
  availability: availability array
}
```

```
POST /api/users/book-appointment
Description: Book new appointment
Headers: {
  Authorization: Bearer token
}
Request Body: {
  docId: string,
  slotDate: string,
  slotTime: string,
  amount: number,
  payment: boolean
}
Response: {
  success: boolean,
  message: string,
  appointment: appointment object
}
```

```
GET /api/users/list-appointment
Description: Get user appointments
Headers: {
  Authorization: Bearer token
}
Response: {
  success: boolean,
  appointments: array of appointment objects
}
```

```
POST /api/users/cancel-appointment
Description: Cancel appointment
Headers: {
  Authorization: Bearer token
}
Request Body: {
  appointmentId: string
}
Response: {
  success: boolean,
  message: string
}
```

### Doctor APIs

```
GET /api/doctor/profile
Description: Get doctor profile
Headers: {
  dToken: Bearer token
}
Response: {
  success: boolean,
  message: string,
  data: { doctor object }
}
```

```
POST /api/doctor/update-profile
Description: Update doctor profile
Headers: {
  dToken: Bearer token
}
Request Body (FormData): {
  name: string,
  phone: string,
  address: JSON string,
  about: string,
  image: file (optional)
}
Response: {
  success: boolean,
  message: string,
  data: { updated doctor object }
}
```

```
GET /api/doctor/appointments
Description: Get doctor appointments
Headers: {
  dToken: Bearer token
}
Response: {
  success: boolean,
  appointments: array of appointment objects
}
```

```
POST /api/doctor/complete-appointment
Description: Mark appointment as completed
Headers: {
  dToken: Bearer token
}
Request Body: {
  appointmentId: string
}
Response: {
  success: boolean,
  message: string
}
```

```
POST /api/doctor/cancel-appointment
Description: Cancel appointment
Headers: {
  dToken: Bearer token
}
Request Body: {
  appointmentId: string
}
Response: {
  success: boolean,
  message: string
}
```

```
POST /api/doctor/change-availability
Description: Update availability
Headers: {
  dToken: Bearer token
}
Request Body: {
  availability: array of availability objects
}
Response: {
  success: boolean,
  message: string
}
```

### Admin APIs

```
POST /api/admin/add-doctor
Description: Add a new doctor
Headers: {
  aToken: token
}
Request Body: {
  name: string,
  email: string,
  password: string,
  phone: string,
  speciality: string,
  experience: number,
  fees: number,
  address: object
}
Response: {
  success: boolean,
  message: string,
  doctor: doctor object
}
```

```
GET /api/admin/all-doctors
Description: Get all doctors
Headers: {
  aToken: token
}
Response: {
  success: boolean,
  doctors: array of doctor objects
}
```

```
POST /api/admin/change-availability
Description: Update doctor availability
Headers: {
  aToken: token
}
Request Body: {
  docId: string,
  availability: array of availability objects
}
Response: {
  success: boolean,
  message: string
}
```

```
GET /api/admin/appointments
Description: Get all appointments
Headers: {
  aToken: token
}
Response: {
  success: boolean,
  appoinments: array of appointment objects
}
```

```
POST /api/admin/cancel-appointment
Description: Cancel appointment
Headers: {
  aToken: token
}
Request Body: {
  appointmentId: string
}
Response: {
  success: boolean,
  message: string
}
```

```
GET /api/admin/dashboard
Description: Get dashboard data
Headers: {
  aToken: token
}
Response: {
  success: boolean,
  data: {
    doctorCount: number,
    userCount: number,
    appointmentCount: number,
    recentAppointments: array
  }
}
```

## Authentication Flow

### JWT Authentication

1. User logs in with credentials
2. Server validates credentials
3. Server generates JWT token with user information as payload
4. Token is sent to client in response
5. Client stores token in localStorage
6. For subsequent requests, client includes token in header
7. Server middleware verifies token authenticity before proceeding

### Token Format

```javascript
// Patient token
Authorization: Bearer <user_jwt_token>

// Doctor token
dToken: Bearer <doctor_jwt_token>

// Admin token
aToken: <admin_jwt_token>
```

## Frontend Component Structure

### Patient Portal

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

### Admin & Doctor Portal

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

## Contexts and State Management

### Patient Portal Contexts

```javascript
// AppContext
- currency
- calculateAge
- slotDataFormat

// AuthContext
- user
- token
- isLoggedIn
- loading
- login
- register
- updateProfile
- getAllDoctors
- getDoctor
- bookAppointment
- listAppointments
- cancelAppointment
- logout
```

### Admin & Doctor Portal Contexts

```javascript
// AppContext
- currency
- calculateAge
- slotDataFormat

// AdminContext
- admin
- aToken
- isAdminLoggedIn
- adminLoading
- adminLogin
- addDoctor
- getAllDoctors
- getDoctors
- appointments
- getAllAppointments
- cancelAppointment
- adminLogout
- dashData
- getDashData

// DoctorContext
- doctor
- dToken
- isDoctorLoggedIn
- doctorLoading
- doctorLogin
- getProfile
- updateProfile
- appointments
- getAppointments
- completeAppointment
- cancelAppointment
- doctorLogout
```

## Image Storage

The application uses Cloudinary for image storage:

1. Frontend captures image file
2. Backend middleware processes the image using multer
3. Image is uploaded to Cloudinary
4. Cloudinary URL is stored in the database
5. Images are served from Cloudinary CDN

## Error Handling

### Backend Error Handling

```javascript
// Example of error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
```

### Frontend Error Handling

```javascript
// Example of error handling in API calls
try {
  const response = await axios.get('/api/resource');
  // Process response
} catch (error) {
  // Extract error message
  const message = 
    error.response?.data?.message || 
    error.message || 
    'An unexpected error occurred';
  
  // Display error to user
  toast.error(message);
  
  // Log error for debugging
  console.error('API Error:', error);
}
```

## Security Implementation

### Password Hashing

```javascript
// Using bcrypt for password hashing
const bcrypt = require('bcryptjs');

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

### JWT Token Generation

```javascript
// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};
```

### Authentication Middleware

```javascript
// Protect routes - User authentication
const protect = async (req, res, next) => {
  let token;
  
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }
  
  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};
```

## Payment Integration

The system supports two payment methods:

1. **Online Payment**: Integrated with payment gateways
2. **Cash Payment**: Handled at the clinic during the appointment

### Payment Flow

1. User selects appointment slot
2. User chooses payment method
3. If online payment:
   - User is redirected to payment gateway
   - After successful payment, appointment is confirmed
4. If cash payment:
   - Appointment is marked as pending payment
   - Payment is collected during the visit

## Testing Strategy

### Unit Testing

- Test individual components and functions
- Mock external dependencies
- Use Jest for testing

### Integration Testing

- Test API endpoints
- Validate request/response formats
- Ensure database operations work correctly

### End-to-End Testing

- Test complete user flows
- Simulate real user interactions
- Verify system behavior as a whole

## Performance Optimization

### Frontend Optimization

- Code splitting for faster initial load
- Lazy loading of components
- Efficient state management
- Image optimization

### Backend Optimization

- Database indexing for faster queries
- Caching frequently accessed data
- Rate limiting to prevent abuse
- Pagination for large data sets

## Deployment Guidelines

### Docker Deployment

```dockerfile
# Example Dockerfile for backend
FROM node:14-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Environment Configuration

```
# Development
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/prescripto
JWT_SECRET=dev_secret

# Production
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=strong_secret
```

### CI/CD Pipeline

1. Automated testing on push
2. Build and package application
3. Deploy to staging for verification
4. Deploy to production with manual approval

## Maintenance and Updates

### Version Control

- Follow semantic versioning (MAJOR.MINOR.PATCH)
- Maintain a CHANGELOG.md file
- Tag releases in repository

### Database Migrations

- Create migration scripts for schema changes
- Test migrations in staging environment
- Schedule maintenance windows for production updates

### Monitoring

- Implement application logging
- Set up performance monitoring
- Configure error tracking
- Establish health checks for services

## Troubleshooting Guide

### Common Backend Issues

1. **Database Connection Issues**
   - Check MongoDB connection string
   - Verify network connectivity
   - Ensure MongoDB service is running

2. **Authentication Failures**
   - Check JWT secret configuration
   - Verify token expiration
   - Validate user credentials

### Common Frontend Issues

1. **API Connection Issues**
   - Check API base URL configuration
   - Verify CORS settings
   - Inspect network requests for errors

2. **Rendering Problems**
   - Check browser console for errors
   - Verify state management
   - Test component rendering

## Future Roadmap

### Short-term (1-3 months)

- Implement email notifications
- Add SMS reminders for appointments
- Improve mobile responsiveness

### Medium-term (3-6 months)

- Develop telemedicine integration
- Implement payment gateway integrations
- Add multi-language support

### Long-term (6-12 months)

- Create native mobile applications
- Implement EHR integration
- Add AI-based doctor recommendations 