"use client";

import { useEffect } from "react";

import { authCheckComplete, loginSuccess } from "./authSlice";
import { apiClient } from "../../lib/apiClient";
import { useAppDispatch } from "../../app/store/hooks";

export function useAuth() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    apiClient("/api/auth/me")
      .then((data) => {
        dispatch(loginSuccess({ user: data.user }));
      })
      .catch(() => {
        dispatch(authCheckComplete());
      });
  }, [dispatch]);
}
