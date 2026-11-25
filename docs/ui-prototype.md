# Mini CRM UI prototype

## Review

Run npm ci and npm run dev in frontend. Open the local Vite URL. The dashboard opens with the fictional administrator Selin Yalçın. Choose **Tasarım önizlemesi** at the foot of the sidebar or inside the mobile menu. Select a role, screen and supported state, then choose **Önizlemeyi göster**. Login has its own preview launcher. Refreshing resets the workspace.

| Priority and requirement | Review surfaces and interactions |
| --- | --- |
| Mandatory FR-01 | Login A01, field errors, invalid credentials, password visibility, loading, profile E04, logout |
| Mandatory FR-02 | Role preview, administrator navigation, archive visibility and forbidden F01 |
| Mandatory FR-03–05 | Customer list C01, details and quotations C02, create/edit C03–04, archive confirmation C05 |
| Mandatory FR-06–08 | Quotation list D01, detail D02, new and prefilled draft builder D03–04, add/remove lines and indicative totals |
| Mandatory FR-09 | Status history and confirmations D05, Draft → Sent → Accepted or Rejected |
| Mandatory FR-10 | Dashboard B01, count and value metrics, monthly activity, status distribution, recent records, quick actions and empty preview |
| Secondary FR-11–13 | User management E01 with create/edit/deactivate dialogs, company settings E02 and activity history E03 |
| Supporting | Profile E04, forbidden F01, missing page F02, general error F03 and retry |
| Optional FR-14 | PDF export deferred |

## Scenarios

- Search a list for an unmatched value to see its no-results state. Try the empty, loading and error variants separately. Filters, sorting and pagination operate on the displayed fixtures.
- Open an archived customer from the status filter. Their historical quotations remain accessible. New quotations offer active customers. Editing an archived customer displays a provisional-policy notice.
- Open QUO-2026-0034 to review the empty draft send restriction. Select a populated draft to edit line items. Change a line and cancel to see the discard confirmation. Sent quotations offer accept and reject. Terminal quotations have read-only details. Choose the validation-error view on quotation details to see invalid-transition feedback.
- Switch to Sales Employee while viewing an administration page to see the forbidden state. Return to the dashboard to inspect the reduced menu.
- Form submissions and confirmation dialogs end with preview feedback. Fictional records retain their original values. The sample chart uses the same quotations and totals as the lists.

## Source organization

App.tsx delegates to preview/Preview.tsx. The preview owns ephemeral page, selected record, role and state choices. preview/fixtures.ts contains the sample records. lib/model.ts supplies shared types, status translations and presentation formatting. layouts/AppShell.tsx and components/shared/Elements.tsx provide layout and common controls. Feature views receive records and navigation callbacks through props. Existing shadcn buttons, fields and badges, Radix dialogs/menus, Lucide icons and Geist remain in use. No dependencies were added. SVG charts render the small local series.

## Assumptions and open decisions

The snapshot date is 25 November 2026. Dates use tr-TR and Europe/Istanbul, values use TRY, and illustrative references follow QUO-2026-NNNN. Dashboard totals count every fixture across all statuses. The six-row review page makes pagination visible on a small fixture set. The proposed API default is 20. Customer lists initially include archived customers. All employees share the same fictional records. Timeline stages are illustrative and have no asserted event timestamps.

Customer requiredness and uniqueness, editing archived records and their drafts, ownership, final reference format, currency/rounding and dashboard definitions remain open under OD-02 through OD-07. OD-01 and OD-08 through OD-12 cover sessions, API conventions, concurrency, optional scope, performance and provisioning. Proposed administration fields, activity history, and profile work need approved contracts.

## Integration handoff

Replace the temporary selector with production routing during frontend development. Bind the customer list and detail screens to paginated contracts first, including the quotation history filter. The backend will own authentication, scope enforcement, archival rules, status transitions, reference generation, authoritative financial totals and concurrent updates. Define field-error and conflict responses before wiring form submission. Preserve the fixture scenarios for regression tests. Production security, storage, email, PDF, and deployment are outside this prototype.
