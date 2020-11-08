import React, {FC} from 'react';
import {useParams} from 'react-router-dom';
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
		return <div />;
	} else {
		return <div />;
	}
}

export default AuthorScreen;
