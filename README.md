# TriSutra Ayurveda — Ancient Wisdom, Modern Wellness

![TriSutra Ayurveda](./src/assets/trisutra-logo.png)

Welcome to the TriSutra Ayurveda Web Application repository! This app provides an e-commerce platform dedicated to authentic Swarnprashan and traditional Ayurvedic wellness products for children's immunity, growth, and overall health.

## Overview
This platform is built using modern web development standards featuring a functional e-commerce flow with local storage persistence and dynamic visual UI components.

### Core Features
- 🛒 **E-Commerce Flow:** Fully functional global cart that persists between sessions using `CartContext`.
- 🏷 **Dynamic Catalog:** Product showcase using dynamic item mapping and sleek framer-motion animations.
- 💳 **Checkout:** Multi-step form checkout resulting in an active order invoice.
- 📄 **Invoice Generation:** Automatic client-side PDF invoice generation utilizing `jspdf` and `html2canvas`.
- 👤 **Account Dashboard:** User profile metrics and dynamically updating mock order history.
- 🎨 **Premium Styling:** Built using Tailwind CSS, Radix UI primitives, and custom styling patterns.

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
Ensure you have run `npm install` inside the root tree of this repository.

### Running Locally

1. Install dependencies
```sh
npm install
```

2. Start the development server
```sh
npm run dev
```

3. Build for Production
```sh
npm run build
```

4. View Production Build
```sh
npm run preview
```

## Tech Stack
- Frontend Framework: React (Vite)
- Language: TypeScript
- State Management: React Context API 
- Styling: Tailwind CSS & Radix UI Primitives (shadcn/ui)
- Animations: Framer Motion
- Icons: Lucide React
- Routing: React Router DOM
- Data Fetching/Caching: React Query (@tanstack/react-query)
- PDF Engine: html2canvas & jspdf
