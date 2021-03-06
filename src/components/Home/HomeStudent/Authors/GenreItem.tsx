import {Button} from '@material-ui/core';
import React, {FC} from 'react';
import {useHistory} from 'react-router-dom';
import {GenreItemPropsType} from '../../../../@types/componentPropsType/GenreItemPropsType';
import PathName from '../../../../constants/PathName';
import '../../../../styles/css/index.css';

const GenreItem: FC<GenreItemPropsType> = (props: GenreItemPropsType) => {
	const history = useHistory()
	const goToListAuthorScreen = (): void => {
		history.push(PathName.Authors + '/' + props.genre.genreId);
	};
	return (
		<Button onClick={goToListAuthorScreen} className={'authorButton'}>
			<div className={'authorButtonText'}>
				{props.genre.name}
			</div>
		</Button>
	);
}

export default GenreItem;