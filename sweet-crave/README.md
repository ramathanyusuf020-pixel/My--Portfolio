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

Run the app with `npm install` and `npm run dev`. Validate changes with `npm run build` and `npm run lint`.

- `src/App.jsx` coordinates routes, cart, stock, customer reviews, reservations, and checkout state.
- `src/data/catalog.js` is the shared product catalog with ingredients, allergen notes, calories, storage, and best-before guidance.
- `src/components/SiteHeader.jsx` contains page navigation, the Next-page button, and cart trigger.
- `src/components/SiteFooter.jsx` contains shared footer navigation.
- `src/components/ProductCard.jsx` displays products and stock-aware add controls.
- `src/components/ProductDetailsDialog.jsx` shows product details and inventory-aware ordering.
- `src/components/ReviewsPage.jsx` displays customer comments.
- `src/components/PageCorners.jsx` draws the candy, bubble, and chocolate corner decorations.
- `src/App.css` contains page and responsive styles; `src/index.css` contains global styles.
- `public/halluamatt-chocolate-logo.svg` is the brand logo and favicon asset.

Routes: `/`, `/shop`, `/celebrations`, `/about`, `/stock`, `/contact`, `/reviews`, and `/support`.

Stock and comments currently save in this browser only. To share them across customer devices, connect a backend. Product calorie, ingredient, allergen, and best-before details are estimates and must be confirmed against current recipes and labels. Payments and celebration requests are demos and are not submitted to payment or order services.
