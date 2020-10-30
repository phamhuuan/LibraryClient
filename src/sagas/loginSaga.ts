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
import {DoLoginSagaAction} from '../@types/saga';

function *doLogin(action: DoLoginSagaAction) {
	try {
		yield put({type: LOGIN_RESET_MESSAGE});
		const response = yield Api.doLoginApi(action.dataBody);
		if (response && response.data) {
			if (response.data.status === OK) {
				yield put({type: LOGIN_SUCCESS, user: response.data.user});
				if (action.keepLogin) {
					Cookie.set('token', response.data.token, {expires: 7});
				} else {
					Cookie.set('token', response.data.token, {expires: new Date(new Date().getTime() + 30 * 60 * 1000)});
				}
			} else {
				yield put({type: LOGIN_FAIL, errorCode: response.data.errorCode})
			}
		} else {
			yield put({type: LOGIN_FAIL, errorCode: -1});
		}
	} catch (error) {
		yield put({type: LOGIN_FAIL, errorCode: -1});
	}
}

export function* watchDoLogin() {
	yield takeLatest(LOGIN, doLogin);
}

function *doGetMyUserInfoFromToken(action: {type: string, token: string}) {
	try {
		yield put({type: GET_USER_INFO_FROM_TOKEN_RESET_MESSAGE});
		const response = yield Api.doGetMyUserInfoFromToken(action.token);
		if (response && response.data) {
			if (response.data.status === OK) {
				yield put({type: GET_USER_INFO_FROM_TOKEN_SUCCESS, user: response.data.user});
			} else {
				yield put({type: GET_USER_INFO_FROM_TOKEN_FAIL, errorCode: response.data.errorCode});
			}
		} else {
			yield put({type: GET_USER_INFO_FROM_TOKEN_FAIL, errorCode: -1});
		}
	} catch (error) {
		yield put({type: GET_USER_INFO_FROM_TOKEN_FAIL, errorCode: -1});
	}
}

export function* watchDoGetMyUserInfoFromToken() {
	yield takeLatest(GET_USER_INFO_FROM_TOKEN, doGetMyUserInfoFromToken);
}