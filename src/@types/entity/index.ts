export interface UserType {
	name: string;
	email: string;
	password: string;
	_id: string;
	studentId: number;
	role: string;
	userId: string;
	newAccount: boolean;
}

export interface GenreType {
	_id: string;
	name: string;
	genreId: string;
}

export interface AuthorType {
	_id: string;
	avatar: string[];
	authorId: string;
	genreId: string;
	key: string;
	name: string;
	biography: string;
}

export interface BookResponseType {
	_id: string;
	authorIdArr: string[];
	name: string;
	publishDate: string;
	location: number;
	amount: number;
	genreId: string;
	images: string[];
	authors: AuthorType[];
	genre: GenreType[];
}