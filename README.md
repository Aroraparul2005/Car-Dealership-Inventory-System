"# Car-Dealership-Inventory-System" 
````markdown
# Vehicle Inventory Management System – Backend API

A RESTful backend API for a **Vehicle Inventory Management System** built with **Node.js, Express, TypeScript, MongoDB, and Mongoose**. The API provides secure user authentication using JWT, role-based authorization, vehicle inventory management, Cloudinary image uploads, search and filtering, pagination, and inventory operations.

---

# Features

## Authentication

- User registration
- User login
- JWT-based authentication
- Protected API routes
- Role-based authorization (User/Admin)

## Vehicle Management

- Add new vehicles
- View all vehicles
- Update vehicle details
- Delete vehicles (Admin only)
- Upload vehicle images using Cloudinary
- Search vehicles by:
  - Make
  - Model
  - Category
  - Minimum Price
  - Maximum Price

## Inventory Management

- Purchase vehicles
- Restock vehicles (Admin only)
- Automatic stock updates
- Prevent purchasing when stock is unavailable

## Pagination

- Paginated vehicle listing
- Paginated search results
- Pagination metadata included in every response

## Other Features

- Global error handling
- Request validation
- Secure password hashing
- Automated testing with Jest and Supertest

---

# Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- bcrypt
- Multer
- Cloudinary
- Jest
- Supertest

---

# Project Structure

```
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── tests/
│   ├── app.ts
│   └── server.ts
│
├── uploads/
├── package.json
└── tsconfig.json
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/vehicle-inventory.git

cd vehicle-inventory/backend
```

Install dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

# Running the Project

Development

```bash
npm run dev
```

Production

```bash
npm run build

npm start
```

---

# Authentication

After a successful login or registration, the API returns a JWT token.

Example response

```json
{
  "_id": "665d...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "JWT_TOKEN"
}
```

Use the token for protected endpoints.

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# Image Upload

Vehicle images are uploaded using **Cloudinary**.

Features:

- Image upload via multipart/form-data
- Multer middleware
- Cloudinary storage
- Image URL saved in MongoDB
- Secure image hosting

---

# API Documentation

## Authentication

### Register

**POST**

```
/api/auth/register
```

Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Success (201)

```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "JWT_TOKEN"
}
```

Errors

| Status | Description |
|---------|-------------|
| 400 | Missing name, email or password |
| 409 | Email already exists |

---

### Login

**POST**

```
/api/auth/login
```

Request

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Success (200)

```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "JWT_TOKEN"
}
```

Errors

| Status | Description |
|---------|-------------|
| 400 | Missing email or password |
| 401 | Invalid email or password |

---

# Vehicle Endpoints

## Get All Vehicles

```
GET /api/vehicles?page=1
```

Returns a paginated list of vehicles.

---

## Search Vehicles

```
GET /api/vehicles/search
```

Supported Query Parameters

| Parameter | Description |
|------------|-------------|
| make | Search by make |
| model | Search by model |
| category | Vehicle category |
| minPrice | Minimum price |
| maxPrice | Maximum price |
| page | Page number |

Example

```
GET /api/vehicles/search?category=car&minPrice=10000&maxPrice=50000&page=1
```

---

## Add Vehicle

Requires Authentication

```
POST /api/vehicles
```

Content-Type

```
multipart/form-data
```

Fields

| Field | Required |
|--------|----------|
| make | Yes |
| model | Yes |
| category | Yes |
| price | Yes |
| quantity | No |
| image | Yes |

Returns the created vehicle.

---

## Update Vehicle

Requires Authentication

```
PUT /api/vehicles/:id
```

Updates an existing vehicle.

---

## Delete Vehicle

Requires Admin

```
DELETE /api/vehicles/:id
```

Returns

```json
{
  "message": "Vehicle deleted successfully"
}
```

---

# Inventory Endpoints

## Purchase Vehicle

Requires Authentication

```
POST /api/vehicles/:id/purchase
```

Request

```json
{
  "quantity": 1
}
```

Response

```json
{
  "message": "Purchase successful",
  "vehicle": {}
}
```

---

## Restock Vehicle

Requires Admin

```
POST /api/vehicles/:id/restock
```

Request

```json
{
  "quantity": 5
}
```

Response

```json
{
  "message": "Restock successful",
  "vehicle": {}
}
```

---

# Pagination

The API supports pagination for vehicle listings and search results.

### Example

```
GET /api/vehicles?page=2
```

Response

```json
{
  "vehicles": [],
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 52,
    "totalPages": 6
  }
}
```

Pagination fields

| Field | Description |
|--------|-------------|
| page | Current page |
| limit | Number of vehicles per page |
| total | Total matching vehicles |
| totalPages | Number of pages |

---

# Error Handling

Every error follows the same response format.

```json
{
  "success": false,
  "message": "Error message",
  "errors": [],
  "stack": "development only"
}
```

Unknown routes

```json
{
  "success": false,
  "message": "Route /example not found"
}
```

---

# Testing

The backend includes automated API tests written using **Jest** and **Supertest**.

### Tested Features

#### Authentication

- User registration
- User login
- Duplicate email validation
- Invalid login
- JWT generation

#### Vehicle Management

- Create vehicle
- Get all vehicles
- Search vehicles
- Update vehicle
- Delete vehicle
- Authorization middleware
- Admin-only routes

#### Inventory

- Purchase vehicle
- Restock vehicle
- Prevent purchasing when stock is unavailable
- Quantity updates

#### Pagination

- Vehicle pagination
- Search pagination
- Pagination metadata
- Empty page handling

Run tests

```bash
npm test
```

Watch mode

```bash
npm run test:watch
```

Coverage

```bash
npm run test:coverage
```

---

# API Security

- JWT Authentication
- Password hashing with bcrypt
- Protected routes
- Admin authorization
- Environment variables for secrets
- Global error handling

---

# Future Improvements

- Refresh tokens
- Rate limiting
- Request logging
- API documentation with Swagger
- Docker support
- CI/CD pipeline
- Vehicle image optimization
- Purchase history
- Soft delete functionality

---

# My AI Usage

## AI Tools Used

### Grok

I used **Grok** during backend development to brainstorm API architecture, organize routes and controllers, implement JWT authentication, structure MongoDB models, and get suggestions for CRUD operations, validation, and testing strategies.

## How I Used AI

- Planned the REST API structure.
- Improved authentication and authorization logic.
- Generated ideas for middleware organization.
- Assisted with MongoDB schema design.
- Helped write and refine Jest and Supertest test cases.
- Suggested improvements for error handling and validation.

### Lovable
I used **Lovable** during my frontend development I provided all the endpoints with the reponse structure of the endpoints and error reponse structure. ALso informed to implement RBAC using JWT and asked to generate forntend using React.js.

## Reflection

AI accelerated my development process by helping me understand implementation approaches, reducing time spent on boilerplate code, and providing guidance for backend architecture. I reviewed, modified, tested, and integrated all AI-assisted code to ensure it met the project requirements and functioned correctly.

---

# Author

Developed as part of the Vehicle Inventory Management System assignment.
````
