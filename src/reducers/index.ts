import {combineReducers} from 'redux';
import genresReducer from './genresReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
	userReducer,
	genresReducer,
});

export default rootReducer;