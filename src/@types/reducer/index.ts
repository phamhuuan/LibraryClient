import {GenreType, UserType} from '../entity';

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

export interface RootReducerType {
	userReducer: UserReducerStateType;
	genresReducer: GenresReducerStateType;
}