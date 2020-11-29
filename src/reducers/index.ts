import {combineReducers} from 'redux';
import authorsReducer from './authorsReducer';
import genresReducer from './genresReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
	userReducer,
	genresReducer,
	authorsReducer,
});

export default rootReducer;