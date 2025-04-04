# Prescripto API Documentation

This document provides detailed information about the Prescripto API endpoints, request/response formats, authentication requirements, and error handling.

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:5000/api/
```

For production, the base URL would be your deployed API server:

```
https://your-api-domain.com/api/
```

## Authentication

Most API endpoints require authentication. There are three types of authentication tokens:

1. **User Token**: For patient-related operations
   - Format: `Authorization: Bearer <token>`
2. **Doctor Token**: For doctor-related operations
   - Format: `dToken: Bearer <token>`
3. **Admin Token**: For administrative operations
   - Format: `aToken: <token>`

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

Common HTTP status codes used:
- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication failure
- `403 Forbidden`: Permission denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

## API Endpoints

### User Authentication

#### Register User

```
POST /api/users/register
```

Register a new patient user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### User Login

```
POST /api/users/login
```

Authenticate a patient user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "image": "profile_image_url"
  }
}
```

### User Profile

#### Get User Profile

```
GET /api/users/get-profile
```

Retrieve the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "State",
      "zip": "12345"
    },
    "gender": "male",
    "dob": "1990-01-01",
    "image": "profile_image_url"
  }
}
```

#### Update User Profile

```
POST /api/users/update-profile
```

Update the authenticated user's profile details.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (FormData):**
```
name: John Smith
phone: 9876543210
address: {"street":"456 Oak St","city":"Newtown","state":"State","zip":"54321"}
gender: male
dob: 1990-01-01
image: [file] (optional)
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "user_id",
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "9876543210",
    "address": {
      "street": "456 Oak St",
      "city": "Newtown",
      "state": "State",
      "zip": "54321"
    },
    "gender": "male",
    "dob": "1990-01-01",
    "image": "updated_profile_image_url"
  }
}
```

### Doctors

#### Get All Doctors

```
GET /api/users/get-doctors
```

Retrieve a list of all available doctors.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "doctors": [
    {
      "_id": "doctor_id_1",
      "name": "Dr. Jane Smith",
      "speciality": "Cardiologist",
      "experience": 10,
      "fees": 100,
      "rating": 4.8,
      "image": "doctor_image_url"
    },
    {
      "_id": "doctor_id_2",
      "name": "Dr. Michael Johnson",
      "speciality": "Dermatologist",
      "experience": 8,
      "fees": 90,
      "rating": 4.5,
      "image": "doctor_image_url"
    }
  ]
}
```

#### Get Doctor by ID

```
GET /api/users/get-doctor/:id
```

Retrieve detailed information about a specific doctor.

**Parameters:**
- `id`: Doctor ID

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "doctor": {
    "_id": "doctor_id",
    "name": "Dr. Jane Smith",
    "email": "drjane@example.com",
    "phone": "1234567890",
    "speciality": "Cardiologist",
    "experience": 10,
    "fees": 100,
    "address": {
      "street": "789 Medical Plaza",
      "city": "Healthville",
      "state": "State",
      "zip": "67890"
    },
    "rating": 4.8,
    "numberOfRatings": 45,
    "image": "doctor_image_url",
    "about": "Board-certified cardiologist with 10 years of experience..."
  },
  "availability": [
    {
      "day": "Monday",
      "available": true,
      "slots": ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM"]
    },
    {
      "day": "Tuesday",
      "available": true,
      "slots": ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM"]
    },
    {
      "day": "Wednesday",
      "available": false,
      "slots": []
    }
  ]
}
```

### Appointments

#### Book Appointment

```
POST /api/users/book-appointment
```

Book a new appointment with a doctor.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "docId": "doctor_id",
  "slotDate": "2023_01_15",
  "slotTime": "10:00 AM",
  "amount": 100,
  "payment": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "appointment": {
    "_id": "appointment_id",
    "userId": "user_id",
    "docId": "doctor_id",
    "userData": {
      "name": "John Doe",
      "email": "john@example.com",
      "dob": "1990-01-01",
      "image": "user_image_url"
    },
    "docData": {
      "name": "Dr. Jane Smith",
      "speciality": "Cardiologist",
      "image": "doctor_image_url"
    },
    "slotDate": "2023_01_15",
    "slotTime": "10:00 AM",
    "amount": 100,
    "payment": true,
    "isCompleted": false,
    "cancelled": false,
    "createdAt": "2023-01-10T12:00:00.000Z"
  }
}
```

#### Get User Appointments

```
GET /api/users/list-appointment
```

