# Smart Inventory — Frontend (React + TypeScript + MUI)

Frontend-only package. No backend or database included — this connects to the
.NET Core Web API built earlier (endpoints under `/api/...`).

## Setup

```bash
npm install
cp .env.example .env      # then set VITE_API_BASE_URL to your running API
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

## Notes

- If the backend isn't running, every page falls back to bundled mock data
  (`src/mock/mockData.ts`) so the UI is fully browsable and demoable on its own.
- All styling is done with MUI's `sx` prop or inline `style` — no custom CSS
  classes or stylesheet files are used anywhere in the project.
- Design tokens (colors, typography) live in `src/theme/theme.ts`.

## Structure

```
src/
  theme/theme.ts          design tokens + MUI theme
  types/index.ts          shared TypeScript interfaces
  services/               axios calls to the API, with mock fallback
  mock/mockData.ts         demo data used when the API is unreachable
  components/             shared UI pieces (tag chip, status chip, dialogs, layout)
  pages/                   Dashboard, Assets, Assignments, Repairs, Vendors, Employees, Reports
  App.tsx                  routes
  main.tsx                 entry point
```
