import React, {ElementRef, FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Button, Avatar} from '@material-ui/core';
import PathName from '../../../../constants/PathName';
import {useHistory, useParams} from 'react-router';
import {AuthorType} from '../../../../@types/entity';
import Api from '../../../../sagas/api';
import {OK} from '../../../../constants/Constant';
import CustomModal from '../../../Common/CustomModal';
import NetworkErrorModal from '../../../Common/NetworkErrorModal';
import Loading from '../../../Common/Loading';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import ERROR_CODE from '../../../../constants/ErrorCode';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			position: 'absolute',
			width: '100%',
			height: '100%',
		},
	}),
);

const AuthorDetail: FC = () => {
	const style = useStyles();
	const divElementRef = useRef<HTMLDivElement>(null);
	const history = useHistory();
	type ModalHandleType = ElementRef<typeof CustomModal>;
	const loadingModalRef = useRef<ModalHandleType>(null);
	const networkErrorModalRef = useRef<ModalHandleType>(null);
	type ParamsType = {
		genreId: string;
		authorId: string;
	}
	const {genreId, authorId}: ParamsType = useParams();
	type StateType = {
		author: AuthorType | undefined;
		genreName: string;
	};
	const [state, setState] = useState<StateType>({author: undefined, genreName: ''});

	const getAuthorInfo = useCallback(async (): Promise<void> => {
		const response = await Api.getAuthorInfo(authorId);
		loadingModalRef.current?.closeModal();
		if (response && response.data) {
			if (response.data.status === OK) {
				setState({author: response.data.author, genreName: response.data.genreName});
			} else {
				if (response.data.errorCode === ERROR_CODE.GET_AUTHOR_INFO_ERROR.AUTHOR_NOT_EXSIST) {
					history.replace(PathName.Authors + '/' + genreId);
				} else {
					networkErrorModalRef.current?.openModal();
				}
			}
		} else {
			networkErrorModalRef.current?.openModal();
		}
	}, [authorId, genreId, history]);

	useEffect(() => {
		getAuthorInfo();
	}, [getAuthorInfo]);

	const goBack = useCallback((): void => {
		history.goBack();
		// history.replace(`${PathName.Authors}/${genreId}`, {});
	}, [history]);

	const backButton = useMemo((): ReactNode => (
		<div>
			<Button onClick={goBack} style={{fontSize: 20}}>Back</Button>
		</div>
	), [goBack]);

	const authorInfo = useMemo((): ReactNode => {
		if (state.author) {
			return (
				<>
					<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<Avatar 
							style={{height: 200, width: 200}} 
							alt={state.author.name} 
							src={state.author.avatar[0]} />
						<p style={{fontSize: 30, marginTop: 10, fontWeight: 'bold'}}>{state.author.name}</p>
					</div>
					<div style={{alignSelf: 'left'}}>
						<p style={{fontSize: 30, marginLeft: 10, fontWeight: 'bold'}}>1. Biography</p>
						<p style={{textAlign: 'justify', marginLeft: 20, marginRight: 50}}>{state.author.biography}</p>
						<p style={{fontSize: 30, marginLeft: 10, fontWeight: 'bold'}}>2. Speciality</p>
						<p style={{textAlign: 'justify', marginLeft: 20, marginRight: 50}}>{state.genreName}</p>
					</div>
				</>
			);
		}
		return <div />;
	}, [state]);

	const loadingModal = useMemo((): ReactNode => (
		<CustomModal ref={loadingModalRef} open className={style.paper}>
			<Loading />
		</CustomModal>
	), [style.paper]);

	const networkErrorModal = useMemo((): ReactNode => (
		<NetworkErrorModal ref={networkErrorModalRef} />
	), []);

	return (
		<div style={{display: 'flex', flex: 1, height: '100%', overflowY: 'auto'}}>
			<div 
					ref={divElementRef} 
					style={{display: 'flex', flex: 1, marginLeft: 20, marginRight: 20, flexDirection: 'column'}}>
				{backButton}
				{authorInfo}
				{loadingModal}
				{networkErrorModal}
			</div>
		</div>
	);
}

export default AuthorDetail;
