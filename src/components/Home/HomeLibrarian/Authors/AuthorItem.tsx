import {Avatar} from '@material-ui/core';
import React, {FC} from 'react';
import {useHistory} from 'react-router-dom';
import {AuthorItemPropsType} from '../../../../@types/componentPropsType/AuthorItemPropsType';
import PathName from '../../../../constants/PathName';
import '../../../../styles/css/index.css';

const GenreItem: FC<AuthorItemPropsType> = (props: AuthorItemPropsType) => {
	const history = useHistory();
	const goToAuthorDetailScreen = (): void => {
		history.push(PathName.Authors + '/' + props.author.genreId + '/' + props.author.authorId);
	};
	return (
		<div onClick={goToAuthorDetailScreen} className={'authorButton'}>
			<div className={'authorButtonText'}>
				<Avatar alt={props.author.name} src={props.author.avatar[0]} />
				<div style={{width: 10}} />
				{props.author.name}
			</div>
		</div>
	);
}

export default GenreItem;