# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## HALLUAMATT source map

Install dependencies with `npm install`, then start the app and data server in separate terminals:

```sh
npm run server
npm run dev
```

JSON Server runs at `http://localhost:3001`; Vite proxies `/api` requests to it. Validate changes with `npm run build` and `npm run lint`.

- `src/App.jsx` coordinates routes, cart, stock, customer reviews, reservations, and checkout state.
- `src/data/catalog.js` is the shared product catalog with ingredients, allergen notes, calories, storage, and best-before guidance.
- `src/data/api.js` loads and updates shared stock/review records through JSON Server.
- `db.json` seeds the local API with product quantities and an empty reviews list.
- `src/components/SiteHeader.jsx` contains page navigation, the Next-page button, and cart trigger.
- `src/components/SiteFooter.jsx` contains shared footer navigation.
- `src/components/ProductCard.jsx` displays products and stock-aware add controls.
- `src/components/ProductDetailsDialog.jsx` shows product details and inventory-aware ordering.
- `src/components/ReviewsPage.jsx` displays customer comments.
- `src/components/PageCorners.jsx` draws the candy, bubble, and chocolate corner decorations.
- `src/App.css` contains page and responsive styles; `src/index.css` contains global styles.
- `public/halluamatt-chocolate-logo.svg` is the brand logo and favicon asset.

Routes: `/`, `/shop`, `/celebrations`, `/about`, `/stock`, `/contact`, `/reviews`, and `/support`.

When JSON Server is running, stock and reviews are shared by clients using that server. If it is unavailable, the app falls back to this browser's local storage. For a deployed site, set `VITE_API_BASE_URL` to a hosted API. JSON Server has no authentication and is for local development; do not expose it publicly for live inventory or customer data. Product calorie, ingredient, allergen, and best-before details are estimates and must be confirmed against current recipes and labels. Payments and celebration requests are demos and are not submitted to payment or order services.
