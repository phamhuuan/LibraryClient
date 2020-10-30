import {fork, all} from 'redux-saga/effects';
import {watchDoLogin, watchDoGetMyUserInfoFromToken} from './loginSaga';

export default function* rootSaga() {
	yield all([
		fork(watchDoLogin),
		fork(watchDoGetMyUserInfoFromToken),
	]);
}