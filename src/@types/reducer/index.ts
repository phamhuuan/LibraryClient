import {AuthorType, BookResponseType, GenreType, UserType} from '../entity';

export interface UserReducerStateType {
	user?: UserType;
	loginMessage: string;
	loginErrorCode: number | undefined;
	getUserInfoFromTokenMessage: string;
	getUserInfoFromTokenErrorCode: number | undefined;
}

export interface GenresReducerStateType {
	data: GenreType[];
	getGenresMessage: string;
	getGenreErrorCode: number | undefined;
}

export interface AuthorReducerStateType {
	data: AuthorType[];
	getAuthorsByGenreIdMessage: string;
	currentGenreId: string;
	currentAuthor: AuthorType | undefined;
	getAuthorsByGenreIdErrorCode: number | undefined;
	hasMore: boolean;
}

export interface BooksReducerStateType {
	data: BookResponseType[];
	searchString: string;
	getBooksMessage: string;
	currentPage: number;
	totalPage: number;
	saveData: boolean;
}

export interface RootReducerType {
	userReducer: UserReducerStateType;
	genresReducer: GenresReducerStateType;
	authorsReducer: AuthorReducerStateType;
	booksReducer: BooksReducerStateType;
}