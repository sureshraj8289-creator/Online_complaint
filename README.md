# 🎫 SkillWallet — Complaint Management & Transparency System

A full-stack web application for managing and tracking complaints with role-based access for **Users**, **Agents**, and **Admins**. Built with **React + Vite** on the frontend and **Node.js + Express + MongoDB** on the backend.

---

## 📸 Overview

SkillWallet provides a transparent, streamlined platform where:
- **Users** can submit and track complaints in real time
- **Agents** can manage and resolve assigned complaints
- **Admins** have full oversight — managing users, agents, and system analytics

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version |
|------------|---------|
| React | ^18.3.1 |
| Vite | ^5.2.11 |
| React Router DOM | ^6.23.1 |
| Axios | ^1.7.2 |
| Lucide React (Icons) | ^0.395.0 |

### Backend
| Technology | Version |
|------------|---------|
| Node.js | ES Modules |
| Express | ^4.19.2 |
| MongoDB + Mongoose | ^8.4.1 |
| JWT (Authentication) | ^9.0.2 |
| Bcryptjs (Passwords) | ^2.4.3 |
| Nodemailer (Email) | ^6.9.13 |
| Helmet (Security) | ^7.1.0 |
| Express Validator | ^7.1.0 |

---

## 📁 Project Structure

```
skillwallet/
├── server/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register / Login / JWT
│   │   ├── complaintController.js # Complaint CRUD
│   │   ├── agentController.js     # Agent operations
│   │   ├── adminController.js     # Admin operations
│   │   ├── chatController.js      # Chat/messaging
│   │   └── feedbackController.js  # Feedback handling
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification & role guard
│   │   ├── errorMiddleware.js     # Global error handler
│   │   └── validateMiddleware.js  # Request validation
│   ├── models/
│   │   ├── User.js
│   │   ├── Complaint.js
│   │   ├── Message.js
│   │   └── Feedback.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── agentRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── chatRoutes.js
│   │   └── feedbackRoutes.js
│   ├── utils/
│   │   ├── mailer.js              # Email utility
│   │   └── seed.js                # Database seeder
│   ├── server.js                  # Entry point
│   └── .env                       # Environment variables
│
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── StatusBadge.jsx
    │   │   └── PriorityBadge.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx     # Auth state management
    │   │   └── ComplaintContext.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── UserDashboard.jsx
    │   │   ├── AgentDashboard.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── ComplaintDetailsPage.jsx
    │   │   └── FeedbackPage.jsx
    │   ├── services/
    │   │   └── api.js              # Axios API calls
    │   ├── App.jsx
    │   └── main.jsx
    └── index.html
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/sureshraj8289-creator/raja.git
cd raja
```

---

### 2. Setup Server (Backend)

```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillwallet
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

Start the server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

> Server runs on: `http://localhost:5000`

---

### 3. Setup Client (Frontend)

```bash
cd client
npm install
npm run dev
```

> Client runs on: `http://localhost:5173`

---

### 4. Seed the Database (Optional)

To populate the database with sample data:

```bash
cd server
npm run seed
```

---

## 🔐 User Roles & Access

| Role | Access |
|------|--------|
| **USER** | Register, submit complaints, track status, give feedback |
| **AGENT** | View & manage assigned complaints, chat with users |
| **ADMIN** | Full access — manage users, agents, view all complaints & analytics |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login & get JWT token |
| GET | `/api/complaints` | Get all complaints |
| POST | `/api/complaints` | Submit a new complaint |
| GET | `/api/complaints/:id` | Get complaint details |
| PUT | `/api/complaints/:id` | Update a complaint |
| GET | `/api/agents` | Get all agents |
| GET | `/api/admin` | Admin dashboard data |
| POST | `/api/chat` | Send a chat message |
| POST | `/api/feedback/:id` | Submit feedback for a complaint |
| GET | `/api/health` | Health check |

---

## 🌐 Frontend Routes

| Route | Access | Page |
|-------|--------|------|
| `/` | Public | Home Page |
| `/login` | Public | Login Page |
| `/register` | Public | Register Page |
| `/dashboard` | USER, ADMIN | User Dashboard |
| `/agent` | AGENT, ADMIN | Agent Dashboard |
| `/admin` | ADMIN only | Admin Dashboard |
| `/complaints/:id` | Authenticated | Complaint Details |
| `/feedback/:id` | USER only | Feedback Page |

---

## ⚙️ Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `EMAIL_USER` | Email address for notifications |
| `EMAIL_PASS` | Email app password (Gmail app password) |

---

## 📦 Scripts

### Server (Backend)
```bash
npm run dev    # Start with auto-reload
npm start      # Start production server
npm run seed   # Seed database with sample data
```

### Client (Frontend)
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Suresh Raj** — [@sureshraj8289-creator](https://github.com/sureshraj8289-creator)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
