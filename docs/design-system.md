# Mini CRM — Design System

## Overview

The Mini CRM design system provides a consistent visual identity based on Geist Variable typography, compact white surfaces, slate text, and royal blue primary actions.

Its objectives are visual consistency, component reusability, maintainability, responsive behavior, and accessible interactions.

## Styling Architecture

| File                                 | Responsibility                                           |
| ------------------------------------ | -------------------------------------------------------- |
| `frontend/src/index.css`             | Tailwind CSS v4, shadcn/ui configuration, and base theme |
| `frontend/src/styles/tokens.css`     | Application design tokens and theme overrides            |
| `frontend/src/styles/layout.css`     | Application shell, navigation, and responsive layout     |
| `frontend/src/styles/components.css` | Shared component and feature styling                     |

The light workspace palette overrides the base shadcn theme. Dark mode remains outside the current quality review scope.

## Design Tokens

| Token                  | Value         | Purpose                            |
| ---------------------- | ------------- | ---------------------------------- |
| `--primary`            | #2563EB       | Primary actions                    |
| `--primary-hover`      | #1D4ED8       | Primary action hover state         |
| `--primary-foreground` | #FFFFFF       | Primary action text                |
| `--background`         | #F8FAFC       | Application background             |
| `--card`               | #FFFFFF       | Surface background                 |
| `--foreground`         | #0F172A       | Primary text                       |
| `--muted-foreground`   | #58677B       | Secondary text                     |
| `--border`             | #E1E6EE       | Decorative boundaries and dividers |
| `--input`              | #7C899A       | Input boundaries                   |
| `--destructive`        | #B42328       | Destructive actions                |
| `--ring`               | Primary token | Focus indicators                   |

Design tokens are centralized and reused throughout the application.

## Typography

The application uses Geist Variable.

| Element              | Size             |
| -------------------- | ---------------- |
| Page headings        | 30px             |
| Panel headings       | 16px             |
| Body text            | 14px             |
| Secondary text       | 12px             |
| Dashboard statistics | Responsive sizes |

## Component Dimensions

| Component             | Default or minimum height |
| --------------------- | ------------------------- |
| Default shadcn button | 32px                      |
| Page action button    | 36px minimum              |
| Default shadcn input  | 32px                      |
| Form field input      | 39px minimum              |
| Search input          | 36px                      |
| Navigation item       | 40px                      |

Component dimensions may vary according to their functional responsibilities. Interactive targets must remain accessible and appropriately spaced.

## Status Indicators

| Status   | Turkish Label | Background | Foreground |
| -------- | ------------- | ---------- | ---------- |
| Draft    | Taslak        | #EFF2F7    | #475569    |
| Sent     | Gönderildi    | #E4EEFF    | #204A9B    |
| Accepted | Kabul Edildi  | #E0F4E9    | #16603E    |
| Rejected | Reddedildi    | #FCE9E6    | #95392F    |
| Active   | Aktif         | #E0F4E9    | #16603E    |
| Archived | Arşivlendi    | #EFF2F7    | #475569    |

Status indicators use a shared component, translated labels, and centralized color tokens.

Status information must not rely exclusively on color.

Quotation status values remain consistent with the preliminary API contracts.

## Shared Components

Reusable application components are located in `frontend/src/components/shared/`.

These include Brand, Header, Panel, Table, Field, StatusBadge, SearchBox, Empty, Pages, and Modal.

The quotation table is reused across the dashboard, quotation list, and customer quotation history.

Customer creation and editing share a common form component. Quotation creation and editing share a common builder component.

## Responsive Design

| Breakpoint       | Behavior                                           |
| ---------------- | -------------------------------------------------- |
| 1199px and below | Dashboard chart and spacing adjustments            |
| 900px and below  | Mobile navigation replaces the desktop sidebar     |
| 650px and below  | Forms and charts stack; statistics use two columns |

Wide tables support horizontal scrolling within their own containers.

The required responsive review widths are 360px, 390px, 768px, 1024px, 1440px, and 1920px.

## Accessibility Guidelines

- Use visible labels and accessible names.
- Associate validation messages with their corresponding fields.
- Preserve visible keyboard focus indicators.
- Support keyboard navigation.
- Support dialog dismissal and appropriate focus restoration.
- Provide accessible names for icon-only buttons.
- Respect reduced-motion preferences.
- Avoid color-only status communication.
- Review text and non-text contrast against applicable WCAG 2.2 AA requirements.

## Color Contrast

The design system targets a minimum contrast ratio of 4.5:1 for normal text, 3:1 for large text, and 3:1 for applicable non-text control boundaries and visual indicators.

The primary hover token uses an opaque darker blue to maintain text contrast.

Input boundaries use a darker neutral color to improve visibility against light backgrounds.

Calculated token contrast does not replace browser-based accessibility testing.

## CSS Scope

Sidebar-specific rules are scoped to the application shell.

Table-specific rules are scoped to the shared table container.

Global typography and focus rules remain intentional.

Component selectors must preserve compatibility with Radix portal-based dialogs and dropdown menus.

## Quality Assurance

Responsive testing, accessibility observations, Lighthouse results, identified issues, and regression testing are documented in [UI Quality Review](ui-quality-review.md).

Automated audit results do not establish full WCAG conformance.
