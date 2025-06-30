import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store"; // Adjust import based on your store setup

export const selectAuth = (state: RootState) => state.auth;

export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (auth) => !!auth.token && !!auth.id
);

export const selectAuthLoading = createSelector(
  [selectAuth],
  (auth) => auth.loading
);

export const selectAuthError = createSelector(
  [selectAuth],
  (auth) => auth.error
);

export const selectCurrentUser = createSelector([selectAuth], (auth) => ({
  id: auth.id,
  firstName: auth.firstName,
  lastName: auth.lastName,
  email: auth.email,
  fullName: `${auth.firstName} ${auth.lastName}`.trim(),
}));

export const selectTokens = createSelector([selectAuth], (auth) => ({
  token: auth.token,
  refreshToken: auth.refreshToken,
}));
