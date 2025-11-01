# 🧠 QueryIQ – AI Chat Assistant

QueryIQ is an **AI-powered SQL assistant** that translates natural language queries into SQL, executes them securely, and visualizes the results — helping you discover insights from your **customer data** effortlessly.


---

## 🚀 Overview

QueryIQ lets users **chat naturally** with their databases.  
You can ask questions like:

> “Show me all male customers from Mumbai.”  
> “List top 10 customers by purchase frequency.”  
> “Find customers registered in the last 30 days.”

The app automatically:
1. Converts your query to **SQL** using an AI model.
2. Executes it safely on the backend.
3. Returns and displays the results in a **formatted table**.
4. Logs all queries in the **Query Logs** section for future review.

---

## 🧩 Tech Stack

| Layer            | Technology                                        |
|------------------|---------------------------------------------------|
| **Frontend**     | React (Vite + TypeScript + JavaScript)            |
| **UI Framework** | ShadCN UI + Tailwind CSS                          |
| **Backend**      | FastAPI (Python)                                  |
| **Database**     | PostgresSQL / SQLite                              |
| **ORM**          | SQLAlchemy                                        |
| **AI Model**     | GROK / LLM for Natural Language → SQL Translation |

---

## 🗂️ Key Features

### 💬 Chat Interface
- Natural language interaction with your dataset.
- Instant response from AI.
- Clean, modern chat UI with automatic scrolling.

### 🧾 Query Logs Page
- View all previous queries, their generated SQL, timestamps, and execution status.
- Search or filter through past logs.
- Built using ShadCN `Card`, `Table`, and `Input` components.

### 🧱 Secure SQL Execution
- AI-generated SQL is **validated** before execution:
  - Only `SELECT` statements allowed.
  - Blocked commands: `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, etc.
  - Query scope restricted to the `customers` table.

### ⚙️ Modular Backend
- `chat` router handles AI queries and responses.
- `query_logs` router manages history.
- Environment variable–based `APP_TOKEN` for API auth.
- CORS enabled for React frontend.

---

## 🧑‍💻 Local Setup Guide

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/DMMPrice/LLM-Chatbot-Frontend.git
cd LLM-Chatbot-Frontend
```

### **4️⃣ Install Dependencies**
```bash
npm i 
```

### **4️⃣ Start Frontend**
```bash
npm run dev
```

---

## 🧠 Example Queries

| Natural Query                  | Generated SQL                                                |
|--------------------------------|--------------------------------------------------------------|
| Show all female customers      | `SELECT * FROM customers WHERE LOWER(gender) = 'female'`     |
| List customer names from Delhi | `SELECT name FROM customers WHERE LOWER(location) = 'delhi'` |
| Show total customers           | `SELECT COUNT(*) FROM customers`                             |

---

## 📊 Interface Snapshots

### 💬 Chat Interface
> AI-powered assistant ready to interpret user queries and generate SQL automatically.
![Chat Screenshot](./Screenshot%202025-11-01%20230200.png)

### 📜 Query Logs
> Shows your full query history with timestamps, SQL commands, and success status.
![Logs Screenshot](./Screenshot%202025-11-01%20230225.png)

---

## 🛡️ Security & Validation

- ✅ Token-based request authentication (`x-token` header)
- ✅ SQL injection prevention (`SELECT`-only restriction)
- ✅ CORS allowed for trusted origins only
- ✅ Input sanitization before execution

---