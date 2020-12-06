import {fork, all} from 'redux-saga/effects';
import {watchDoGetAuthors} from './authorsSaga';
import {watchDoGetAllGenres} from './genresSaga';
import {watchDoLogin, watchDoGetMyUserInfoFromToken} from './loginSaga';

export default function* rootSaga() {
	yield all([
		fork(watchDoLogin),
		fork(watchDoGetMyUserInfoFromToken),
		fork(watchDoGetAllGenres),
		fork(watchDoGetAuthors),
	]);
}