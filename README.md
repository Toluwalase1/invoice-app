# Invoice Management App

A fully functional, responsive invoice management application built with **React 19**, **TypeScript**, and **Vite**. Users can create, view, edit, and delete invoices with full form validation, theme switching, and data persistence via LocalStorage.

> **Live Demo**: [Invoice App](https://invoice-app-peach-sigma.vercel.app/)

---

## Table of Contents

- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Architecture](#architecture)
- [Trade-offs](#trade-offs)
- [Accessibility](#accessibility)
- [Improvements Beyond Requirements](#improvements-beyond-requirements)

---

## Features

- **Full CRUD** — Create, read, update, and delete invoices
- **Save as Draft** — Save incomplete invoices as drafts (skips validation)
- **Mark as Paid** — Transition pending invoices to paid status
- **Filter by Status** — Toggle visibility by Draft, Pending, or Paid
- **Form Validation** — Required field checks with inline error messages and visual error states
- **Light/Dark Theme** — Toggle between themes with preference persisted to LocalStorage
- **LocalStorage Persistence** — All invoices and theme choice survive page reloads
- **Responsive Design** — Three breakpoints: desktop (sidebar), tablet (top bar), mobile (compact layout)
- **Hover States** — All interactive elements have visible hover feedback

---

## Setup Instructions

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/Toluwalase1/invoice-app.git
cd invoice-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Command            | Description                              |
|--------------------|------------------------------------------|
| `npm run dev`      | Start the Vite development server        |
| `npm run build`    | Type-check with TypeScript and build for production |
| `npm run preview`  | Preview the production build locally     |
| `npm run lint`     | Run ESLint across the project            |

### Production Build

```bash
npm run build
npm run preview
```

The optimized output is written to the `dist/` directory.

---

## Architecture

### Tech Stack

| Layer       | Technology                  |
|-------------|-----------------------------|
| Framework   | React 19                    |
| Language    | TypeScript 6                |
| Build Tool  | Vite 8                      |
| Styling     | Vanilla CSS (modular)       |
| Persistence | LocalStorage                |
| Linting     | ESLint + React Hooks plugin |

### Project Structure

```
src/
├── assets/                  # Static images (logo, avatar, illustration)
├── components/
│   ├── forms/
│   │   └── InvoiceFormDrawer.tsx   # Create/Edit invoice form
│   ├── invoices/
│   │   ├── EmptyState.tsx          # Empty list illustration
│   │   ├── InvoiceDetails.tsx      # Single invoice detail view
│   │   ├── InvoiceHeader.tsx       # List header with filter & new button
│   │   └── InvoiceList.tsx         # Invoice card list
│   ├── layout/
│   │   └── SideNav.tsx             # Sidebar / top navigation bar
│   └── modals/
│       └── DeleteModal.tsx         # Delete confirmation dialog
├── data/
│   └── invoices.ts          # Blank form factory, payment options
├── hooks/
│   ├── useInvoices.ts       # CRUD operations + LocalStorage sync
│   ├── useInvoiceForm.ts    # Form state, validation, open/close
│   └── useTheme.ts          # Theme toggle + LocalStorage persistence
├── lib/
│   └── storage.ts           # LocalStorage read/write abstraction
├── styles/                  # Modular CSS (split by concern)
│   ├── base.css             # Resets, app shell, theme variables, focus styles
│   ├── buttons.css          # .btn variants (ghost, muted, danger, primary)
│   ├── sidebar.css          # Side nav, logo, avatar, theme toggle
│   ├── invoices.css         # Header, filter, cards, status pills, empty state
│   ├── details.css          # Detail view, items table, mobile items
│   ├── form.css             # Drawer, inputs, validation, grid layouts
│   ├── modal.css            # Delete modal overlay
│   └── responsive.css       # All media queries (tablet, mobile, small)
├── types/
│   └── invoice.ts           # TypeScript interfaces & type aliases
├── utils/
│   └── invoice.ts           # Formatting, ID generation, validation
├── App.tsx                  # Root component — orchestrates hooks & UI state
├── App.css                  # CSS entry point (imports all style modules)
├── main.tsx                 # React DOM entry point
└── index.css                # Global body/font styles
```

### Data Flow

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│  App.tsx     │───▶│  useInvoices │───▶│  storage.ts  │───▶ localStorage
│  (UI state)  │    │  (CRUD)      │    │  (read/write)│
│              │───▶│  useTheme    │───▶│              │
│              │    │  (toggle)    │    └──────────────┘
│              │───▶│  useInvoiceForm│
│              │    │  (validation) │───▶ validateInvoiceForm()
└─────────────┘    └──────────────┘
```

**Key design principle**: `App.tsx` is a thin orchestrator. All business logic (CRUD, validation, persistence) lives in custom hooks. Components receive data and callbacks via props — no component manages its own persistence.

### State Management

The app uses **no external state library**. State is managed through:

1. **`useInvoices`** — Holds the invoice array in `useState`. A `useEffect` syncs to `localStorage` on every change. On mount, it reads from `localStorage` (or falls back to an empty array).
2. **`useInvoiceForm`** — Manages form data, validation errors, and the `submitted` flag. Errors only display after the first submit attempt and clear dynamically as the user corrects fields.
3. **`useTheme`** — Holds `'light' | 'dark'` in `useState`, syncs to `localStorage`.

### View Management

Navigation between the list view and detail view is handled via internal state (`useState<'list' | 'details'>`) rather than a routing library. This was a deliberate choice to keep the dependency footprint minimal for a single-page tool.

---

## Trade-offs

### LocalStorage vs. Backend

| Choice         | Rationale                                                   |
|----------------|-------------------------------------------------------------|
| **LocalStorage** | Zero setup, no server needed, instant reads/writes. Suitable for a single-user demo app. |
| **Limitation**   | Data is browser-scoped — no cross-device sync, no multi-user support. Storage cap of ~5 MB. |
| **Migration path** | The `storage.ts` abstraction layer can be swapped to an API client (e.g., `fetch` to a REST/GraphQL backend) without changing any hook or component code. |

### Internal View State vs. React Router

| Choice              | Rationale                                                     |
|---------------------|---------------------------------------------------------------|
| **Internal state**  | No added dependency. Simpler mental model for a two-view app. |
| **Limitation**      | No shareable URLs, no browser back/forward navigation between views. |
| **Migration path**  | Replace `view` state with `<Routes>` and `useNavigate()` — the component structure is already split by view. |

### Vanilla CSS vs. CSS-in-JS / Tailwind

| Choice          | Rationale                                                    |
|-----------------|--------------------------------------------------------------|
| **Vanilla CSS** | Full control, no build-time overhead, no learning curve for contributors. CSS custom properties (variables) provide theming without a library. |
| **Limitation**   | No scoping — class name collisions are possible (mitigated by descriptive naming). |
| **Migration path** | CSS Modules or Tailwind can be added per-file without a full rewrite. |

### No External Validation Library

Form validation uses a hand-written `validateInvoiceForm()` function rather than a library like Zod, Yup, or React Hook Form. This avoids a dependency for a relatively simple form, but means the validation logic must be maintained manually as the form grows.

---

## Accessibility

The app follows **WCAG 2.1 Level AA** principles:

### Keyboard Navigation

- All interactive elements (buttons, inputs, checkboxes, links) are reachable via `Tab`
- **`:focus-visible`** outlines are styled with the app's accent color, ensuring keyboard focus is always visible without affecting mouse users
- Inputs show a subtle box-shadow ring on keyboard focus

### Modals & Drawers

- **`role="dialog"` and `aria-modal="true"`** on both the delete modal and form drawer
- **`aria-label`** / **`aria-labelledby`** / **`aria-describedby`** provide screen reader context
- **Focus trap** in the delete modal — `Tab` / `Shift+Tab` cycle within the modal boundary
- **Escape key** closes both the drawer and the modal
- **Auto-focus** — the cancel button receives focus when the delete modal opens; the drawer receives focus when the form opens

### Form Validation

- **`aria-invalid`** attribute is set on fields with errors, so screen readers announce invalid state
- Error messages are placed adjacent to their fields for visual and programmatic association
- A **`role="alert"`** validation summary appears after submission, announcing errors to assistive technology

### Other

- **Semantic HTML** — `<main>`, `<header>`, `<footer>`, `<section>`, `<article>`, `<aside>`, `<address>` used throughout
- **Alt text** on all images (logo, avatar, empty state illustration)
- **Theme toggle** has an explicit `aria-label="Toggle theme"`
- **Remove item** buttons use `aria-label` with the item name for screen reader clarity (e.g., "Remove Banner Design")

---

## Improvements Beyond Requirements

### 1. Modular CSS Architecture

Styles are split into **8 focused CSS modules** (`base`, `buttons`, `sidebar`, `invoices`, `details`, `form`, `modal`, `responsive`) instead of a single monolithic file. This improves maintainability and makes it easy to locate styles by concern.

### 2. Storage Abstraction Layer

The `storage.ts` module provides a clean API (`loadInvoices`, `saveInvoices`, `loadTheme`, `saveTheme`) that decouples persistence from business logic. Switching from LocalStorage to IndexedDB, a REST API, or any other backend requires changing only this one file.

### 3. Form Validation UX

- Errors are **not shown on initial form open** — they appear only after the first submit attempt
- Once shown, errors **clear dynamically** as the user corrects each field (no need to re-submit to see progress)
- **"Save as Draft" bypasses all validation**, allowing users to save incomplete invoices



