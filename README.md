# 👑 Royal Mart - Iranian Sweets E-Commerce Platform

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-6DB33F?style=flat&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

Royal Mart is a production-grade, full-stack e-commerce platform designed for Iranian sweets and confectionery retail. Built with modern architecture using Spring Boot, React, and PostgreSQL, it provides secure authentication, real-time cart management, admin analytics dashboard, and comprehensive order management.

## ✨ Key Features

### 🛒 Shopping Experience

- **Product Catalog**: Browse products with search, filters, and pagination
- **Smart Cart**: Real-time cart synchronization across devices
- **Wishlist**: Save favorite products for later purchase
- **Order Tracking**: Complete order history with status updates
- **Product Reviews**: Customer ratings and reviews system

### 🔐 Authentication & Security

- **JWT Authentication**: Secure token-based authentication system
- **Password Security**: BCrypt hashing with password reset via email
- **Role-Based Access**: ADMIN and CUSTOMER roles with protected routes
- **Security Headers**: XSS protection, CSRF prevention, CORS configuration

### 📊 Admin Dashboard

- **Analytics Charts**: Revenue trends, order statistics, category performance
- **Product Management**: Full CRUD with image upload support
- **Order Management**: View all orders, update status, track payments
- **User Management**: View customers, change roles, enable/disable accounts
- **Category Management**: Organize products into categories

### ⚡ Performance & Scalability

- **Connection Pooling**: HikariCP with optimized settings
- **Response Caching**: Caffeine cache for frequently accessed data
- **Batch Processing**: Hibernate batch inserts/updates
- **Gzip Compression**: Reduced payload sizes
- **Lazy Loading**: Optimized image loading

## � Tech Stack

### Backend

| Technology        | Version | Purpose                        |
| ----------------- | ------- | ------------------------------ |
| Java              | 17      | Programming Language           |
| Spring Boot       | 3.3.5   | Application Framework          |
| Spring Security   | 6.x     | Authentication & Authorization |
| Spring Data JPA   | 3.x     | Database ORM                   |
| PostgreSQL        | 15      | Relational Database            |
| JWT (jjwt)        | 0.12.3  | Token Authentication           |
| Caffeine          | 3.x     | In-Memory Caching              |
| SpringDoc OpenAPI | 2.3.0   | API Documentation              |

### Frontend

| Technology    | Version | Purpose                 |
| ------------- | ------- | ----------------------- |
| React         | 18.3    | UI Library              |
| TypeScript    | 5.8     | Type Safety             |
| Vite          | 5.4     | Build Tool & Dev Server |
| Tailwind CSS  | 3.4     | Utility-First Styling   |
| shadcn/ui     | Latest  | UI Component Library    |
| Framer Motion | 12.x    | Animations              |
| Recharts      | 2.15    | Analytics Charts        |
| React Router  | 6.30    | Client-Side Routing     |

### DevOps

| Technology     | Purpose                        |
| -------------- | ------------------------------ |
| Docker         | Containerization               |
| Docker Compose | Multi-Container Orchestration  |
| Nginx          | Reverse Proxy & Static Serving |
| GitHub Actions | CI/CD Pipeline                 |

## 🏗 Architecture

```
                                    ┌─────────────────┐
                                    │   Client        │
                                    │   (Browser)     │
                                    └────────┬────────┘
                                             │
                                             ▼
┌────────────────────────────────────────────────────────────────┐
│                         NGINX                                   │
│              (Reverse Proxy / Load Balancer)                   │
│                        Port 80                                  │
└───────────────────┬────────────────────┬───────────────────────┘
                    │                    │
                    ▼                    ▼
         ┌──────────────────┐  ┌──────────────────┐
         │    Frontend      │  │    Backend       │
         │    (React)       │  │  (Spring Boot)   │
         │    Port 8082     │  │    Port 8081     │
         └──────────────────┘  └────────┬─────────┘
                                        │
                                        ▼
                               ┌──────────────────┐
                               │   PostgreSQL     │
                               │    Port 5432     │
                               └──────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose installed
- Git installed

### Run with Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/Malik-Huraira/royal-mart.git
cd royal-mart

# Start all services
docker-compose up -d

# Application URLs:
# Frontend:    http://localhost:8082
# Backend API: http://localhost:8081/api
# Swagger UI:  http://localhost:8081/swagger-ui.html
```

### Run Locally (Development)

