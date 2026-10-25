<div align="center">

# InstaAud

### Extract audio from Instagram Reels with ease.

A simple, modern web application designed to help users extract audio from Instagram Reels and download it for personal use.

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

<p>
  <img src="https://img.shields.io/badge/Status-In_Development-orange?style=flat-square" alt="Project Status" />
  <img src="https://img.shields.io/badge/Platform-Web-blue?style=flat-square" alt="Platform" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

</div>

---

## About the Project

**InstaAud** is a web-based tool designed to make extracting audio from Instagram Reels straightforward, it uses instagrapi for media extraction.

Instead of navigating complicated software or manually processing video files, users can paste a supported Reel URL into the application and use its audio extraction workflow.

## Tech Stack

<p align="center">
   <img src="https://skillicons.dev/icons?i=nextjs,react,typescript,tailwind,python,fastapi,ffmpeg,vercel,render&perline=5" alt="InstaAud Tech Stack" />
</p>

| Technology | Purpose |
|---|---|
| Next.js | Frontend and API routes |
| React | User interface |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling and responsive layouts |
| Python | Backend logic and audio processing |
| FastAPI | Building REST APIs and handling audio extraction requests |
| FFmpeg | Audio extraction and media processing, where supported |
| Vercel | Frontend and Next.js deployment |
| Render | Backend deployment |

## ⚙️ Getting Started

Follow these instructions to run InstaAud locally.

### Prerequisites

Install the following tools:

- [Node.js](https://nodejs.org/)
- npm
- Git

If your backend uses FFmpeg locally, install FFmpeg and ensure it is accessible to that backend.

## Getting Started

Follow these steps to run InstaAud locally.

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Python](https://www.python.org/)
- Git
- pip (Python package manager)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/InstaAud.git
cd InstaAud
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Set Up the Python Backend

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Python Dependencies

Install the packages listed in `requirements.txt`:

```bash
pip install -r requirements.txt
```

Install `instagrapi`:

```bash
pip install instagrapi
```

### 5. Start the FastAPI Backend

```bash
uvicorn main:app --reload
```

The backend should now be available at:

```text
http://127.0.0.1:8000
```

If your FastAPI application exposes interactive API documentation, access it at:

```text
http://127.0.0.1:8000/docs
```

### 6. Start the Next.js Frontend

Open a **new terminal** and navigate to the project root:

```bash
cd InstaAud
npm run dev
```

Open InstaAud in your browser:

```text
http://localhost:3000
```

**Important:** Keep both the FastAPI backend and Next.js frontend running in separate terminals for the application to work correctly.

Open the following address in your browser:

```text
http://localhost:3000
```

You should now be able to access the locally running InstaAud application.

## Project Structure

A typical Next.js App Router implementation might look like this:

```text
InstaAud/
├── app/
│   ├── api/
│   │   └── extract-audio/
│   │       └── route.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── backend/
│   ├── main.py
│   └── requirements.txt
├── public/
├── .gitignore
├── README.md
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── tailwind.config.ts
└── tsconfig.json
```

## License

This project is distributed under the MIT License if the repository includes an applicable MIT license.

## Author

**Balaji Nadar**

- GitHub: [@balajinadar08](https://github.com/balajinadar08)

---
