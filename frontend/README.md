# Mini CRM — Frontend

The frontend application of Mini CRM, a customer and quotation management system designed for small and medium-sized businesses.

## Overview

The frontend is responsible for providing the user interface, handling user interactions, managing application state, and preparing for integration with the backend REST API.

The application follows a feature-based architecture with reusable components, separated TypeScript models, and organized styling.

## Technology Stack

| Category             | Technology      |
| -------------------- | --------------- |
| Framework            | React           |
| Programming Language | TypeScript      |
| Build Tool           | Vite            |
| Styling              | Tailwind CSS v4 |
| UI Components        | shadcn/ui       |
| UI Primitives        | Radix UI        |
| Icons                | Lucide React    |
| Typography           | Geist           |
| Linting              | ESLint          |
| Formatting           | Prettier        |

## Current Implementation

The interactive UI prototype covers the following modules:

- Authentication screens
- Dashboard and analytics
- Customer management
- Quotation management
- User management
- Company settings
- Activity history
- User profile
- System and error states
- Responsive application layout

The prototype uses fictional fixture data and temporary state-based navigation.

## Frontend Architecture

The application is organized using a feature-based architecture to improve maintainability, modularity, and component reusability.

### Project Structure

| Directory                | Responsibility                                                         |
| ------------------------ | ---------------------------------------------------------------------- |
| `src/components/ui/`     | shadcn/ui primitives                                                   |
| `src/components/shared/` | Reusable application components                                        |
| `src/features/`          | Feature-specific pages and components                                  |
| `src/layouts/`           | Application shell and navigation layout                                |
| `src/types/`             | Shared TypeScript models                                               |
| `src/lib/`               | General utilities, formatters, and status labels                       |
| `src/preview/`           | Temporary navigation, fixtures, scenarios, and indicative calculations |
| `src/styles/`            | Design tokens, layout styles, and component styles                     |

### Feature Modules

| Module        | Responsibility                                    |
| ------------- | ------------------------------------------------- |
| `auth/`       | Login interface and authentication preview        |
| `dashboard/`  | Business metrics and quotation charts             |
| `customers/`  | Customer listing, details, creation, and editing  |
| `quotations/` | Quotation listing, details, creation, and editing |
| `users/`      | User management                                   |
| `settings/`   | Company settings                                  |
| `activity/`   | Activity history                                  |
| `profile/`    | User profile                                      |
| `system/`     | Error and access-related screens                  |

## Shared Components

Reusable application components are separated from feature-specific pages.

These include:

- Brand
- Header
- Panel
- Table
- Field
- StatusBadge
- SearchBox
- Empty
- Pages
- Modal

The quotation table is reused across the dashboard, quotation list, and customer quotation history.

Customer creation and editing share a single form component. Quotation creation and editing share a single builder component.

## Styling Architecture

| File                        | Responsibility                                             |
| --------------------------- | ---------------------------------------------------------- |
| `src/index.css`             | Tailwind CSS and shadcn/ui configuration                   |
| `src/styles/tokens.css`     | Design tokens and application theme overrides              |
| `src/styles/layout.css`     | Application shell and responsive layout                    |
| `src/styles/components.css` | Tables, charts, forms, dialogs, and other component styles |

The styling architecture preserves the original UI prototype's visual identity.

## Prototype Limitations

- All displayed records are fictional.
- Form submissions do not persist data.
- Authentication and authorization are simulated for visual review.
- Quotation calculations are indicative only.
- Navigation uses temporary state-based controls.
- No production API integration is implemented.
- Final validation and business rules will be implemented in subsequent development tasks.

## Available Scripts

| Command                | Description                          |
| ---------------------- | ------------------------------------ |
| `npm ci`               | Install project dependencies         |
| `npm run dev`          | Start the development server         |
| `npm run build`        | Type-check and build the application |
| `npm run preview`      | Preview the production build         |
| `npm run lint`         | Run ESLint checks                    |
| `npm run format`       | Format files using Prettier          |
| `npm run format:check` | Check code formatting                |

## Getting Started

Install dependencies:

`npm ci`

Start the development server:

`npm run dev`

Open the local URL displayed by Vite.

## Documentation

- [Getting Started](../README.md#getting-started)
- [Requirements Specification](../docs/requirements.md)
- [API Contracts](../docs/api-contracts.md)
- [UI Prototype](../docs/ui-prototype.md)

## Project Status

**Status:** In Development

**Current Stage:** UI Integration and Refactoring

**Frontend–Backend Integration:** Preparation Only

The frontend UI prototype is organized into a feature-based architecture in preparation for production routing, application logic, validation, and backend API integration.
