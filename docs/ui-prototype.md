# Mini CRM — UI Prototype

## 1. Overview

The Mini CRM UI prototype provides an interactive representation of the application's planned user interface, workflows, business rules, and system states.

The prototype is designed to validate the user experience before implementing production routing, authentication, persistent storage, and backend API integration.

All displayed records are fictional, and all operations are non-persistent.

## 2. Reviewing the Prototype

From the `frontend/` directory, install dependencies using `npm ci` and start the development server using `npm run dev`.

Open the local URL displayed by Vite.

The dashboard opens with the fictional administrator Selin Yalçın.

Choose **Tasarım önizlemesi** at the foot of the sidebar or inside the mobile navigation menu.

Select a role, screen, and supported scenario, then choose **Önizlemeyi göster**.

The login screen provides its own preview launcher.

Refreshing the application resets the workspace.

## 3. Requirements Traceability

| Priority and Requirement | Review Surfaces and Interactions                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Mandatory FR-01          | Login A01, field errors, invalid credentials, password visibility, loading, profile E04, logout                                 |
| Mandatory FR-02          | Role preview, administrator navigation, archive visibility, and forbidden F01                                                   |
| Mandatory FR-03–05       | Customer list C01, details and quotations C02, create/edit C03–04, archive confirmation C05                                     |
| Mandatory FR-06–08       | Quotation list D01, detail D02, new and prefilled draft builder D03–04, add/remove lines, and indicative totals                 |
| Mandatory FR-09          | Status history and confirmations D05, Draft → Sent → Accepted or Rejected                                                       |
| Mandatory FR-10          | Dashboard B01, count and value metrics, monthly activity, status distribution, recent records, quick actions, and empty preview |
| Secondary FR-11–13       | User management E01 with create/edit/deactivate dialogs, company settings E02, and activity history E03                         |
| Supporting               | Profile E04, forbidden F01, missing page F02, general error F03, and retry                                                      |
| Optional FR-14           | PDF export deferred                                                                                                             |

This mapping identifies prototype review surfaces rather than completed production functionality.

## 4. Supported Scenarios

### Authentication

- Normal login preview
- Loading state
- Invalid credentials
- Field validation errors
- Password visibility

Error, invalid, and loading scenarios prevent navigation to the dashboard through form submission.

### Customer Management

- Customer listing
- Search, filtering, sorting, and pagination
- Empty, loading, and error states
- Customer details
- Quotation history
- Customer creation and editing previews
- Archive confirmation
- Archived customer notices

Archived customers retain their quotation history. Editing an archived customer displays a provisional-policy notice.

### Quotation Management

- Quotation listing
- Search by quotation reference
- Filtering by customer and status
- Sorting and pagination
- Quotation details
- Creation and editing of draft quotation previews
- Adding and removing quotation items
- Indicative quotation totals
- Unsaved changes confirmation
- Status transition confirmation

Open QUO-2026-0034 to review the empty draft send restriction.

Select a populated draft to review quotation item editing.

Sent quotations offer accept and reject actions. Terminal quotations provide read-only details.

### Administration

- Administrator and Sales Employee role previews
- User management
- Company settings
- Activity history
- User profile
- Restricted navigation
- Forbidden state

Switch to Sales Employee while viewing an administration page to inspect the forbidden state.

### Operation Feedback

Form submissions and confirmation dialogs provide preview feedback.

The shared `PreviewNotice` component explicitly informs users that the operation preview has completed and that no data has been saved.

Fictional records retain their original values.

## 5. Source Organization

The frontend follows a feature-based architecture.

`App.tsx` delegates to `preview/Preview.tsx`, which manages temporary navigation, selected records, role selection, and scenario selection.

Feature pages receive records and navigation callbacks through props.

### Feature Modules

| File                                                     | Responsibility                                |
| -------------------------------------------------------- | --------------------------------------------- |
| `features/auth/LoginPage.tsx`                            | Login interface                               |
| `features/dashboard/DashboardPage.tsx`                   | Dashboard metrics and overview                |
| `features/dashboard/components/QuotationTrendChart.tsx`  | Quotation trend visualization                 |
| `features/dashboard/components/QuotationStatusChart.tsx` | Quotation status distribution                 |
| `features/customers/CustomersPage.tsx`                   | Customer listing                              |
| `features/customers/CustomerDetailsPage.tsx`             | Customer details and quotation history        |
| `features/customers/CustomerFormPage.tsx`                | Shared customer creation and editing form     |
| `features/quotations/QuotationsPage.tsx`                 | Quotation listing                             |
| `features/quotations/QuotationDetailsPage.tsx`           | Quotation details and status preview          |
| `features/quotations/QuotationBuilderPage.tsx`           | Shared quotation creation and editing builder |
| `features/quotations/components/QuotationTable.tsx`      | Reusable quotation table                      |
| `features/users/UsersPage.tsx`                           | User management                               |
| `features/settings/SettingsPage.tsx`                     | Company settings                              |
| `features/activity/ActivityPage.tsx`                     | Activity history                              |
| `features/profile/ProfilePage.tsx`                       | User profile                                  |
| `features/system/SystemPage.tsx`                         | System and error states                       |

