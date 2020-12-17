import {Button} from '@material-ui/core';
import React, {FC} from 'react';
import {useHistory} from 'react-router-dom';
import {GenreItemPropsType} from '../../../../@types/componentPropsType/GenreItemPropsType';
import PathName from '../../../../constants/PathName';

const GenreItem: FC<GenreItemPropsType> = (props: GenreItemPropsType) => {
	const history = useHistory()
	const goToListAuthorScreen = (): void => {
		history.push(PathName.Authors + '/' + props.genre.genreId);
	};
	return (
		<Button onClick={goToListAuthorScreen} style={{display: 'flex', paddingLeft: 5, paddingRight: 5, backgroundColor: 'wheat', paddingTop: 10, paddingBottom: 10, marginTop: 10}}>
			<div style={{display: 'flex', alignItems: 'center', textAlign: 'left', flex: 1}}>
				{props.genre.name}
			</div>
		</Button>
	);
}

export default GenreItem;