# 🏨 Hotel Bot Menu API

A serverless backend API and admin interface that powers a hotel chatbot menu system. Built with vanilla JavaScript and deployed on Vercel, this project enables hotels to serve dynamic menu/service data to chatbot platforms through clean API endpoints, while providing an admin panel for managing content.

---

## 🚀 Live Demo

🔗 **[hotel-bot-menu-api.vercel.app](https://hotel-bot-menu-api.vercel.app)**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Admin Panel](#admin-panel)
- [Bot Workflow](#bot-workflow)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 📖 Overview

**Hotel Bot Menu API** is designed to serve as the data layer for a hotel chatbot experience. It exposes structured API endpoints that a bot platform (such as WhatsApp, Telegram, or a custom bot builder) can call to retrieve hotel menus, services, or other dynamic content. An admin interface allows hotel staff to manage the content without touching code.

The project also includes exportable bot workflow configurations (`Hotel Bot - Flow.json` and `Review Sender Workflow.json`) that can be imported directly into popular no-code bot builders to set up the full conversation flow.

---

## ✨ Features

- **Serverless API endpoints** — lightweight, scalable functions deployed on Vercel
- **Admin panel** — HTML/CSS/JS-based admin interface for content management
- **Bot workflow exports** — ready-to-import JSON flows for chatbot platforms
- **Review sender workflow** — automated workflow for collecting and sending customer reviews
- **Custom fonts** — branded typography support
- **Zero-config deployment** — one-click deploy via Vercel

---

## 📁 Project Structure

```
hotel-bot-menu-api/
├── admin/                          # Admin panel for managing hotel menu/content
│   ├── index.html                  # Admin dashboard UI
│   ├── style.css                   # Admin panel styles
│   └── script.js                   # Admin panel logic
│
├── api/                            # Vercel serverless API functions
│   └── *.js                        # Individual API route handlers
│
├── fonts/                          # Custom font assets
│
├── Hotel Bot - Flow.json           # Importable chatbot flow for the hotel menu bot
├── Review Sender Workflow.json     # Importable workflow for review collection
│
├── vervel.json                     # Vercel deployment configuration
├── package.json                    # Node.js dependencies and scripts
├── package-lock.json               # Locked dependency versions
└── .gitignore                      # Files excluded from version control
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js (Vercel Serverless Functions) |
| **Language** | JavaScript (Vanilla JS) |
| **Frontend** | HTML5, CSS3 |
| **Deployment** | Vercel |
| **Bot Integration** | JSON workflow exports (platform-agnostic) |

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [Vercel CLI](https://vercel.com/cli) (optional, for local development)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/vamsi11126/hotel-bot-menu-api.git
   cd hotel-bot-menu-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run locally with Vercel CLI**

   ```bash
   npx vercel dev
   ```

   The API will be available at `http://localhost:3000`

4. **Or run a simple local server for the admin panel**

   ```bash
   npx serve .
   ```

---

## 📡 API Reference

All API routes live under the `/api` directory and are automatically mapped to serverless functions by Vercel.

### Base URL

```
https://hotel-bot-menu-api.vercel.app/api
```

### Example Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/menu` | Fetch the full hotel menu |
| `GET` | `/api/menu/:category` | Fetch menu items by category |
| `POST` | `/api/review` | Submit a customer review |

> **Note:** Check the `/api` folder for the full and up-to-date list of available routes and their request/response schemas.

### Sample Response

```json
{
  "status": "success",
  "data": {
    "category": "Breakfast",
    "items": [
      { "id": 1, "name": "Continental Breakfast", "price": 12.99 },
      { "id": 2, "name": "Full English", "price": 15.99 }
    ]
  }
}
```

---

## 🖥️ Admin Panel

The `/admin` directory contains a browser-based admin interface. Access it at:

```
https://hotel-bot-menu-api.vercel.app/admin
```

The admin panel allows hotel staff to:

- View and manage menu categories and items
- Update pricing and availability
- Preview how data will appear in the bot

---

## 🤖 Bot Workflow

This project ships with two ready-to-use bot workflow configuration files.

### `Hotel Bot - Flow.json`

The main conversation flow for the hotel menu chatbot. Import this file into your preferred bot builder platform (e.g., [Botpress](https://botpress.com/), [ManyChat](https://manychat.com/), [Landbot](https://landbot.io/)) to get the full hotel menu bot up and running instantly.

**Flow highlights:**
- Welcome message and menu navigation
- Category-based menu browsing
- Item detail and ordering flow
- Handoff to hotel staff for special requests

### `Review Sender Workflow.json`

An automated workflow that prompts guests to leave a review after their stay and handles sending that review data to the API.

**Flow highlights:**
- Post-stay review prompt
- Star rating collection
- Written feedback submission
- Thank-you message

#### How to Import

1. Open your bot builder platform
2. Navigate to **Import / Export** or **Flows**
3. Upload the relevant `.json` file
4. Update the API base URL in the workflow to point to your deployed instance

---

## 🌐 Deployment

This project is configured for one-click deployment on Vercel.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vamsi11126/hotel-bot-menu-api)

### Manual Deployment

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**

   ```bash
   vercel --prod
   ```

The `vervel.json` file at the project root configures routing, builds, and serverless function settings for Vercel.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a new branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

Please make sure your changes don't break existing API endpoints and follow the existing code style.

---

## 📄 License

This project is open source. See the repository for license details.

---

## 👤 Author

**Vamsi** — [@vamsi11126](https://github.com/vamsi11126)

---

*Built with ❤️ and deployed on [Vercel](https://vercel.com)*
