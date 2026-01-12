# 🧠 Problem Battles

**Problem Battles** is a full-stack, microservice-based coding platform inspired by competitive programming and problem-solving platforms.  
It allows users to authenticate, solve coding problems, submit solutions, and get evaluated in real time.

The project follows a **service-oriented architecture**, making it scalable, maintainable, and suitable for real-world systems.

---

## 🏗️ Tech Stack Overview

| Layer | Technology |
|-----|-----------|
| Frontend | React |
| Authentication Service | Go (Golang) |
| Backend Services | Node.js (Express) |
| Architecture | Microservices |

---

## 📁 Project Structure

```text
/
│
├── AuthService/          # Authentication & authorization service (Golang)
├── ClientUI/             # Frontend client (React)
├── EvaluationService/    # Code execution & evaluation service (Node.js)
├── ProblemService/       # Problem management service (Node.js)
├── SubmissionService/    # Code submission handling service (Node.js)
└── README.md
```

## 🏗️ Arhitecture

<img width="1570" height="818" alt="Screenshot 2026-01-13 000415" src="https://github.com/user-attachments/assets/64de1806-585c-4bab-8c8c-d9693e6584bf" />

## 🔐 AuthService (Golang)

Responsible for **user authentication and session management**.

### Key Responsibilities
- User signup & login
- Secure authentication using **HttpOnly cookies / JWT**
- Session validation
- Authorization middleware for other services

### Tech
- Go (Golang)
- HTTP server
- JWT / Cookies
- MySql

---

## 🖥️ ClientUI (React)

The **user-facing frontend** of Problem Battles.

### Key Responsibilities
- User interface for solving problems
- Authentication flow
- Code editor & submission UI
- Displaying results and evaluation status

### Tech
- React
- API communication with backend services

---

## ⚙️ ProblemService (Node.js)

Manages **coding problems and metadata**.

### Key Responsibilities
- Create, update, and fetch problems
- Store problem descriptions, constraints, and examples
- Serve problem data to ClientUI
- AI based problem explanation with caching capabilities

### Tech
- Node.js
- Express
- MongoDB

---

## 📤 SubmissionService (Node.js)

Handles **user code submissions**.

### Key Responsibilities
- Accept code submissions
- Validate submission payloads
- Forward submissions to EvaluationService
- Track submission status

### Tech
- Node.js
- Express
- Inter-service communication

---

## 🧪 EvaluationService (Node.js)

Responsible for **executing and evaluating submitted code**.

### Key Responsibilities
- Compile and run submitted code
- Execute against test cases
- Return verdicts (Accepted, Wrong Answer, TLE, etc.)
- Ensure sandboxed and secure execution with the help of docker containers

### Tech
- Node.js
- Language runtimes (configurable)
- Secure execution environment

---

## 🔄 High-Level Flow

1. User logs in via **AuthService**
2. ClientUI fetches problems from **ProblemService**
3. User submits code via **SubmissionService**
4. Submission is evaluated by **EvaluationService**
5. Result is returned and displayed in ClientUI

---

## 🚀 Getting Started (High Level)

```bash
# Clone the repository
git clone <repo-url>

# Start services individually (example)
cd AuthService && go run main.go
cd ProblemService && npm install && npm run dev
cd SubmissionService && npm install && npm run dev
cd EvaluationService && npm install && npm run dev
cd ClientUI && npm install && npm start
```

---

## 📌 Future Improvements

- Support for multiple programming languages
- Leaderboards and time based contests
- Plagiarism detection

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit changes with clear messages
4. Open a Pull Request

