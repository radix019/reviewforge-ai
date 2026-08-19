"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useAuth } from "../features/auth/useAuth";

function AuthInitializer() {
  useAuth();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
}
