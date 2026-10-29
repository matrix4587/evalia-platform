# 🧠 Evalia - AI Trainer Platform

Evalia is a modern, full-stack platform designed for AI training and evaluation. It connects AI trainers (workers) with paid tasks, gated by rigorous skill assessments. The platform ensures high-quality data annotation and AI evaluation through capability tracking, time-based payouts, and sequential assessments.

## 🚀 Features

- **Skill-Gated Tasks:** Workers must pass specific assessments (80%+ score) to unlock premium tasks.
- **Sequential Assessments:** Multi-section tests where passing one section unlocks the next.
- **Time-Based Earnings:** Accurate payment calculation based on actual time spent on a task.
- **Dynamic Dashboards:** Real-time wallet balances, transaction histories, and capability tracking.
- **Responsive Design:** Fully optimized for mobile and desktop with a sliding mobile sidebar.
- **Secure Authentication:** Powered by NextAuth.js with role-based access (Workers, Clients, Admins).
- **Modern UI:** Built with Tailwind CSS, Shadcn UI, and Lucide Icons for a premium user experience.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (Hosted on [Neon](https://neon.tech/))
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [NextAuth.js v5](https://authjs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Package Manager:** [pnpm](https://pnpm.io/)
- **Language:** TypeScript

## 📦 Getting Started

### Prerequisites
Make sure you have the following installed:
- Node.js (v20 or higher)
- pnpm (`npm install -g pnpm`)
- PostgreSQL (or a free Neon database account)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/matrix4587/evalia-platform.git
   cd evalia-platform



Install dependencies:

bash
pnpm install
Set up environment variables:
Create a .env file in the root directory and add the following:

env
DATABASE_URL="postgresql://user:password@localhost:5432/evalia?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/evalia?schema=public"
AUTH_SECRET="your_generated_random_secret"
AUTH_URL="http://localhost:3000"
Push the database schema:

bash
pnpm prisma db push
Seed the database (optional):

bash
pnpm dlx tsx prisma/seed-linked-system.ts
pnpm dlx tsx prisma/seed-ai-evaluation.ts
Run the development server:

bash
pnpm dev
Open http://localhost:3000 in your browser to see the app.

📁 Project Structure
text
src/
├── app/
│   ├── (auth)/          # Login, Register, Verify Email
│   ├── (worker)/        # Dashboard, Assessments, Earnings, Tasks
│   ├── api/             # Backend API routes
│   └── page.tsx         # Marketing Landing Page
├── components/          # Reusable UI components (Shadcn)
├── lib/                 # Utility functions, Prisma client
└── server/              # Business logic & services
🛡️ License
This project is for educational and portfolio purposes. All rights reserved.

text

### Step 2: Push it to GitHub
Once you save the file, open your terminal (Git Bash or PowerShell) and run these three commands to push it to GitHub:

```bash
git add README.md
git commit -m "docs: add professional README"
git push