Retrieve a list of all appointments for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "appointments": [
    {
      "_id": "appointment_id_1",
      "userId": "user_id",
      "docId": "doctor_id",
      "userData": {
        "name": "John Doe",
        "email": "john@example.com",
        "dob": "1990-01-01",
        "image": "user_image_url"
      },
      "docData": {
        "name": "Dr. Jane Smith",
        "speciality": "Cardiologist",
        "image": "doctor_image_url"
      },
      "slotDate": "2023_01_15",
      "slotTime": "10:00 AM",
      "amount": 100,
      "payment": true,
      "isCompleted": false,
      "cancelled": false,
      "createdAt": "2023-01-10T12:00:00.000Z"
    },
    {
      "_id": "appointment_id_2",
      "userId": "user_id",
      "docId": "doctor_id_2",
      "userData": {
        "name": "John Doe",
        "email": "john@example.com",
        "dob": "1990-01-01",
        "image": "user_image_url"
      },
      "docData": {
        "name": "Dr. Michael Johnson",
        "speciality": "Dermatologist",
        "image": "doctor_image_url"
      },
      "slotDate": "2023_01_20",
      "slotTime": "11:00 AM",
      "amount": 90,
      "payment": false,
      "isCompleted": false,
      "cancelled": false,
      "createdAt": "2023-01-10T14:00:00.000Z"
    }
  ]
}
```

#### Cancel Appointment

```
POST /api/users/cancel-appointment
```

Cancel an existing appointment.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "appointmentId": "appointment_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully"
}
```

### Doctor Authentication

#### Doctor Login

```
POST /api/doctor/login
```

Authenticate a doctor user.

**Request Body:**
```json
{
  "email": "drjane@example.com",
  "password": "doctorpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "data": {
    "_id": "doctor_id",
    "name": "Dr. Jane Smith",
    "email": "drjane@example.com",
    "speciality": "Cardiologist"
  }
}
```

### Doctor Profile

#### Get Doctor Profile

```
GET /api/doctor/profile
```

Retrieve the authenticated doctor's profile.

**Headers:**
```
dToken: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "_id": "doctor_id",
    "name": "Dr. Jane Smith",
    "email": "drjane@example.com",
    "phone": "1234567890",
    "speciality": "Cardiologist",
    "experience": 10,
    "fees": 100,
    "address": {
      "street": "789 Medical Plaza",
      "city": "Healthville",
      "state": "State",
      "zip": "67890"
    },
    "availability": [
      {
        "day": "Monday",
        "available": true,
        "slots": ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM"]
      },
      {
        "day": "Tuesday",
        "available": true,
        "slots": ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM"]
      }
    ],
    "rating": 4.8,
    "numberOfRatings": 45,
    "image": "doctor_image_url",
    "about": "Board-certified cardiologist with 10 years of experience..."
  }
}
```

#### Update Doctor Profile

```
POST /api/doctor/update-profile
```

Update the authenticated doctor's profile details.

**Headers:**
```
dToken: Bearer <token>
```

**Request Body (FormData):**
```
name: Dr. Jane A. Smith
phone: 9876543210
address: {"street":"123 Health Blvd","city":"Medicaltown","state":"State","zip":"12345"}
about: Board-certified cardiologist with 10+ years of experience specializing in...
image: [file] (optional)
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "doctor_id",
    "name": "Dr. Jane A. Smith",
    "email": "drjane@example.com",
    "phone": "9876543210",
    "speciality": "Cardiologist",
    "experience": 10,
    "fees": 100,
    "address": {
      "street": "123 Health Blvd",
      "city": "Medicaltown",
      "state": "State",
      "zip": "12345"
    },
    "about": "Board-certified cardiologist with 10+ years of experience specializing in...",
    "image": "updated_doctor_image_url"
  }
}
```

### Doctor Appointments

#### Get Doctor Appointments

```
GET /api/doctor/appointments
```

Retrieve a list of all appointments for the authenticated doctor.

**Headers:**
```
dToken: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "appointments": [
    {
      "_id": "appointment_id_1",
      "userId": "user_id_1",
      "docId": "doctor_id",
      "userData": {
        "name": "John Doe",
        "email": "john@example.com",
        "dob": "1990-01-01",
        "image": "user_image_url"
      },
      "docData": {
        "name": "Dr. Jane Smith",
        "speciality": "Cardiologist",
        "image": "doctor_image_url"
      },
      "slotDate": "2023_01_15",
      "slotTime": "10:00 AM",
      "amount": 100,
      "payment": true,
      "isCompleted": false,
      "cancelled": false,
      "createdAt": "2023-01-10T12:00:00.000Z"
    },
    {
      "_id": "appointment_id_2",
      "userId": "user_id_2",
      "docId": "doctor_id",
      "userData": {
        "name": "Sarah Johnson",
        "email": "sarah@example.com",
        "dob": "1985-03-15",
        "image": "user_image_url"
      },
      "docData": {
        "name": "Dr. Jane Smith",
        "speciality": "Cardiologist",
        "image": "doctor_image_url"
      },
      "slotDate": "2023_01_16",
      "slotTime": "11:00 AM",
      "amount": 100,
      "payment": false,
      "isCompleted": false,
      "cancelled": false,
      "createdAt": "2023-01-11T09:00:00.000Z"
    }
  ]
}
```

