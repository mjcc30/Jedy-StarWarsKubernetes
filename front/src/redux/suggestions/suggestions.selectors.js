import { createSelector } from 'reselect';

const selectSuggestions = state => state.suggestions;


export const selectSuggestionsResults = createSelector(
    [selectSuggestions],
    (suggestions) => suggestions.results
);

export const selectIsSuggestionsVisible = createSelector(
    [selectSuggestions],
    (suggestions) => suggestions.showSuggestions
);

export const selectSuggestionsError = createSelector(
    [selectSuggestions],
    (suggestions) => suggestions.error
);