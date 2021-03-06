import React, {FC} from 'react';
import {useParams} from 'react-router-dom';
import AuthorDetail from './AuthorDetail';
import AuthorsListAuthors from './AuthorsListAuthors';
import AuthorsListGenres from './AuthorsListGenres';

const AuthorScreen: FC = () => {
	type ParamsType = {
		genreId?: string;
		authorId?: string;
	}
	const {genreId, authorId} = useParams<ParamsType>();
	if (genreId === undefined) {
		return <AuthorsListGenres />;
	} else if (authorId === undefined) {
		return <AuthorsListAuthors />;
	} else {
		return <AuthorDetail />;
	}
}

export default AuthorScreen;
