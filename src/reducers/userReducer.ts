import {FailActionType, GetUserInforFromTokenSuccessActionType, LoginSuccessActionType} from '../@types/action';
import {LOGIN_SUCCESS, LOGIN_FAIL, LOGIN_RESET_MESSAGE, GET_USER_INFO_FROM_TOKEN_SUCCESS, GET_USER_INFO_FROM_TOKEN_FAIL, GET_USER_INFO_FROM_TOKEN_RESET_MESSAGE} from './../actions/ActionType';
import {UserReducerStateType} from '../@types/reducer';

const initialState: UserReducerStateType = {
	user: undefined,
	loginMessage: '',
	getUserInfoFromTokenMessage: '',
	loginErrorCode: undefined,
	getUserInfoFromTokenErrorCode: undefined
};

type ActionType = LoginSuccessActionType & GetUserInforFromTokenSuccessActionType & FailActionType;

const userReducer = (state = initialState, action: ActionType): UserReducerStateType => {
	switch (action.type) {
		case LOGIN_RESET_MESSAGE:
			state.loginMessage = '';
			state.loginErrorCode = undefined;
			return {...state};
		case LOGIN_SUCCESS:
			state.user = action.user;
			state.loginMessage = 'Login success';
			return {...state};
		case LOGIN_FAIL:
			state.loginErrorCode = action.errorCode;
			state.loginMessage = 'Login fail';
			return {...state};
		case GET_USER_INFO_FROM_TOKEN_RESET_MESSAGE:
			state.getUserInfoFromTokenMessage = '';
			state.getUserInfoFromTokenErrorCode = undefined;
			return {...state};
		case GET_USER_INFO_FROM_TOKEN_SUCCESS:
			state.getUserInfoFromTokenMessage = 'Get info success';
			state.user = action.user;
			return {...state};
		case GET_USER_INFO_FROM_TOKEN_FAIL:
			state.getUserInfoFromTokenMessage = 'Get info fail';
			state.getUserInfoFromTokenErrorCode = action.errorCode;
			return {...state};
		default:
			return state;
	}
}

export default userReducer;