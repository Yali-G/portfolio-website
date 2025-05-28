# 🌐 Personal Portfolio Website

Website can be found at: [yaligoldstein.com](https://yaligoldstein.com)

This is my personal portfolio website built to showcase my work, projects, and background. It's built with modern web technologies for performance, responsiveness, and scalability.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Hosting**: [AWS S3 Bucket](https://aws.amazon.com/s3/)
- **CI/CD**: [GitHub Actions](https://github.com/features/actions)

## 🛠️ Features

- Fully responsive and fast-loading UI
- Clean, modern design with Tailwind CSS
- Continuous deployment pipeline using GitHub Actions
- Hosted on a secure and scalable AWS S3 bucket
- Easily customizable structure for future enhancements

## 🚚 Deployment Workflow

1. Code is pushed to the `main` branch on GitHub.
2. GitHub Actions runs automated build and deployment steps.
3. The built site is deployed directly to an AWS S3 bucket for public access.

## 📁 Project Structure

.
├── components/ # Reusable UI components
├── pages/ # Route-based pages
├── public/ # Static assets
├── styles/ # Tailwind and custom CSS
├── .github/workflows/ # GitHub Actions CI/CD config
├── README.md
└── ...


## 📦 Getting Started

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build


