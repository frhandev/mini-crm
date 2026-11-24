# Mini CRM

A full-stack Customer Relationship Management (CRM) application developed as part of a 20-working-day Full-Stack Software Development Internship.

## Project Overview

Mini CRM is a web-based customer and quotation management system designed for small and medium-sized businesses.

The application enables users to manage customer information, create sales quotations, track quotation statuses, and monitor key business metrics through a centralized dashboard.

The project aims to deliver a secure, maintainable, and production-oriented application using modern web development technologies and software engineering practices.

## Project Objectives

- Centralize customer information and management.
- Simplify the sales quotation management process.
- Improve quotation tracking and sales visibility.
- Develop a secure and maintainable full-stack application.
- Implement RESTful API architecture and relational database modeling.
- Apply professional software development practices.
- Deliver a tested and deployable application.

## Core Features

### Authentication & Authorization

- Secure user authentication.
- JWT-based authentication.
- Role-based access control.
- Protected application routes.

### Customer Management

- Create, view, update, and manage customers.
- Search and filter customers.
- View detailed customer information.
- View customer quotation history.

### Quotation Management

- Create and manage customer quotations.
- Add and manage quotation items.
- Automatically calculate quotation totals.
- Search and filter quotations.
- Track quotation statuses:
  - Draft
  - Sent
  - Accepted
  - Rejected

### Dashboard

- Total number of customers.
- Total number of quotations.
- Quotation status distribution.
- Total quotation value.
- Sales overview.

### System Features

- Responsive user interface.
- Form and input validation.
- Centralized error handling.
- RESTful API integration.
- Secure data management.

## Technology Stack

| Category | Technology |
|---|---|
| Frontend | React |
| Programming Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | ASP.NET Core Web API |
| Backend Language | C# |
| ORM | Entity Framework Core |
| Database | PostgreSQL |
| Authentication | JWT |
| API Documentation | OpenAPI |
| Version Control | Git & GitHub |
| Build Tool | Vite |
| UI Components | shadcn/ui |
| Containerization | Docker |
| CI/CD | GitHub Actions |

## Project Structure

```text
mini-crm/
├── frontend/
├── backend/
├── database/
├── docs/
├── tests/
├── .gitignore
└── README.md
```

| Directory | Description |
|---|---|
| frontend/ | React and TypeScript application |
| backend/ | ASP.NET Core Web API application |
| database/ | Database design, SQL scripts and seed data |
| docs/ | Project requirements and technical documentation |
| tests/ | Application and integration tests |

## Development Roadmap

- [ ] Phase 1 — Project Planning & Requirements
- [ ] Phase 2 — UI/UX Design
- [ ] Phase 3 — Frontend Development
- [ ] Phase 4 — Database Design & Modeling
- [ ] Phase 5 — Backend Development
- [ ] Phase 6 — Frontend–Backend Integration
- [ ] Phase 7 — Testing & Quality Assurance
- [ ] Phase 8 — Security Review
- [ ] Phase 9 — Deployment & Final Documentation

## Project Status

**Status:** In Development

**Current Phase:** Project Planning & Requirements

**Project Type:** Full-Stack Software Development Internship

**Development Duration:** 20 Working Days

**Development Start Date:** November 24, 2026

This project is under active development. Features, architecture, and documentation will be progressively updated throughout the development lifecycle.

## Getting Started

The following instructions describe how to install and run the Mini CRM frontend locally.

### Prerequisites

Ensure that the following tools are installed:

- Node.js (compatible with the project's Vite version)
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/frhandev/mini-crm.git
cd mini-crm
```

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm ci
```

### Development

Start the development server:

```bash
npm run dev
```

Open the application in your browser:

http://localhost:5173

### Production Build

Create an optimized production build:

```bash
npm run build
```

The generated files will be available in the `frontend/dist/` directory.

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to identify code quality issues:

```bash
npm run lint
```

### Formatting

Format the source code using Prettier:

```bash
npm run format
```

### Formatting Check

Check code formatting without modifying files:

```bash
npm run format:check
```