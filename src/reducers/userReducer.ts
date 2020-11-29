import {LoginReducerActionType} from '../@types/action';
import {LOGIN_SUCCESS, LOGIN_FAIL, LOGIN_RESET_MESSAGE, GET_USER_INFO_FROM_TOKEN_SUCCESS, GET_USER_INFO_FROM_TOKEN_FAIL, GET_USER_INFO_FROM_TOKEN_RESET_MESSAGE, CLEAR_LOGIN_DATA} from './../actions/ActionType';
import {UserReducerStateType} from '../@types/reducer';

const initialState: UserReducerStateType = {
	user: undefined,
	loginMessage: '',
	getUserInfoFromTokenMessage: '',
	loginErrorCode: undefined,
	getUserInfoFromTokenErrorCode: undefined
};

const userReducer = (state = initialState, action: LoginReducerActionType): UserReducerStateType => {
	switch (action.type) {
		case LOGIN_RESET_MESSAGE:
			state.loginMessage = '';
			state.loginErrorCode = undefined;
			return {...state};
		case LOGIN_SUCCESS:
			state.user = action.user;
			state.loginMessage = LOGIN_SUCCESS;
			return {...state};
		case LOGIN_FAIL:
			state.loginErrorCode = action.errorCode;
			state.loginMessage = LOGIN_FAIL;
			return {...state};
		case GET_USER_INFO_FROM_TOKEN_RESET_MESSAGE:
			state.getUserInfoFromTokenMessage = '';
			state.getUserInfoFromTokenErrorCode = undefined;
			return {...state};
		case GET_USER_INFO_FROM_TOKEN_SUCCESS:
			state.getUserInfoFromTokenMessage = GET_USER_INFO_FROM_TOKEN_SUCCESS;
			state.user = action.user;
			return {...state};
		case GET_USER_INFO_FROM_TOKEN_FAIL:
			state.getUserInfoFromTokenMessage = GET_USER_INFO_FROM_TOKEN_FAIL;
			state.getUserInfoFromTokenErrorCode = action.errorCode;
			return {...state};
		case CLEAR_LOGIN_DATA:
			return {...state, user: undefined};
		default:
			return state;
	}
}

export default userReducer;