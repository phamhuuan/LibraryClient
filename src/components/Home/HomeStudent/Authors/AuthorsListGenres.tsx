import { Button } from '@material-ui/core';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import React, {ChangeEvent, ElementRef, FC, ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {GetGenresActionType} from '../../../../@types/action';
import {defaultTextInputState, TextInputStateType} from '../../../../@types/common/TextInput';
import {GenreType} from '../../../../@types/entity';
import {RootReducerType} from '../../../../@types/reducer';
import {GET_ALL_GENRES, GET_ALL_GENRES_FAIL, GET_ALL_GENRES_SUCCESS} from '../../../../actions/ActionType';
import useWindowDimensions, {WindowDimensionsType} from '../../../../hooks/useWindowDimensions';
import CustomModal from '../../../Common/CustomModal';
import Loading from '../../../Common/Loading';
import TextInput from '../../../Common/TextInput';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			position: 'absolute',
			width: '100%',
			height: '100%',
		},
	}),
);

const AuthorsListGenres: FC = () => {
	const style = useStyles();
	
	const dispatch = useDispatch();
	const genresData = useSelector<RootReducerType, GenreType[]>((state) => state.genresReducer.data);
	const getGenresMessage = useSelector<RootReducerType, string>((state) => state.genresReducer.getGenresMessage);
	type TextInputHandleType = ElementRef<typeof TextInput>;
	type LoadingModalHandleType = ElementRef<typeof CustomModal>;
	const searchGenreInputRef = useRef<TextInputHandleType>(null);
	const loadingModalRef = useRef<LoadingModalHandleType>(null);
	const divElementRef = useRef<HTMLDivElement>(null);
	const {width}: WindowDimensionsType = useWindowDimensions();
	const [filterData, setFilterData] = useState<GenreType[][]>([]);

	const updateFilterData = useCallback((data: GenreType[]) => {
		if (data.length === 0) {
			return [[]];
		}
		if (divElementRef.current) {
			const numberOfColumn = Math.floor(divElementRef.current.clientWidth / 240);
			const newData: GenreType[][] = [];
			data.forEach((genre: GenreType, index: number) => {
				if (!newData[index % numberOfColumn]) {
					newData[index % numberOfColumn] = [];
				}
				newData[index % numberOfColumn].push(genre);
			});
			return newData;
		} else {
			return [[]];
		}
	}, []);

	useEffect(() => {
		if (genresData.length === 0) {
			dispatch<GetGenresActionType>({type: GET_ALL_GENRES});
		}
	}, [dispatch, genresData.length]);

	useEffect(() => {
		setFilterData(updateFilterData(genresData));
	}, [genresData, updateFilterData, width]);

	useEffect(() => {
		if (getGenresMessage === GET_ALL_GENRES_SUCCESS) {
			setFilterData(updateFilterData(genresData));
			loadingModalRef.current?.closeModal();
		} else if (getGenresMessage === GET_ALL_GENRES_FAIL) {
			loadingModalRef.current?.closeModal();
		}
	}, [genresData, getGenresMessage, updateFilterData]);

	const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
		const searchGenreInputState: TextInputStateType = searchGenreInputRef.current?.getTextInputState() || defaultTextInputState;
		searchGenreInputRef.current?.setTextInputState({...searchGenreInputState, value: event.target.value});
		const searchText = new RegExp(event.target.value, 'i');
		setFilterData(updateFilterData(genresData.filter((genre: GenreType) => searchText.test(genre.name))));
	}

	return (
		<div style={{display: 'flex', flex: 1, height: '100%', overflowY: 'auto'}}>
			<div ref={divElementRef} style={{display: 'flex', flex: 1, marginLeft: 20, marginRight: 20, flexDirection: 'column'}}>
				<div style={{paddingTop: 10, width: '100%'}}>
					<TextInput ref={searchGenreInputRef} label={''} variant={'outlined'} style={{width: '100%'}} placeholder={'Enter genre name'} onChange={onChange} />
				</div>
				<div style={{display: 'flex', marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
					{filterData.map((genres: GenreType[], index: number): ReactNode =>  (
						<div key={index} style={{display: 'flex', flex: 1, flexDirection: 'column', marginRight: index !== filterData.length - 1 ? 10 : 0, marginLeft: index !== 0 ? 10 : 0}}>
							{genres.map((genre: GenreType, index: number): ReactNode => (
								<Button style={{display: 'flex', paddingLeft: 5, paddingRight: 5, backgroundColor: 'wheat', paddingTop: 10, paddingBottom: 10, marginTop: 10}} key={index}>
									<div style={{display: 'flex', alignItems: 'center', flex: 1}}>
										{genre.name}
									</div>
								</Button>
							))}
						</div>
					))}
				</div>
				<CustomModal ref={loadingModalRef} open className={style.paper}>
					<Loading />
				</CustomModal>
			</div>
		</div>
	);
}

export default AuthorsListGenres;
