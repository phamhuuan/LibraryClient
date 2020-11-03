import {combineReducers} from 'redux';
import userReducer from './userReducer';
import countReducer from './countReducer';

const rootReducer = combineReducers({
	userReducer,
	countReducer,
	
});

export default rootReducer;