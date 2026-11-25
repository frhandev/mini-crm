# Mini CRM design system

The Turkish workspace uses Geist Variable, compact white surfaces, slate text and royal blue actions. The primary button advances the current workflow. Outlined buttons offer secondary actions. Lists open details through a company name or quotation reference.

## Tokens

The Vite entry loads index.css (Tailwind v4 and shadcn mappings) and workspace.css (workspace tokens and layout). The light theme inherits the installed dark-mode variant. Dark mode is outside the review scope.

| Purpose | Token or value |
| --- | --- |
| Application and surfaces | background #F8FAFC, card and popover #FFFFFF |
| Text | foreground #0F172A, muted-foreground #58677B |
| Primary action, focus, activity series | primary #2563EB, ring and chart-1 |
| Dividers and input edges | border #E1E6EE, input #8996A8 |
| Draft and archived | draft-bg / draft-fg |
| Sent and information | sent-bg / sent-fg |
| Accepted and active | accepted-bg / accepted-fg |
| Rejected and errors | rejected-bg / rejected-fg |

Status badges combine a translated label with a dot. Chart marks use a separate palette and an adjacent text legend. Changing the primary token changes the main action, brand mark, focus and quotation activity line.

## Layout and components

- Titles use 30 px type with tight spacing. Panel titles use 16 px semibold, body text 14 px and secondary labels 12 px. Dashboard numbers grow with the viewport.
- Use 4 px spacing increments for forms and sections, 6–10 px corner radii, restrained borders, and shadows on floating surfaces.
- The shell owns the desktop rail, mobile drawer, breadcrumb and profile menu. Shared elements cover brand, page header, panels, fields, accessible dialogs, search, tables, pagination, badges and empty or confirmation feedback.
- At 900 px and below use the navigation drawer. The statistics grid becomes two columns at 650 px. Forms and charts stack, and wide tables scroll inside their panel. Desktop content is width-limited on large displays.

## Interaction and accessibility

Use visible labels, native form controls, explicit icon-button names, keyboard focus rings, localized currency and dates. Radix handles dialog focus trapping, Escape dismissal and menu navigation. The skip link targets the main workspace. Chart values are exposed through a text alternative and status labels. Respect reduced-motion preferences. A full assistive-technology and contrast audit remains pending.
