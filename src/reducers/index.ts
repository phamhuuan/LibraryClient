import {combineReducers} from 'redux';
import authorsReducer from './authorsReducer';
import booksReducer from './booksReducer';
import genresReducer from './genresReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
	userReducer,
	genresReducer,
	authorsReducer,
	booksReducer,
});

export default rootReducer;