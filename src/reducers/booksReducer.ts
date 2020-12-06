import {BooksReducerActionType} from "../@types/action";
import {BooksReducerStateType} from "../@types/reducer";
import {GET_BOOKS_SUCCESS, GET_BOOKS_FAIL, GET_BOOKS_RESET_MESSAGE, GET_BOOKS_SAVE_DATA} from "../actions/ActionType";

const initialState: BooksReducerStateType = {
	data: [],
	searchString: '',
	getBooksMessage: '',
	currentPage: 1,
	totalPage: 0,
	saveData: false,
};

const booksReducer = (state = initialState, action: BooksReducerActionType) => {
	switch (action.type) {
		case GET_BOOKS_RESET_MESSAGE:
			state.getBooksMessage = '';
			return {...state};
		case GET_BOOKS_SAVE_DATA:
			if (action.save) {
				console.log('here');
				state.saveData = true;
			} else {
				state.data = [];
				state.searchString = '';
				state.getBooksMessage = '';
				state.currentPage = 1;
				state.totalPage = 0;
				state.saveData = false;
			}
			return {...state};
		case GET_BOOKS_SUCCESS:
			state.data = action.books;
			state.searchString = action.searchString;
			state.getBooksMessage = GET_BOOKS_SUCCESS;
			state.totalPage = action.totalPage;
			state.currentPage = action.currentPage;
			return {...state};
		case GET_BOOKS_FAIL:
			state.getBooksMessage = GET_BOOKS_FAIL;
			return {...state};
		default:
			return state;
	}
};

export default booksReducer;
