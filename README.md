# 🍬 Sweet Shop Inventory Management System

A full-stack **Sweet Shop Management System** built as part of an **AI Kata / TDD Assignment**. This project demonstrates backend API development, frontend integration, secure authentication, role-based access, and adherence to modern development practices, including the transparent use of AI tools.

---

## 🚀 Features

### 👤 Authentication
* User registration and login
* JWT-based authentication
* Role-based access (Admin vs Standard User)

### 🍭 Sweets Management
* View all available sweets
* Search sweets by name, category, or price
* Purchase sweets (quantity decreases)
* **Quantity never shown to standard users**

### 🔐 Admin-Only Features
* Add new sweets
* Edit sweet details
* Delete sweets
* Restock inventory

### 🎨 Frontend UI
* Built with **React + Vite**
* Responsive dark theme
* Clean product listing layout
* Separate admin and user experiences

---

## 🛠 Tech Stack

### Backend
* Python
* Django
* Django REST Framework
* SimpleJWT
* SQLite (Development)
* django-cors-headers

### Frontend
* React
* Vite
* JavaScript
* Fetch API
* JWT Decode

---

## 📂 Project Structure

```text
sweet-shop-management/
├── backend/
│   ├── api/
│   ├── sweetshop/
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Sweets.jsx
│   │   ├── AddSweetForm.jsx
│   │   └── api.js
│   └── package.json
├── images/
│   ├── login.png
│   ├── register.png
│   ├── userdisplay.png
│   ├── userdisplay2.png
│   ├── search.png
│   └── adminpanel.png
└── README.md

---

## ⚙️ Setup & Run Instructions

### ✅ Prerequisites
* Python 3.10+
* Node.js 18+
* npm
* Git

### 1. Backend Setup (Django)

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    venv\Scripts\activate  # Windows (Adjust for Linux/Mac: source venv/bin/activate)
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Run migrations:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
5.  **Create a Superuser (Admin):**
    ```bash
    python manage.py createsuperuser
    ```
6.  **Run the Django server:**
    ```bash
    python manage.py runserver
    ```
    *Backend runs at: `http://127.0.0.1:8000/`*

### 2. Frontend Setup (React + Vite)

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the React application:**
    ```bash
    npm run dev
    ```
    *Frontend runs at: `http://localhost:5173/`*

### 🔐 Admin Access
Log in using the superuser credentials created in Step 1. Admin users can add, edit, delete, and restock sweets. Normal users can browse, search, and purchase sweets.

---

## 🤖 My AI Usage (Mandatory Section)

In line with the AI Usage Policy for this kata, I leveraged **Gemini** throughout the development process. This enhanced efficiency and helped ensure the final solution was robust and secure.

| AI Tool Used | How I Used It | Reflection on Impact |
| :--- | :--- | :--- |
| **Gemini** | **Debugging Complex Backend Issues:** Provided critical insights to debug persistent framework problems, specifically the `400 Bad Request` on the custom `/purchase/` endpoint. The solution involved correctly adjusting both frontend headers and backend action definitions. | Served as an indispensable debugging partner and technical guide, accelerating the resolution of subtle configuration issues that often consume significant development time. |
| **Gemini** | **Implementing Standardized Search:** Guided the process of replacing custom, complex `Q` object search logic with the robust, standard Django REST Framework's `SearchFilter`. | Ensured the final search implementation was professionally compliant with DRF best practices, improving performance and maintainability. |
| **Gemini** | **Reviewing Authentication Flow:** Confirmed the necessary data (`is_admin: true`) was being correctly returned by the `LoginView` to the frontend, resolving a critical role-assignment error upon user login. | Improved security and role-separation integrity by verifying the data transmitted during the authentication process. |

### AI Co-authorship in Commits
As required by the assignment guidelines, I have included a co-author trailer in the commit message for every change where AI assistance was directly used for code generation, complex debugging, or architectural guidance.

---

## 🖼️ Screenshots

| Description | Image |
| :--- | :--- |
| Login Screen | ! |
| Registration Screen | ! |
| User Dashboard (Sweets List) | ! |
| User Dashboard (Search/Filter) | ! |
| Admin Panel/Controls | ! |