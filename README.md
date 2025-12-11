# 🩸 BloodLinkBD

**BloodLinkBD** is a modern, responsive web application designed to bridge the gap between blood donors and recipients. Built with the latest web technologies, it aims to streamline the process of finding and requesting blood donations in emergency situations.

## 🔗 Live Demo

**[Click here to view the Live Site](https://blood-link-bd-ochre.vercel.app/)**

## Purpose

The primary goal of BloodLinkBD is to create a centralized, user-friendly platform that:

- Simplifies the process of finding blood donors based on blood group and location.
- Allows users to post emergency blood donation requests.
- Provides a seamless dashboard for donors and patients to manage their activities.
- Visualizes donation data to encourage community participation.

## Key Features

- **User Authentication:** Secure login and registration for donors and recipients by JWT and bcrypt.js.
- **Donation Requests:** Create, edit, and manage blood donation requests with real-time status updates (Pending, In Progress, Completed).
- **Interactive Dashboard:** Data visualization using charts to track donation statistics.
- **Search & Filter:** Advanced filtering to find specific blood groups and locations.
- **Responsive Design:** Fully mobile-optimized interface using Tailwind CSS v4.
- **Real-time Feedback:** Instant sweetalert2 notifications and alerts for user actions.

## Tech Stack & NPM Packages

This project utilizes a cutting-edge stack featuring **Next.js 16**, **React 19**, and **Tailwind CSS v4**.

### Core Framework

- **[Next.js](https://nextjs.org/)** (v16) - The React Framework for the Web.
- **[React](https://react.dev/)** (v19) - The library for web and native user interfaces.

### UI & Styling

- **[Tailwind CSS](https://tailwindcss.com/)** (v4) - A utility-first CSS framework.
- **[Shadcn UI](https://ui.shadcn.com/)** - Unstyled, accessible components for building high-quality design systems.
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animation library for React.
- **[Lucide React](https://lucide.dev/)** & **[Tabler Icons](https://tabler.io/icons)** - Beautiful and consistent icons.

### Forms & Validation

- **[React Hook Form](https://react-hook-form.com/)** - Performant, flexible and extensible forms.

### Data Visualization & Utilities

- **[Recharts](https://recharts.org/)** - Redefined chart library built with React and D3.
- **[Axios](https://axios-http.com/)** - Promise based HTTP client for the browser and node.js.
- **[@dnd-kit](https://dndkit.com/)** - Lightweight, performant, accessible and extensible drag and drop toolkit.

### UI Feedback

- **[Sonner](https://sonner.emilkowal.ski/)** - An opinionated toast component for React.
- **[SweetAlert2](https://sweetalert2.github.io/)** - A beautiful, responsive, customizable replacement for JavaScript's popup boxes.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/bloodlinkbd.git
    cd bloodlinkbd
    ```

2.  **Install dependencies:**

    ```bash
    npm install

    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

4.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Runs the built production server.
- `npm run lint`: Runs ESLint to check for code quality issues.

---

Made with ❤️ by [Abubakar Siddik Zisan]
