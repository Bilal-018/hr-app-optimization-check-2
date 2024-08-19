import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { RouterProvider } from "react-router";
import "react-phone-input-2/lib/style.css";
import routes from "./routes";
import "./index.css";

import "./i18n";
import Loader from "./components/Global/Loader";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={routes} />
      </Suspense>
    </StrictMode>
  );
} else {
  console.error("Root element not found");
}
