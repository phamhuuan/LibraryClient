import {OK} from './../constants/Constant';
import {GET_ALL_GENRES, GET_ALL_GENRES_FAIL, GET_ALL_GENRES_RESET_MESSAGE, GET_ALL_GENRES_SUCCESS} from './../actions/ActionType';
import {put, takeLatest} from 'redux-saga/effects';
import Api from './api';
import {FailActionType, GetGenresSuccessActionType, ResetActionType} from '../@types/action';

function* doGetAllGenres() {
	try {
		yield put<ResetActionType>({type: GET_ALL_GENRES_RESET_MESSAGE});
		const response = yield Api.doGetAllGenres();
		if (response && response.data) {
			if (response.data.status === OK) {
				yield put<GetGenresSuccessActionType>({type: GET_ALL_GENRES_SUCCESS, genres: response.data.genres});
			} else {
				yield put<FailActionType>({type: GET_ALL_GENRES_FAIL, errorCode: response.data.errorCode});
			}
		} else {
			yield put<FailActionType>({type: GET_ALL_GENRES_FAIL, errorCode: -1});
		}
	} catch (error) {
		yield put<FailActionType>({type: GET_ALL_GENRES_FAIL, errorCode: -1});
	}
}

export function* watchDoGetAllGenres() {
	yield takeLatest(GET_ALL_GENRES, doGetAllGenres);
}