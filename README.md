<div align="center">
  <h1>Note-Taking Full-Stack Application 📝</h1>
  <p>A modern and secure note-taking web application featuring OTP & Google OAuth, a RESTful API, and a responsive React frontend.</p>

  <a href="https://github.com/rishabh-sikarwar/Note-Taking/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/rishabh-sikarwar/Note-Taking?style=for-the-badge" alt="license"/>
  </a>
  <a href="https://github.com/rishabh-sikarwar/Note-Taking/commits/main">
    <img src="https://img.shields.io/github/last-commit/rishabh-sikarwar/Note-Taking?style=for-the-badge" alt="last commit"/>
  </a>
  <img src="https://img.shields.io/github/repo-size/rishabh-sikarwar/Note-Taking?style=for-the-badge" alt="repo size"/>
  <img src="https://img.shields.io/github/languages/top/rishabh-sikarwar/Note-Taking?style=for-the-badge" alt="primary language"/>

</div>

---

## 🚀 Live Demo

You can test the live application here:

**[https://note-taking-gilt.vercel.app/](https://note-taking-gilt.vercel.app/)**

<br>

<div align="center">
  <img src="https://raw.githubusercontent.com/rishabh-sikarwar/Note-Taking/main/note-taking-demo.gif" alt="Application Demo GIF" width="80%">
</div>

---

## ✨ Features

-   **🔐 Secure Authentication**: Passwordless OTP login via email and seamless Google OAuth 2.0.
-   **📑 Session Management**: Uses JWT stored in secure, `httpOnly` cookies.
-   **✍️ Full CRUD for Notes**: Authenticated users can create, view, and delete their personal notes.
-   **🛡️ Protected Routes**: User dashboard and notes API are accessible only to logged-in users.
-   **📱 Responsive Design**: Clean, mobile-first UI that works beautifully on all screen sizes.

---

## 🛠️ Tech Stack

This project is built with a modern, type-safe, full-stack architecture.

| Category         | Technologies                                                                                                                                                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend** | ![React](https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) |
| **Backend** | ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/-Express.js-000000?style=for-the-badge&logo=express&logoColor=white)                                                          |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)                                                           |
| **Deployment** | ![Vercel](https://img.shields.io/badge/-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) ![Render](https://img.shields.io/badge/-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)                                                                     |

---

## 🔧 Getting Started

Follow these instructions to get the project running locally.

### Prerequisites

-   Node.js (v18+)
-   npm & Git
-   [PostgreSQL](https://neon.tech/) Database URL
-   [Google Cloud](https://console.cloud.google.com/) OAuth Credentials
-   [Brevo](https://www.brevo.com/) (or other) SMTP Credentials

### 1. Clone the Repository

```bash
git clone [https://github.com/rishabh-sikarwar/Note-Taking.git](https://github.com/rishabh-sikarwar/Note-Taking.git)
cd Note-Taking
```
2. Backend Setup
```bash

# Navigate to the server directory
cd server

# Install dependencies
npm install

# Set up your environment variables (see below)
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start the server
npm run dev
```


3. Frontend Setup
```Bash

# In a new terminal, navigate to the client directory
cd client

# Install dependencies
npm install

# Set up your environment variables (see below)
# Create a .env.local file

# Start the client
npm run dev

```

🔒 Environment Variables
This project requires environment variables to run.

<details>
<summary><strong>Click to view Backend <code>server/.env</code> variables</strong></summary>

```
Ini, TOML

# PostgreSQL Database Connection String (from Neon)
DATABASE_URL="postgresql://..."

# A long, random, secret string for signing JWTs
JWT_SECRET="YOUR_SUPER_SECRET_RANDOM_STRING_GOES_HERE"

# Brevo (or other SMTP provider) Credentials
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER="your-smtp-login@example.com"
SMTP_PASS="your-smtp-master-password"

# Google OAuth Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"

# Frontend URL for CORS and redirects
FRONTEND_URL="http://localhost:5173"

#Backend URL for Google auth redirection
BACKEND_URL =https://note-taking-api-rishabh.onrender.com
```

</details>

<details>
<summary><strong>Click to view Frontend <code>client/.env.local</code> variables</strong></summary>

```
Ini, TOML

# URL for the local backend API
VITE_API_URL="http://localhost:8000/api"
```

</details>

🚀 Deployment
The Frontend (client directory) is deployed on Vercel.

The Backend (server directory) is deployed on Render as a Web Service.

Environment variables for deployed versions are set directly in the Vercel and Render dashboards.


<div align="center">
<p>Built with ❤️ by Rishabh Sikarwar</p>
</div>
