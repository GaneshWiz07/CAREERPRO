# 🚀 CareerPro - AI-Powered Resume Builder

![CareerPro Banner](public/placeholder.svg)

**CareerPro** is an intelligent, full-stack resume building application designed to help job seekers pass Applicant Tracking Systems (ATS) and land more interviews. By leveraging the power of **Groq AI (Llama 3)**, it offers real-time analysis, content enhancement, and personalized tailoring for every job application.

---

## ✨ Key Features

### 🧠 AI-Powered Core
- **Resume Parsing**: Instantly extract details from existing PDF or Word resumes using AI-driven text recognition.
- **ATS Analysis**: Get a comprehensive **0-100 score** based on keyword matching, skills alignment, and formatting.
- **Smart Enhancement**: Rewrite bullet points and professional summaries with a single click to be more impact-driven and quantitative.

### 🎯 Job Targeting
- **Role Tailoring**: Customize your resume for specific job descriptions to maximize relevance.
- **Interview Prep**: Generate trusted interview questions based on your specific profile and the target role.
- **Salary Insights**: Get data-driven salary estimates tailored to your experience, location, and skills.

### 🛠️ Professional Tools
- **Drag-and-Drop Editor**: Intuitive UI tailored with **Shadcn UI** components.
- **PDF Export**: Download polished, ATS-friendly PDF resumes ready for submission.
- **Secure Backend**: All sensitive AI operations run on secure **Netlify Serverless Functions**.

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)

### Backend & Infrastructure
- **Serverless**: [Netlify Functions](https://www.netlify.com/products/functions/) (Node.js)
- **AI Model**: [Groq API](https://groq.com/) (Llama-3-70b-versatile)
- **Deployment**: Netlify

---

## 🚀 Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Free [Groq API Key](https://console.groq.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/careerpro.git
   cd careerpro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory and add your API credentials:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Run Locally**
   Start the development server with Netlify Dev (this ensures the backend functions run correctly with the frontend):
   ```bash
   netlify dev
   ```
   *The app should now be running at `http://localhost:8080`.*

---

## 📁 Project Structure

```bash
📦 src
 ┣ 📂 components  # Reusable UI components (Shadcn + Custom)
 ┣ 📂 pages       # Main application routes (Dashboard, Builder, Analysis)
 ┣ 📂 lib         # Utilities, API helpers, and Resume Parser logic
 ┣ 📂 types       # TypeScript interfaces for Resume data
 ┗ 📄 App.tsx     # Main application entry point

📦 netlify/functions
 ┣ 📄 analyze-ats.ts                 # Resume scoring & analysis
 ┣ 📄 parse-resume.ts                # PDF/Docx text extraction & parsing
 ┣ 📄 tailor-resume.ts               # Job-specific customization
 ┣ 📄 enhance-summary.ts             # AI writing assistant
 ┗ 📄 generate-interview-questions.ts # Interview prep generator
```

---

## 🚢 Deployment

This project is pre-configured for seamless deployment on **Netlify**.

1. **Push to GitHub**: Commit your changes and push to a new repository.
2. **Connect to Netlify**:
   - Go to [Netlify Dashboard](https://app.netlify.com/).
   - Click **"Add new site"** > **"Import an existing project"**.
   - Select your GitHub repository.
3. **Configure Environment Variables**:
   - In Netlify Site Settings, go to **Environment Variables**.
   - Add `GROQ_API_KEY` with your production key.
4. **Deploy**: Netlify will automatically build and deploy your site.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
