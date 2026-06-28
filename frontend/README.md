# BuildMate

BuildMate is a modern collaboration platform for builders, developers, and creators to showcase projects, find teammates, apply to roles, and ship real products together.

This repository contains the React-based frontend client.

## Key Features

- **Instant Project Match**: Discover open projects and opportunities through a dynamic swipe-style interface.
- **Builder Dashboard**: View project stats, applications, incoming requests, and Activity/Reliability score rings.
- **Public Builder Profiles**: Showcase bio, skills, projects, contact links, and availability in a responsive profile layout.
- **Incoming Applications Portal**: Help project owners review applicants and manage role-based applications.
- **Skills System**: Browse predefined developer/designer skills, search skills, and attach them to profiles, projects, and opportunities.
- **Project Resources**: Add useful links such as GitHub, demos, Figma, Notion, and presentations to project pages.

## Tech Stack

- **Core**: React 19, Hooks, Context
- **Build Tooling**: Vite
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios with auth token interceptors
- **Styling**: Custom CSS with a warm terracotta and sand design system
- **Icons**: Centralized SVG icon registry
- **Deployment**: Vercel frontend, Render backend

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```