```bash
# Terminal 1 - Database
docker-compose up -d postgres

# Terminal 2 - Backend
cd backend
cp .env.example .env
./mvnw spring-boot:run

# Terminal 3 - Frontend
cd frontend/delight-display-zone
npm install
npm run dev
```

## 📚 API Endpoints

### Public Endpoints

| Method | Endpoint                    | Description            |
| ------ | --------------------------- | ---------------------- |
| POST   | `/api/auth/register`        | Register new user      |
| POST   | `/api/auth/login`           | User login             |
| POST   | `/api/auth/forgot-password` | Request password reset |
| GET    | `/api/products`             | List products          |
| GET    | `/api/products/{id}`        | Get product details    |
| GET    | `/api/categories`           | List categories        |

### Protected Endpoints (Requires Authentication)

| Method | Endpoint          | Description     |
| ------ | ----------------- | --------------- |
| GET    | `/api/cart`       | Get user cart   |
| POST   | `/api/cart/items` | Add to cart     |
| GET    | `/api/wishlist`   | Get wishlist    |
| POST   | `/api/orders`     | Create order    |
| GET    | `/api/orders`     | Get user orders |

### Admin Endpoints (Requires ADMIN Role)

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| GET    | `/api/admin/dashboard` | Dashboard statistics |
| GET    | `/api/admin/analytics` | Analytics data       |
| GET    | `/api/admin/orders`    | All orders           |
| GET    | `/api/admin/users`     | All users            |
| POST   | `/api/products`        | Create product       |
| PUT    | `/api/products/{id}`   | Update product       |
| DELETE | `/api/products/{id}`   | Delete product       |

📖 **Full API Documentation:** http://localhost:8081/swagger-ui.html

## 📁 Project Structure

```
royal-mart/
├── backend/
│   ├── src/main/java/com/delightdisplay/
│   │   ├── config/           # Security, Cache, CORS configs
│   │   ├── controller/       # REST API controllers
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entity/           # JPA entities
│   │   ├── exception/        # Custom exceptions & handlers
│   │   ├── repository/       # Data access layer
│   │   ├── security/         # JWT filter & service
│   │   └── service/          # Business logic
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/delight-display-zone/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route pages
│   │   │   └── admin/        # Admin dashboard pages
│   │   ├── services/         # API service layer
│   │   ├── context/          # React context (auth, cart)
│   │   └── hooks/            # Custom React hooks
│   ├── Dockerfile
│   └── package.json
│
├── .github/workflows/        # CI/CD pipelines
├── docker-compose.yml        # Development setup
├── docker-compose.prod.yml   # Production setup
└── README.md
```

## ⚙️ Environment Variables

### Backend

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/ecommerce
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
JWT_SECRET=your-256-bit-secret-key
MAIL_HOST=smtp.gmail.com
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:8082
```

### Frontend

```env
VITE_API_URL=http://localhost:8081/api
```

## 🚢 Deployment

### Production Deployment

```bash
# Set production environment variables
export DB_PASSWORD=secure_password
export JWT_SECRET=production-secret-key

# Deploy with production config (includes scaling)
docker-compose -f docker-compose.prod.yml up -d
```

### CI/CD Pipeline

The project includes GitHub Actions for:

- **Automated Testing**: Runs on every push/PR
- **Docker Image Build**: Builds and pushes to GitHub Container Registry
- **Manual Deployment**: Deploy to staging/production on demand

## 📊 Database Schema

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    users     │     │   products   │     │  categories  │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id           │     │ id           │     │ id           │
│ email        │     │ name         │     │ name         │
│ password     │     │ description  │     │ description  │
│ name         │     │ price        │     │ image        │
│ role         │     │ image        │     └──────┬───────┘
│ enabled      │     │ category_id  │────────────┘
└──────┬───────┘     │ stock_count  │
       │             │ featured     │
       │             └──────────────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│    orders    │     │ order_items  │
├──────────────┤     ├──────────────┤
│ id           │     │ id           │
│ user_id      │────►│ order_id     │
│ total_amount │     │ product_id   │
│ status       │     │ quantity     │
│ shipping_addr│     │ price        │
└──────────────┘     └──────────────┘
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## � License

This project is licensed under the MIT License.

## 👨‍� Author

**Malik Huraira**

- GitHub: [@Malik-Huraira](https://github.com/Malik-Huraira)
- Email: malikhurara123@gmail.com

---

<p align="center">
  Made with ❤️ for Iranian Sweets Lovers
</p>
