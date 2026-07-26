# EduStack Pro — Smart Campus & Tenancy Management System

EduStack Pro is a modern, enterprise-grade Progressive Web App (PWA) designed to manage attendance, classes, subjects, library resources, assignments, and peer learning networks across multiple colleges concurrently, with strict tenant isolation.

## 🚀 Key Features

* **🏢 Multi-College Tenancy & Isolation**: 
  - Dynamic college onboarding verified by license controls.
  - Strict directory and data separation scoped by College ID.
  - College-specific staff registration access keys.
* **📊 Role-Based Intelligent Dashboards**:
  - Interactive charts (Attendance compliancy, performance analytics).
  - Separate portals for **Admins**, **Teachers (Faculty)**, and **Students**.
* **📱 Progressive Web App (PWA)**:
  - Installed standalone container support on desktop and mobile.
  - Offline capability and custom offline fallback UI.
  - Custom in-app installation promotion cards.
* **🤝 Global Peer Finder (Study Buddies)**:
  - Matchmaking engine allowing students to find experts across colleges.
  - Tutor profiles, expertise matching, and session pairing.
* **📚 Campus Hubs**:
  - **Smart Library**: Search catalogues, reviews, and manage checkouts.
  - **Resource Hub**: Upload and share learning resources.
  - **Subject Forums**: Interactive threads with answers, solves, and votes.
  - **Campus Marketplace**: Sell, browse, and trade items.

---

## 🛠️ Tech Stack

* **Frontend**: React (Vite), Tailwind CSS, Chart.js, Recharts, jsPDF, Lucide Icons, Axios.
* **Backend**: Node.js, Express.js, JWT, bcryptjs, Nodemailer, PDFKit, Socket.io.
* **Database**: PostgreSQL (via Sequelize ORM).

---

## 💻 Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org) (v18+)
* [PostgreSQL](https://www.postgresql.org/) database server running.

### 1. Database Setup
Create a PostgreSQL database named `edustack` (or preferred name) and update the credentials in the backend environment file.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables by creating a `.env` file:
   ```env
   PORT=5000
   JWT_SECRET=YOUR_SECRET_JWT_KEY
   DB_HOST=127.0.0.1
   DB_USER=postgres
   DB_PASS=YOUR_DB_PASSWORD
   DB_NAME=edustack
   DB_PORT=5432
   ```
4. Start the development server (runs database sync & seeding automatically):
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web app in your browser at `http://localhost:5173`.
