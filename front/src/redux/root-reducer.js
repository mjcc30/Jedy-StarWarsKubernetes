import {combineReducers} from 'redux';

import userReducer from './user/user.reducer';
import suggestionsReducer from "./suggestions/suggestions.reducer";

const rootReducer = combineReducers({
    user: userReducer,
    suggestions: suggestionsReducer
});

export default rootReducer;