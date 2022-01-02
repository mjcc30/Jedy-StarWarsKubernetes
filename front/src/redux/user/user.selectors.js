import { createSelector } from 'reselect';

const selectUser = state => state.user;

export const selectLoginError = createSelector(
    [selectUser],
    (user) => user.error
)

export const selectIsLoginFetching = createSelector(
    [selectUser],
    (user) => user.isLoading
)

export const selectCurrentUser = createSelector(
    [selectUser],
    (user) => user.currentUser
);