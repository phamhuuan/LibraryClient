import {Button, Avatar} from '@material-ui/core';
import React, {FC} from 'react';
import {useHistory} from 'react-router-dom';
import {AuthorItemPropsType} from '../../../../@types/componentPropsType/AuthorItemPropsType';
import PathName from '../../../../constants/PathName';

const GenreItem: FC<AuthorItemPropsType> = (props: AuthorItemPropsType) => {
	const history = useHistory();
	const goToAuthorDetailScreen = (): void => {
		history.push(PathName.Authors + '/' + props.author.genreId + '/' + props.author.authorId);
	};
	return (
		<Button onClick={goToAuthorDetailScreen} style={{display: 'flex', maxWidth: 240, minHeight: 60, backgroundColor: 'ghostwhite', marginTop: 10}}>
			<div style={{display: 'flex', alignItems: 'center', textAlign: 'left', flex: 1}}>
				<Avatar alt={props.author.name} src={props.author.avatar[0]} />
				<div style={{width: 10}} />
				{props.author.name}
			</div>
		</Button>
	);
}

export default GenreItem;