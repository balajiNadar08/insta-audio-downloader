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

## 📌 About the Project

**InstaAud** is a web-based tool designed to make extracting audio from Instagram Reels straightforward.

Instead of navigating complicated software or manually processing video files, users can paste a supported Reel URL into the application and use its audio extraction workflow.

## 🛠️ Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,typescript,tailwind,nodejs" alt="Technology stack" />
</p>

| Technology | Purpose |
|---|---|
| Next.js | Frontend and API routes |
| React | User interface |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling and responsive layouts |
| Node.js | JavaScript runtime |
| FFmpeg | Audio extraction and media processing, where supported |
| Vercel | Frontend and Next.js deployment |

## ⚙️ Getting Started

Follow these instructions to run InstaAud locally.

### Prerequisites

Install the following tools:

- [Node.js](https://nodejs.org/)
- npm
- Git

If your backend uses FFmpeg locally, install FFmpeg and ensure it is accessible to that backend.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/InstaAud.git
```

### 2. Navigate to the Project

```bash
cd InstaAud
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the following address in your browser:

```text
http://localhost:3000
```

You should now be able to access the locally running InstaAud application.

## 📂 Project Structure

A typical Next.js App Router implementation might look like this:

```text
InstaAud/
├── app/
│   ├── api/
│   │   └── extract-audio/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
├── lib/
├── public/
├── .env.local
├── .gitignore
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 📄 License

This project is distributed under the MIT License if the repository includes an applicable MIT license.

If you choose the MIT License, add a `LICENSE` file containing its full text and ensure that the license accurately reflects your intentions.

## Author

**Balaji Nadar**

- GitHub: [@balajinadar08](https://github.com/balajinadar08)

---
