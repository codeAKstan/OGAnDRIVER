# OGA Driver Platform

🚗 **A comprehensive tricycle (Keke) hire and purchase platform for Nigeria**

OGA Driver is a modern web platform that connects tricycle drivers, vehicle owners, and investors in Nigeria's transportation ecosystem. Whether you're looking to hire a tricycle for daily operations, purchase one for your fleet, or invest in the growing transportation sector, OGA Driver provides the tools and services you need.

## 🌟 Features

### For Drivers
- **Hire Purchase**: Own a tricycle through flexible payment plans

- **Mobile App**: Dedicated driver app for operations (coming soon)

### For Vehicle Owners (Ogas)
- **Fleet Management**: Manage multiple tricycles efficiently
- **Investment Tracking**: Monitor returns on vehicle investments
- **Driver Matching**: Connect with verified drivers
- **Maintenance Support**: Scheduled maintenance and support services



## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + Custom Components
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Animations**: Tailwind CSS + Custom CSS animations
- **Charts**: [Recharts](https://recharts.org/)

## 📁 Project Structure
oga-driver-platform/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── hire-rent/         # Vehicle hire/rent page
│   ├── login/             # Login page
│   ├── signup/            # Registration page
│   ├── testimonials/      # Customer testimonials
│   ├── layout.tsx         # Root layout
│   └── page.js           # Homepage
├── components/            # Reusable components
│   ├── ui/               # UI component library
│   ├── Header.js         # Navigation header
│   ├── Footer.js         # Site footer
│   ├── Hero.js           # Hero section
│   └── ...               # Other components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
│   ├── images/           # Image assets
│   └── ...               # Other static files
├── styles/               # Global styles
└── ...