import SuggestionsActionsTypes from './suggestions.types';

const INITIAL_STATE = {
    results: [],
    showSuggestions: false,
    error: null
};

const suggestionsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case SuggestionsActionsTypes.FETCH_SUGGESTIONS_SUCCESS:
            return {
                ...state,
                results: action.payload,
                showSuggestions: true
            };

        case SuggestionsActionsTypes.USER_INPUT_EMPTY:
            return {
                ...state,
                results: [],
                showSuggestions: false
            };

        case SuggestionsActionsTypes.FETCH_SUGGESTIONS_ERROR:
            return {
                ...state,
                results: [],
                showSuggestions: false,
                error: action.payload
            };


        default:
            return state;
    }
};

export default suggestionsReducer;