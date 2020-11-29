import {AuthorsReducerActionType} from "../@types/action";
import {AuthorReducerStateType} from "../@types/reducer";
import {GET_AUTHORS_BY_GENRE_ID_FAIL, GET_AUTHORS_BY_GENRE_ID_RESET_MESSAGE, GET_AUTHORS_BY_GENRE_ID_SUCCESS} from "../actions/ActionType";

const initialState: AuthorReducerStateType = {
	data: [],
	getAuthorsByGenreIdMessage: '',
	currentGenreId: '',
	currentAuthor: undefined,
	getAuthorsByGenreIdErrorCode: undefined,
	hasMore: true,
};

const authorsReducer = (state = initialState, action: AuthorsReducerActionType) => {
	switch (action.type) {
		case GET_AUTHORS_BY_GENRE_ID_RESET_MESSAGE:
			state.getAuthorsByGenreIdMessage = '';
			state.getAuthorsByGenreIdErrorCode = undefined;
			return {...state};
		case GET_AUTHORS_BY_GENRE_ID_SUCCESS:
			state.currentGenreId = action.currentGenreId;
			if (action.resetData) {
				state.data = action.authors;
			} else {
				state.data = state.data.concat(action.authors);
			}
			state.hasMore = action.hasMore;
			state.getAuthorsByGenreIdMessage = GET_AUTHORS_BY_GENRE_ID_SUCCESS;
			return {...state};
		case GET_AUTHORS_BY_GENRE_ID_FAIL:
			state.getAuthorsByGenreIdMessage = GET_AUTHORS_BY_GENRE_ID_FAIL;
			state.getAuthorsByGenreIdErrorCode = action.errorCode;
			return {...state};
		default:
			return state;
	}
};

export default authorsReducer;
