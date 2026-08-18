# Pulse — Admin & Analytics Dashboard

A clean, dense, responsive administrative UI kit built with semantic HTML5, CSS Grid/Flexbox and Vanilla JavaScript. Chart.js is loaded only for the analytics charts.

## Pages
- `index.html` — dashboard overview, metrics, charts, activity and transactions.
- `users.html` — searchable user data table with status badges and pagination UI.

## Structure
```text
pulse-admin-analytics-dashboard/
├── index.html
├── users.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── assets/
└── README.md
```

## Rebranding
At the top of `css/styles.css`, edit `--primary`, `--bg`, `--surface`, `--text`, `--sidebar`, `--card-pad`, and `--sidebar-width`. The `html[data-theme="dark"]` block contains dark-mode overrides.

## Charts
Chart.js is initialized in `js/app.js` by `charts()`. Replace the sales labels/data arrays or traffic dataset with your own figures. Charts remain responsive through Chart.js.

## Tables
Add another `<tr>` inside the relevant `<tbody>` and follow the existing customer/status markup. The Users page search automatically searches all row text. Replace the mock pagination with server-side pagination when connecting a real API.

## Customization
- Replace demo names, metrics and activity copy.
- Connect the export button to your report generator.
- Connect user actions and forms to your backend.
- Replace text icon placeholders with your own licensed icon set.
- Add logos, avatars and other production assets under `/assets`.

## Marketplace tips
Show screenshots of the desktop dashboard, compact sidebar, users table, responsive mobile layout and both theme modes. The template deliberately keeps dependencies minimal: Chart.js is the only external library.
