import {GenresReducerActionType} from './../@types/action/index';
import {GET_ALL_GENRES_FAIL, GET_ALL_GENRES_RESET_MESSAGE, GET_ALL_GENRES_SUCCESS} from './../actions/ActionType';
import {GenresReducerStateType} from "../@types/reducer";

const initialState: GenresReducerStateType = {
	data: [],
	getGenresMessage: '',
	getGenreErrorCode: undefined,
};

const genresReducer = (state = initialState, action: GenresReducerActionType): GenresReducerStateType => {
	switch (action.type) {
		case GET_ALL_GENRES_RESET_MESSAGE:
			return {...state, getGenresMessage: ''};
		case GET_ALL_GENRES_SUCCESS:
			state.data = action.genres;
			state.getGenresMessage = GET_ALL_GENRES_SUCCESS;
			return {...state};
		case GET_ALL_GENRES_FAIL:
			state.getGenreErrorCode = action.errorCode;
			state.getGenresMessage = GET_ALL_GENRES_FAIL;
			return {...state};
		default:
			return state;
	}
}

export default genresReducer;