import {OK} from './../constants/Constant';
import {
	LOGIN,
	LOGIN_FAIL,
	LOGIN_RESET_MESSAGE,
	LOGIN_SUCCESS,
	GET_USER_INFO_FROM_TOKEN_RESET_MESSAGE,
	GET_USER_INFO_FROM_TOKEN_FAIL, GET_USER_INFO_FROM_TOKEN, GET_USER_INFO_FROM_TOKEN_SUCCESS
} from './../actions/ActionType';
import {put, takeLatest} from 'redux-saga/effects';
import Api from './api';
import Cookie from 'js-cookie';
import {DoLoginSagaAction, DoGetUserInfoFromTokenSagaAction} from '../@types/saga';
import {FailActionType, GetUserInforFromTokenSuccessActionType, LoginSuccessActionType, ResetActionType} from '../@types/action';

function* doLogin(action: DoLoginSagaAction) {
	try {
		// put action sang reducer de xoa message login
		yield put<ResetActionType>({type: LOGIN_RESET_MESSAGE});
		// call api login
		const response = yield Api.doLoginApi(action.dataBody);
		if (response && response.data) {
			if (response.data.status === OK) {
				// neu login thanh cong (mo loginReducer.ts ra de xem phan xu li)
				yield put<LoginSuccessActionType>({type: LOGIN_SUCCESS, user: response.data.user});
				if (action.keepLogin) {
					// neu keep login thi cho token luu trong cookie qua han trong 7 ngay
					Cookie.set('token', response.data.token, {expires: 7});
				} else {
					// neu khong thi se duy tri dang nhap trong 30 phut
					Cookie.set('token', response.data.token, {expires: new Date(new Date().getTime() + 30 * 60 * 1000)});
				}
			} else {
				// neu login that bai
				yield put<FailActionType>({type: LOGIN_FAIL, errorCode: response.data.errorCode})
			}
		} else {
			yield put<FailActionType>({type: LOGIN_FAIL, errorCode: -1});
		}
	} catch (error) {
		yield put<FailActionType>({type: LOGIN_FAIL, errorCode: -1});
	}
}

export function* watchDoLogin() {
	// redux saga se lang nghe action login
	yield takeLatest(LOGIN, doLogin);
}

function* doGetMyUserInfoFromToken(action: DoGetUserInfoFromTokenSagaAction) {
	try {
		yield put<ResetActionType>({type: GET_USER_INFO_FROM_TOKEN_RESET_MESSAGE});
		const response = yield Api.doGetMyUserInfoFromToken(action.token);
		if (response && response.data) {
			if (response.data.status === OK) {
				console.log(response.data);
				yield put<GetUserInforFromTokenSuccessActionType>({type: GET_USER_INFO_FROM_TOKEN_SUCCESS, user: response.data.user});
			} else {
				yield put<FailActionType>({type: GET_USER_INFO_FROM_TOKEN_FAIL, errorCode: response.data.errorCode});
			}
		} else {
			yield put<FailActionType>({type: GET_USER_INFO_FROM_TOKEN_FAIL, errorCode: -1});
		}
	} catch (error) {
		yield put<FailActionType>({type: GET_USER_INFO_FROM_TOKEN_FAIL, errorCode: -1});
	}
}

export function* watchDoGetMyUserInfoFromToken() {
	yield takeLatest(GET_USER_INFO_FROM_TOKEN, doGetMyUserInfoFromToken);
}