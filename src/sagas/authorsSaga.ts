import {OK} from './../constants/Constant';
import {GET_AUTHORS_BY_GENRE_ID, GET_AUTHORS_BY_GENRE_ID_FAIL, GET_AUTHORS_BY_GENRE_ID_RESET_MESSAGE, GET_AUTHORS_BY_GENRE_ID_SUCCESS} from './../actions/ActionType';
import {put, takeLatest} from 'redux-saga/effects';
import Api from './api';
import {FailActionType, GetAuthorsByGenreIdActionType, GetAuthorsByGenreIdSuccessActionType, ResetActionType} from '../@types/action';

function* doGetAuthors(action: GetAuthorsByGenreIdActionType) {
	try {
		yield put<ResetActionType>({type: GET_AUTHORS_BY_GENRE_ID_RESET_MESSAGE});
		const response = yield Api.doGetAuthorsByGenreId(action.genreId, action.lastId, action.lastName, action.limit, action.searchString);
		if (response && response.data) {
			if (response.data.status === OK) {
				yield put<GetAuthorsByGenreIdSuccessActionType>({type: GET_AUTHORS_BY_GENRE_ID_SUCCESS, currentGenreId: action.genreId, authors: response.data.authors, hasMore: response.data.hasMore, resetData: action.resetData});
			} else {
				yield put<FailActionType>({type: GET_AUTHORS_BY_GENRE_ID_FAIL, errorCode: response.data.errorCode});
			}
		} else {
			yield put<FailActionType>({type: GET_AUTHORS_BY_GENRE_ID_FAIL, errorCode: -1});
		}
	} catch (error) {
		yield put<FailActionType>({type: GET_AUTHORS_BY_GENRE_ID_FAIL, errorCode: -1});
	}
}

export function* watchDoGetAuthors() {
	yield takeLatest(GET_AUTHORS_BY_GENRE_ID, doGetAuthors);
}