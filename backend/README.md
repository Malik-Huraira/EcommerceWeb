# Delight Display Zone - Backend API

E-commerce backend built with Spring Boot 3, PostgreSQL, and JWT authentication.
Fully compatible with the React frontend.

## Features

- JWT Authentication & Authorization
- Role-based access control (Admin, Customer)
- User management with avatar support
- Product management with multiple images, tags, featured/new flags
- Category management
- Shopping cart
- Wishlist
- Order management
- Reviews & Ratings
- Mock payment integration
- Admin dashboard with statistics
- Swagger/OpenAPI documentation

## Tech Stack

- Java 17
- Spring Boot 3.2
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT (jjwt)
- Lombok
- Swagger/OpenAPI

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- PostgreSQL 15+ (or Docker)

### Running with Docker

```bash
docker-compose up -d
```

### Running Locally

1. Start PostgreSQL and create database:

```sql
CREATE DATABASE ecommerce;
```

2. Configure environment variables or update `application.yml`

3. Run the application:

```bash
mvn spring-boot:run
```

## API Documentation

Once running, access Swagger UI at:

- http://localhost:8081/swagger-ui.html

## Data Models (Frontend Compatible)

### Product

```json
{
  "id": "1",
  "name": "Organic Cotton Tee",
  "price": 48,
  "originalPrice": 65,
  "image": "https://...",
  "images": ["https://...", "https://..."],
  "category": "Clothing",
  "description": "...",
  "rating": 4.8,
  "reviews": 124,
  "inStock": true,
  "stockCount": 45,
  "tags": ["organic", "sustainable"],
  "featured": true,
  "isNew": false
}
```

### User

```json
{
  "id": "1",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": "https://...",
  "role": "CUSTOMER"
}
```

### Cart Item

```json
{
  "id": "1",
  "productId": "1",
  "name": "Organic Cotton Tee",
  "image": "https://...",
  "category": "Clothing",
  "price": 48,
  "quantity": 2
}
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Users

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user

### Products

- `GET /api/products` - List products (with filters: name, category, minPrice, maxPrice, inStock, featured, new)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new` - Get new products
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)

### Categories

- `GET /api/categories` - List categories
- `GET /api/categories/{id}` - Get category
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/{id}` - Update category (Admin)
- `DELETE /api/categories/{id}` - Delete category (Admin)

### Cart

- `GET /api/cart` - Get cart
- `POST /api/cart/items` - Add to cart
- `PUT /api/cart/items/{productId}` - Update quantity
- `DELETE /api/cart/items/{productId}` - Remove item
- `DELETE /api/cart` - Clear cart

### Wishlist

- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist/items/{productId}` - Add to wishlist
- `DELETE /api/wishlist/items/{productId}` - Remove from wishlist
- `GET /api/wishlist/check/{productId}` - Check if in wishlist
- `DELETE /api/wishlist` - Clear wishlist

### Orders

- `GET /api/orders` - Get user orders
- `GET /api/orders/{id}` - Get order details
- `POST /api/orders` - Create order
- `POST /api/orders/{id}/cancel` - Cancel order

### Reviews

- `GET /api/reviews/product/{productId}` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/{id}` - Update review
- `DELETE /api/reviews/{id}` - Delete review

### Payments

- `POST /api/payments/create-intent/{orderId}` - Create payment
- `POST /api/payments/confirm/{paymentIntentId}` - Confirm payment
- `GET /api/payments/status/{paymentIntentId}` - Get status

### Admin

- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - List users
- `GET /api/admin/orders` - List all orders
- `PATCH /api/admin/orders/{id}/status` - Update order status
- `PATCH /api/admin/users/{id}/role` - Set user role
- `PATCH /api/admin/users/{id}/toggle-enabled` - Toggle user status
