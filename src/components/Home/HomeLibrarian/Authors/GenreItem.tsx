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
		<div onClick={goToListAuthorScreen} className={'authorButton'}>
			<div className={'authorButtonText'}>
				{props.genre.name}
			</div>
		</div>
	);
}

export default GenreItem;