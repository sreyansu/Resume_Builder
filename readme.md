# Resume Builder

A modern, feature-rich resume builder application built with React, TypeScript, and Node.js. Create, customize, and download professional resumes with ease.

![Resume Builder Demo](https://resumebuilder.sreyansu.space/)

## ✨ Features

- 📝 Create and customize professional resumes
- 🎨 Clean, modern, and responsive design
- 🤖 AI-powered suggestions for content improvement
- 📄 Multiple sections (Personal Info, Education, Experience, Skills, Projects, Certifications)
- 💾 Save and manage multiple resumes
- 📥 Export to PDF with one click
- 🔄 Real-time preview
- 🔒 Secure data storage with MongoDB

## 🚀 Tech Stack

- **Frontend**:
  - React 18
  - TypeScript
  - Tailwind CSS
  - Vite
  - React Icons
  - html2canvas & jsPDF (for PDF export)

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (with Mongoose)
  - OpenAI API (for AI suggestions)

## 🛠️ Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance
- OpenAI API key (for AI features)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/sreyansu/Resume_Builder.git
   cd Resume_Builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd src
   npm install
   cd ..
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Start the development server**
   ```bash
   # Start both frontend and backend
   npm run dev
   ```
   This will start:
   - Frontend on http://localhost:5173
   - Backend on http://localhost:4000

## 🏗️ Project Structure

```
resume-builder/
├── src/
│   ├── components/       # React components
│   │   ├── AISuggestionModal.tsx
│   │   ├── CertificationsForm.tsx
│   │   ├── EducationForm.tsx
│   │   ├── ExperienceForm.tsx
│   │   ├── PersonalInfoForm.tsx
│   │   ├── ProjectsForm.tsx
│   │   ├── ResumePreview.tsx
│   │   └── SkillsForm.tsx
│   ├── types/
│   │   └── resume.ts     # TypeScript type definitions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server.js            # Express server
├── package.json
└── README.md
```

## 📚 Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run server:dev` - Start backend with nodemon for development
- `npm run client` - Start only the frontend development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [OpenAI](https://openai.com/)

---

Made with ❤️ by [Sreyansu](https://github.com/sreyansu)