#### Complete Appointment

```
POST /api/doctor/complete-appointment
```

Mark an appointment as completed.

**Headers:**
```
dToken: Bearer <token>
```

**Request Body:**
```json
{
  "appointmentId": "appointment_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment marked as completed"
}
```

#### Cancel Appointment (Doctor)

```
POST /api/doctor/cancel-appointment
```

Cancel an appointment as a doctor.

**Headers:**
```
dToken: Bearer <token>
```

**Request Body:**
```json
{
  "appointmentId": "appointment_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully"
}
```

#### Update Availability

```
POST /api/doctor/change-availability
```

Update the doctor's availability schedule.

**Headers:**
```
dToken: Bearer <token>
```

**Request Body:**
```json
{
  "availability": [
    {
      "day": "Monday",
      "available": true,
      "slots": ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM"]
    },
    {
      "day": "Tuesday",
      "available": true,
      "slots": ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM"]
    },
    {
      "day": "Wednesday",
      "available": false,
      "slots": []
    },
    {
      "day": "Thursday",
      "available": true,
      "slots": ["01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM"]
    },
    {
      "day": "Friday",
      "available": true,
      "slots": ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM"]
    },
    {
      "day": "Saturday",
      "available": true,
      "slots": ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM"]
    },
    {
      "day": "Sunday",
      "available": false,
      "slots": []
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Availability updated successfully"
}
```

### Admin Authentication

#### Admin Login

```
POST /api/admin/login
```