### Shared Components

Reusable application components are located in `components/shared/`.

The shadcn/ui primitives remain in `components/ui/`.

The application shell, sidebar, topbar, and navigation layout are managed by `layouts/AppShell.tsx`.

### TypeScript Models

| File                 | Responsibility                                         |
| -------------------- | ------------------------------------------------------ |
| `types/customer.ts`  | Customer model                                         |
| `types/quotation.ts` | Quotation, quotation item, and quotation status models |
| `types/user.ts`      | User model                                             |
| `types/activity.ts`  | Activity model                                         |

These models represent the current frontend data structures and are not finalized API DTOs.

### Utilities

| File                   | Responsibility                      |
| ---------------------- | ----------------------------------- |
| `lib/utils.ts`         | Shared utility functions            |
| `lib/formatters.ts`    | Currency, date, and name formatting |
| `lib/status-labels.ts` | Quotation status translations       |

### Preview Infrastructure

| File                        | Responsibility                                  |
| --------------------------- | ----------------------------------------------- |
| `preview/Preview.tsx`       | Temporary navigation and scenario orchestration |
| `preview/fixtures.ts`       | Fictional application records                   |
| `preview/types.ts`          | Preview navigation and scenario types           |
| `preview/calculations.ts`   | Indicative quotation calculations               |
| `preview/PreviewNotice.tsx` | Non-persistent operation feedback               |

## 6. Styling Architecture

The original workspace styles are separated according to their responsibilities.

| File                    | Responsibility                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `index.css`             | Tailwind CSS and shadcn/ui configuration                                           |
| `styles/tokens.css`     | Application design tokens and theme overrides                                      |
| `styles/layout.css`     | Application shell, sidebar, topbar, and responsive layout                          |
| `styles/components.css` | Shared components, charts, tables, forms, dialogs, and responsive component styles |

The refactoring aims to preserve the original visual identity, typography, spacing, colors, and responsive behavior.

Existing shadcn/ui components, Radix UI dialogs and menus, Lucide icons, Geist typography, and SVG charts remain in use.

## 7. Assumptions and Open Decisions

The snapshot date is 25 November 2026.

Dates use `tr-TR` and `Europe/Istanbul`, monetary values use TRY, and illustrative references follow the QUO-2026-NNNN format.

Dashboard totals count every fixture across all statuses.

The six-row review page makes pagination visible on a small fixture set. The proposed API default is 20 records.

Customer lists initially include archived customers.

All employees share the same fictional records.

Timeline stages are illustrative and have no asserted event timestamps.

Customer requiredness and uniqueness, editing archived records and their drafts, ownership, final reference format, currency and rounding, and dashboard definitions remain open under OD-02 through OD-07.

OD-01 and OD-08 through OD-12 cover sessions, API conventions, concurrency, optional scope, performance, and provisioning.

Proposed administration fields, activity history, and profile functionality require approved API contracts.

## 8. Integration Handoff

Replace temporary state-based navigation with production routing during frontend development.

Bind customer listing and detail screens to the approved API contracts, including pagination and quotation history filtering.

The backend will own:

- Authentication and authorization
- Record-level access enforcement
- Customer archival rules
- Quotation status transitions
- Quotation reference generation
- Authoritative financial calculations
- Data integrity
- Concurrent updates

Define field-error and conflict responses before wiring form submissions.

Preserve fixture-based scenarios for future regression testing.

The current refactoring prepares the UI for integration but does not introduce production API communication.

## 9. Quality Assurance

The following checks are required before accepting the UI integration refactoring:

| Check                              | Command or Method                         |
| ---------------------------------- | ----------------------------------------- |
| Formatting                         | `npm run format`                          |
| Formatting verification            | `npm run format:check`                    |
| Static analysis                    | `npm run lint`                            |
| Type checking and production build | `npm run build`                           |
| Navigation verification            | Manual browser testing                    |
| Responsive behavior                | Desktop, tablet, and mobile testing       |
| Visual regression                  | Comparison with the original UI prototype |
| Scenario verification              | Review all supported preview scenarios    |

## 10. Scope and Limitations

The following are outside the scope of the current UI integration refactoring:

- Production routing
- Mock authentication services
- Mock customer API
- Final validation schemas
- Production quotation calculation engine
- ASP.NET Core backend integration
- Persistent database storage
- Email delivery
- PDF export
- Production deployment

## 11. Integration Status

**Development Stage:** UI Integration and Refactoring

**Frontend–Backend Integration:** Preparation Only

**Data Source:** Fictional fixtures

**Persistence:** Not implemented

**Production Authentication:** Not implemented

**Production Routing:** Not implemented
