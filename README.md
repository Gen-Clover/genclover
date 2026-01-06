# GenClover - Professional IT Services Website

A modern, animated website for GenClover showcasing Data Engineering, Data Science, and Website Development services.

## Features

- 🎨 **Modern Design** - Beautiful, professional UI inspired by modern SaaS websites
- ✨ **Smooth Animations** - Powered by Framer Motion for engaging user experience
- 📱 **Fully Responsive** - Works perfectly on all devices
- 🚀 **Fast Performance** - Built with Vite for lightning-fast development and builds
- 🎯 **Service Showcase** - Dedicated sections for Data Engineering, Data Science, and Web Development
- 💼 **Portfolio Page** - Filterable project showcase with animations
- 📧 **Contact Form** - Easy way for clients to get in touch

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
GenClover/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── ServicesSection.jsx
│   │   ├── StatsSection.jsx
│   │   └── CTA.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Services.jsx
│   │   ├── Portfolio.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── App.jsx          # Main app component with routing
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Pages

- **Home** (`/`) - Hero section, services overview, stats, and CTA
- **Services** (`/services`) - Detailed service descriptions
- **Portfolio** (`/portfolio`) - Filterable project showcase
- **About** (`/about`) - Company story, values, and team
- **Contact** (`/contact`) - Contact form and information

## Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme. The primary color is set to blue (`primary-600`).

### Content

- Update service descriptions in `src/components/ServicesSection.jsx` and `src/pages/Services.jsx`
- Add/remove projects in `src/pages/Portfolio.jsx`
- Modify team members in `src/pages/About.jsx`
- Update contact information in `src/pages/Contact.jsx`

### Images

Replace placeholder images (currently using Unsplash) with your own project images and team photos.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2024 GenClover. All rights reserved.

# genclover