Authenticate an admin user.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "adminpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "data": {
    "_id": "admin_id",
    "name": "Admin User",
    "email": "admin@example.com"
  }
}
```

### Admin Endpoints

#### Add Doctor

```
POST /api/admin/add-doctor
```

Add a new doctor to the system.

**Headers:**
```
aToken: <token>
```

**Request Body:**
```json
{
  "name": "Dr. Robert Williams",
  "email": "drrobert@example.com",
  "password": "doctorpassword123",
  "phone": "1234567890",
  "speciality": "Neurologist",
  "experience": 12,
  "fees": 120,
  "address": {
    "street": "456 Neuro Center",
    "city": "Braintown",
    "state": "State",
    "zip": "54321"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Doctor added successfully",
  "doctor": {
    "_id": "new_doctor_id",
    "name": "Dr. Robert Williams",
    "email": "drrobert@example.com",
    "phone": "1234567890",
    "speciality": "Neurologist",
    "experience": 12,
    "fees": 120,
    "address": {
      "street": "456 Neuro Center",
      "city": "Braintown",
      "state": "State",
      "zip": "54321"
    },
    "availability": [
      {
        "day": "Monday",
        "available": true,
        "slots": ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM"]
      },
      {
        "day": "Tuesday",
        "available": true,
        "slots": ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM"]
      }
    ],
    "image": "default_doctor_image_url"
  }
}
```

#### Get All Doctors (Admin)

```
GET /api/admin/all-doctors
```

Retrieve a list of all doctors in the system.

**Headers:**
```
aToken: <token>
```

**Response:**
```json
{
  "success": true,
  "doctors": [
    {
      "_id": "doctor_id_1",
      "name": "Dr. Jane Smith",
      "email": "drjane@example.com",
      "phone": "1234567890",
      "speciality": "Cardiologist",
      "experience": 10,
      "fees": 100,
      "address": {
        "street": "789 Medical Plaza",
        "city": "Healthville",
        "state": "State",
        "zip": "67890"
      },
      "image": "doctor_image_url",
      "about": "Board-certified cardiologist with 10 years of experience..."
    },
    {
      "_id": "doctor_id_2",
      "name": "Dr. Michael Johnson",
      "email": "drmichael@example.com",
      "phone": "9876543210",
      "speciality": "Dermatologist",
      "experience": 8,
      "fees": 90,
      "address": {
        "street": "123 Skin Care Ave",
        "city": "Dermtown",
        "state": "State",
        "zip": "13579"
      },
      "image": "doctor_image_url",
      "about": "Experienced dermatologist specializing in..."
    }
  ]
}
```

#### Update Doctor Availability (Admin)

```
POST /api/admin/change-availability
```

Update a doctor's availability as an admin.

**Headers:**
```
aToken: <token>
```

**Request Body:**
```json
{
  "docId": "doctor_id",
  "availability": [
    {
      "day": "Monday",
      "available": true,
      "slots": ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM"]
    },
    {
      "day": "Tuesday",
      "available": true,
      "slots": ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM"]
    },
    {
      "day": "Wednesday",
      "available": false,
      "slots": []
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Availability updated successfully"
}
```

#### Get All Appointments (Admin)

```
GET /api/admin/appointments
```

Retrieve a list of all appointments in the system.

**Headers:**
```
aToken: <token>
```

**Response:**
```json
{
  "success": true,
  "appointments": [
    {
      "_id": "appointment_id_1",
      "userId": "user_id_1",
      "docId": "doctor_id_1",
      "userData": {
        "name": "John Doe",
        "email": "john@example.com",
        "dob": "1990-01-01",
        "image": "user_image_url"
      },
      "docData": {
        "name": "Dr. Jane Smith",
        "speciality": "Cardiologist",
        "image": "doctor_image_url"
      },
      "slotDate": "2023_01_15",
      "slotTime": "10:00 AM",
      "amount": 100,
      "payment": true,
      "isCompleted": false,
      "cancelled": false,
      "createdAt": "2023-01-10T12:00:00.000Z"
    },
    {
      "_id": "appointment_id_2",
      "userId": "user_id_2",
      "docId": "doctor_id_2",
      "userData": {
        "name": "Sarah Johnson",
        "email": "sarah@example.com",
        "dob": "1985-03-15",
        "image": "user_image_url"
      },
      "docData": {
        "name": "Dr. Michael Johnson",
        "speciality": "Dermatologist",
        "image": "doctor_image_url"
      },
      "slotDate": "2023_01_16",
      "slotTime": "11:00 AM",
      "amount": 90,
      "payment": false,
      "isCompleted": false,
      "cancelled": false,
      "createdAt": "2023-01-11T09:00:00.000Z"
    }
  ]
}
```

#### Cancel Appointment (Admin)

```
POST /api/admin/cancel-appointment
```

Cancel an appointment as an admin.

**Headers:**
```
aToken: <token>
```

**Request Body:**
```json
{
  "appointmentId": "appointment_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully"
}
```

#### Get Dashboard Data

```
GET /api/admin/dashboard
```

Retrieve data for the admin dashboard.

**Headers:**
```
aToken: <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "doctorCount": 25,
    "userCount": 150,
    "appointmentCount": 320,
    "recentAppointments": [
      {
        "_id": "appointment_id_1",
        "userData": {
          "name": "John Doe",
          "image": "user_image_url"
        },
        "docData": {
          "name": "Dr. Jane Smith",
          "speciality": "Cardiologist"
        },
        "slotDate": "2023_01_15",
        "slotTime": "10:00 AM",
        "amount": 100,
        "payment": true,
        "isCompleted": false,
        "cancelled": false,
        "createdAt": "2023-01-10T12:00:00.000Z"
      },
      {
        "_id": "appointment_id_2",
        "userData": {
          "name": "Sarah Johnson",
          "image": "user_image_url"
        },
        "docData": {
          "name": "Dr. Michael Johnson",
          "speciality": "Dermatologist"
        },
        "slotDate": "2023_01_16",
        "slotTime": "11:00 AM",
        "amount": 90,
        "payment": false,
        "isCompleted": false,
        "cancelled": false,
        "createdAt": "2023-01-11T09:00:00.000Z"
      }
    ]
  }
}
```

## Rate Limiting

To prevent abuse, the API implements rate limiting:

- 100 requests per minute for authenticated users
- 30 requests per minute for unauthenticated users

When rate limiting is triggered, the API will respond with a 429 (Too Many Requests) status code:

```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

## Cross-Origin Resource Sharing (CORS)

The API supports Cross-Origin Resource Sharing (CORS) for specific domains. If you're accessing the API from a web application and encounter CORS issues, ensure your domain is whitelisted in the API's CORS configuration.

## API Versioning

The current API version is v1, which is the default. All endpoints described in this document are under the v1 namespace. Future versions may be introduced with breaking changes and will be accessed using a version prefix.

## Webhooks

The API provides webhooks for certain events to enable real-time notifications. Contact the system administrator to set up webhook endpoints.

Available webhook events:
- `appointment.created`
- `appointment.completed`
- `appointment.cancelled`
- `doctor.added`
- `user.registered` 