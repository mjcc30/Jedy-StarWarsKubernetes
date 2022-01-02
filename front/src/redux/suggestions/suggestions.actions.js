import SuggestionsActionsTypes from "./suggestions.types";
import {getRequest} from "../../utils/fetch";


export const fetchSuggestionsSuccess = suggestions => ({
    type: SuggestionsActionsTypes.FETCH_SUGGESTIONS_SUCCESS,
    payload: suggestions
});

export const userInputEmpty = () => ({
    type: SuggestionsActionsTypes.USER_INPUT_EMPTY
});

export const fetchSuggestionsError = (error) => ({
    type: SuggestionsActionsTypes.FETCH_SUGGESTIONS_ERROR,
    payload: error
});

export const fetchSuggestionsStart = userInput => {
    return dispatch => {
        if(userInput.length === 0 ) {
            return dispatch(userInputEmpty());
        }
        getRequest(`${process.env.REACT_APP_API_ENTRYPOINT}/swapi/search?search=${userInput}`)
            .then(response => response.json())
            .then(response => dispatch(fetchSuggestionsSuccess(response)))
            .catch(err => dispatch(fetchSuggestionsError(err)))
    }
}
